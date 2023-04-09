import {
  Button,
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';
import Header from '../components/Header';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ItemScreen = ({route, navigation}) => {
  const {activeIndex, items} = route.params;
  console.log(activeIndex);

  const renderSocialIcon = (icon, color) => {
    return (
      <View style={styles.socialIconView}>
        <MaterialCommunityIcons
          name={icon}
          size={0.07 * SCREEN_HEIGHT}
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
            email ? Linking.openURL(email) : null;
          }}>
          {renderSocialIcon('email', email ? '#1DB954' : null)}
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = index => {
    const item = items[index];
    return (
      <>
        <Card.Title style={styles.title}>{item.name}</Card.Title>
        <Card.Image style={styles.flyer} source={item.flyer}></Card.Image>
        <Text style={styles.description}>{item.description}</Text>
        {renderSocial(item)}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Button
        title={'Back'}
        onPress={() => navigation.navigate('MainScreen')}
      />
      <Card containerStyle={styles.itemView}>
        <Carousel
          defaultIndex={0}
          autoPlay={false}
          data={[...new Array(items.length).keys()]}
          scrollAnimationDuration={200}
          renderItem={({index}) => renderItem(index)}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
        />
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    marginVertical: 5,
    textAlign: 'center',
  },
  itemView: {
    alignItems: 'center',
    flexDirection: 'column',
    width: 0.95 * SCREEN_WIDTH,
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
    height: 0.9 * SCREEN_WIDTH,
    width: 0.9 * SCREEN_WIDTH,
    resizeMode: 'contain',
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
  },
});

export default ItemScreen;
