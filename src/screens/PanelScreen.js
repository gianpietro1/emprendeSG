import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Card} from '@rneui/themed';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';
import Header from '../components/Header';

const SCREEN_WIDTH = Dimensions.get('window').width;

const news = [
  {
    id: 1,
    title: 'Pedido',
    body: 'Les anunciamos esto.',
    date: '2023-03-12T23:00:00.000+00:00',
    image:
      'https://cdn1.byjus.com/wp-content/uploads/2021/11/Rectangular-Prism-1.png',
  },
  {
    id: 2,
    title: 'ANUNCIO 2',
    body: 'Les anunciamos esto otro.',
    date: '2023-03-12T23:00:00.000+00:00',
    image: 'https://i.scdn.co/image/ab6761610000e5ebf34e0f1698c3fe96b7c5e772',
  },
  {
    id: 3,
    title: 'ANUNCIO 3',
    body: 'Les anunciamos esto otro también.',
    date: '2023-03-12T23:00:00.000+00:00',
    image: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg',
  },
];

const PanelScreen = ({navigation}) => {
  const renderCards = newsItems => {
    return newsItems.map(newsItem => {
      return (
        <Card
          key={newsItem.id}
          containerStyle={{
            width: 0.9 * SCREEN_WIDTH,
          }}>
          <View style={styles.cardTitle}>
            <Card.Title>{newsItem.title}</Card.Title>
            <View style={styles.dateView}>
              <Text style={styles.dateText}>
                {Moment(newsItem.date).format('lll')}
              </Text>
            </View>
          </View>
          <Card.Divider />
          <Text>{newsItem.body}</Text>
          <FastImage
            style={{
              justifyContent: 'flex-start',
              aspectRatio: 1,
              marginTop: 10,
              width: 0.8 * SCREEN_WIDTH,
            }}
            source={{uri: newsItem.image}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Card>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>{renderCards(news)}</ScrollView>
      <View style={{height: 20}} />
      <View style={styles.buttonView}>
        <Button
          buttonStyle={styles.button}
          color="#0047AB"
          icon={{
            name: 'edit',
            type: 'font-awesome',
            size: 0.04 * SCREEN_WIDTH,
            color: 'white',
          }}
          onPress={() => navigation.navigate('PanelCreateScreen')}>
          Nuevo
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginEnd: '5%',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    justifyContent: 'space-between',
  },
  dateView: {
    alignSelf: 'flex-end',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  image: {
    justifyContent: 'flex-start',
    aspectRatio: 1,
    marginTop: 10,
    width: 0.8 * SCREEN_WIDTH,
  },
});

export default PanelScreen;
