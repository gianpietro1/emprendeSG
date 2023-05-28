import {useState} from 'react';
import {Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StarRating = ({item}) => {
  const starRatingOptions = [1, 2, 3, 4, 5];

  const [starRating, setStarRating] = useState(null);

  const animatedButtonScale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.5,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };

  const handleStarRating = async option => {
    const localVotes = await AsyncStorage.getItem('@votesObject');
    if (localVotes) {
      const localVotesJSON = JSON.parse(localVotes);
      if (localVotesJSON[item.name]) {
        const lastVote = localVotesJSON[item.name];
        const dateDiff = Date.now() - lastVote;
        if (dateDiff < 86400000) {
          // can't vote
          Alert.alert(
            'Voto denegado',
            `No puedes votar por el mismo negocio en menos de 24 horas`,
            [
              {
                text: 'OK',
                style: 'cancel',
              },
            ],
          );
        } else {
          // can vote
          vote(localVotesJSON, option);
        }
      } else {
        // can vote
        vote(localVotesJSON, option);
      }
    } else {
      // can vote
      vote(null, option);
    }
  };

  const vote = (localVotesJSON, option) => {
    setStarRating(option);
    Alert.alert(
      'Confirmar voto',
      `¿Deseas otorgar ${option} estrellas?\n(solo puedes votar 1 vez al día)`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            await axios.put(
              `https://sg.radioperu.pe/api/business/vote?name=${item.name}`,
              {
                vote: option,
              },
            );
            if (!localVotesJSON) {
              await AsyncStorage.setItem(
                '@votesObject',
                JSON.stringify({[item.name]: Date.now()}),
              );
            } else {
              if (localVotesJSON[item.name]) {
                await AsyncStorage.mergeItem(
                  '@votesObject',
                  JSON.stringify({[item.name]: Date.now()}),
                );
              } else {
                await AsyncStorage.setItem(
                  '@votesObject',
                  JSON.stringify({
                    ...localVotesJSON,
                    [item.name]: Date.now(),
                  }),
                );
              }
            }
          },
        },
      ],
    );
  };

  const animatedScaleStyle = {
    transform: [{scale: animatedButtonScale}],
  };

  return (
    <View style={styles.stars}>
      {starRatingOptions.map(option => (
        <TouchableWithoutFeedback
          onPressIn={() => handlePressIn(option)}
          onPressOut={() => handlePressOut(option)}
          onPress={() => handleStarRating(option)}
          key={option}>
          <Animated.View style={animatedScaleStyle}>
            <MaterialIcons
              name={starRating >= option ? 'star' : 'star-border'}
              size={45}
              style={
                starRating >= option
                  ? styles.starSelected
                  : styles.starUnselected
              }
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stars: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  starUnselected: {
    color: '#aaa',
  },
  starSelected: {
    color: '#FDDA0D',
  },
});

export default StarRating;
