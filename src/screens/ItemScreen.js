import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Card} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';
import Header from '../components/Header';
import StarRating from '../components/StarRating';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const FONT_SIZE = 0.03 * SCREEN_WIDTH > 12 ? 12 : 0.03 * SCREEN_WIDTH;

const ItemScreen = ({route, navigation}) => {
  const {activeIndex, items} = route.params;

  const renderSocialIcon = (icon, color) => {
    return (
      <View style={styles.socialIconView}>
        <MaterialCommunityIcons
          name={icon}
          size={0.12 * SCREEN_WIDTH}
          color={color ? color : '#C8C8C8'}
        />
      </View>
    );
  };

  const renderSocial = item => {
    const {facebook, instagram, whatsapp, web, email} = item;
    const whatsappHelloText =
      'Hola, vengo del app emprendeSG y necesito información.';
    return (
      <View style={styles.socialView}>
        <TouchableOpacity
          onPress={() => {
            facebook ? Linking.openURL(facebook) : null;
          }}>
          {renderSocialIcon('facebook', facebook ? '#3b5998' : null)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            instagram ? Linking.openURL(instagram) : null;
          }}>
          {renderSocialIcon('instagram', instagram ? '#f73466' : null)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            whatsapp
              ? Linking.openURL(
                  `whatsapp://send?text=${whatsappHelloText}&phone=${whatsapp}`,
                )
              : null;
          }}>
          {renderSocialIcon('whatsapp', whatsapp ? '#1DB954' : null)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            web ? Linking.openURL(web) : null;
          }}>
          {renderSocialIcon('web', web ? '#1DA1F2' : null)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            email ? Linking.openURL(`mailto:${email}`) : null;
          }}>
          {renderSocialIcon('email', email ? 'orange' : null)}
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = index => {
    const item = items[index];
    return (
      <Card containerStyle={styles.itemView}>
        <View style={styles.titleView}>
          <Button
            buttonStyle={styles.button}
            color="red"
            icon={{
              name: 'arrow-left',
              type: 'font-awesome',
              size: 0.025 * SCREEN_WIDTH,
              color: 'white',
            }}
            onPress={() => navigation.navigate('MainScreen')}
          />
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.voteView}>
            <MaterialCommunityIcons
              name={'star'}
              size={0.06 * SCREEN_WIDTH}
              color={'#FDDA0D'}
            />
            <Text style={styles.voteNumber}>
              {Math.round(item.voteAvg * 10) / 10}
            </Text>
          </View>
        </View>
        <FastImage
          style={styles.flyer}
          source={{uri: item.flyer}}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.description}>{item.description}</Text>
        {renderSocial(item)}
        <StarRating item={item} />
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Carousel
        defaultIndex={activeIndex}
        width={0.95 * SCREEN_WIDTH}
        autoPlay={false}
        data={[...new Array(items.length).keys()]}
        renderItem={({index}) => renderItem(index)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    shadowColor: 'grey',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 8,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  description: {
    fontSize: FONT_SIZE,
    marginVertical: 5,
    textAlign: 'center',
  },
  itemView: {
    alignItems: 'center',
    flexDirection: 'column',
    shadowColor: 'grey',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 8,
  },
  flyer: {
    justifyContent: 'flex-start',
    height: 0.8 * SCREEN_WIDTH,
    marginTop: 10,
    width: 0.8 * SCREEN_WIDTH,
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 1.5 * FONT_SIZE,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  voteView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  voteNumber: {
    fontSize: 1 * FONT_SIZE,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default ItemScreen;
