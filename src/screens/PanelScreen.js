import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sgBackend from '../api/sgBackend';
import {Button, Card, Input} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';
import Header from '../components/Header';
import {Context as UserContext} from '../context/UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const FONT_SIZE = 0.02 * SCREEN_HEIGHT > 16 ? 16 : 0.02 * SCREEN_HEIGHT;

const PanelScreen = ({navigation}) => {
  const {
    setGlobalUser,
    setGlobalToken,
    state: {user, userToken},
  } = useContext(UserContext);
  const [news, setNews] = useState([]);
  const [loginUser, setLoginUser] = useState();
  const [loginPassword, setLoginPassword] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [securedPassword, setSecuredPassword] = useState(true);

  const getItems = async () => {
    const itemsResponse = await sgBackend.get('/panelitems');
    setNews(itemsResponse.data);
  };

  useEffect(() => {
    getItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getItems();
    }, []),
  );

  const renderSocialIcon = (icon, color) => {
    return (
      <View style={styles.socialIconView}>
        <MaterialCommunityIcons
          name={icon}
          size={0.09 * SCREEN_WIDTH}
          color={color ? color : '#C8C8C8'}
        />
      </View>
    );
  };

  const formatWhatsapp = whatsapp => {
    let finalWhatsapp;
    if (whatsapp.slice(0, 2) === '51') {
      finalWhatsapp = '+' + whatsapp;
    } else {
      finalWhatsapp = '+51' + whatsapp;
    }
    return finalWhatsapp;
  };

  const contactIcons = (whatsapp, username, email, title) => {
    const whatsappFinal = formatWhatsapp(whatsapp);
    const whatsappHelloText = `Hola, te escribo por tu pedido "${title}" en la aplicación emprendeSG`;
    return (
      <View style={styles.contactRow}>
        <View>
          <Text>Por: </Text>
          <Text style={styles.contactText}>{username}</Text>
        </View>
        <View style={styles.contactIcons}>
          <TouchableOpacity
            onPress={() => {
              whatsapp
                ? Linking.openURL(
                    `whatsapp://send?text=${whatsappHelloText}&phone=${whatsappFinal}`,
                  )
                : null;
            }}>
            {renderSocialIcon('whatsapp', whatsapp ? '#1DB954' : null)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              email ? Linking.openURL(`mailto:${email}`) : null;
            }}>
            {renderSocialIcon('email', email ? 'orange' : null)}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const deleteItem = id => {
    // console.log('delete', id);
    Alert.alert('Confirmar borrado', '¿Deseas borrar tu aviso?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí',
        onPress: async () => {
          await sgBackend.delete(`/panelitem/?id=${id}`);
          await getItems();
        },
      },
    ]);
  };

  const renderCards = newsItems => {
    newsItems.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return newsItems.map(newsItem => {
      return (
        <Card
          key={newsItem._id}
          containerStyle={{
            width: 0.9 * SCREEN_WIDTH,
          }}>
          <View style={styles.cardTitle}>
            <Card.Title>{newsItem.name}</Card.Title>
            {newsItem.ownerEmail === user?.email || user?.role === 'admin' ? (
              <TouchableOpacity onPress={() => deleteItem(newsItem._id)}>
                <MaterialCommunityIcons
                  size={20}
                  name={'trash-can-outline'}
                  style={styles.trashIconStyle}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.dateView}>
            <Text style={styles.dateText}>
              {newsItem.date ? Moment(newsItem.date).format('lll') : null}
            </Text>
          </View>
          <Card.Divider />
          <Text style={{marginVertical: 10}}>{newsItem.description}</Text>
          {newsItem.image ? (
            <FastImage
              style={{
                alignSelf: 'center',
                justifyContent: 'flex-end',
                aspectRatio: 1,
                marginVertical: 10,
                width: 0.7 * SCREEN_WIDTH,
              }}
              source={{uri: newsItem.image}}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : null}
          <Card.Divider />
          {contactIcons(
            newsItem.ownerWhatsapp,
            newsItem.ownerName,
            newsItem.ownerEmail,
            newsItem.name,
          )}
        </Card>
      );
    });
  };

  const newPostifUserPresent = async () => {
    if (user) {
      navigation.navigate('PanelCreateScreen');
    } else {
      setModalVisible(true);
    }
  };

  const logout = async () => {
    setGlobalUser(null);
    setGlobalToken(null);
    AsyncStorage.removeItem('userToken');
  };

  const login = async () => {
    // console.log('login in with', loginUser, loginPassword);
    try {
      await sgBackend
        .post('/login', {
          email: loginUser,
          password: loginPassword,
        })
        .then(async response => {
          const user = response?.data;
          const userToken = response?.data?.token;
          if (userToken) {
            setGlobalUser(user);
            setGlobalToken(userToken);
            await AsyncStorage.setItem('userToken', userToken);
            setModalVisible(false);
            navigation.navigate('PanelCreateScreen');
          }
        });
    } catch (e) {
      AsyncStorage.removeItem('userToken');
      setGlobalUser(null);
      Alert.alert('Error en sus credenciales o servidor.', [
        {
          text: 'OK',
          style: 'cancel',
        },
      ]);
    }
  };

  const loginModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Para subir pedidos debes ingresar con tus credenciales
            </Text>
            <Input
              leftIcon={{type: 'font-awesome', name: 'user'}}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputStyle}
              inputContainerStyle={styles.inputContainerStyle}
              placeholder="usuario"
              onChangeText={setLoginUser}
              value={loginUser}
            />
            <Input
              leftIcon={{type: 'font-awesome', name: 'key'}}
              rightIcon={
                <Button
                  style={styles.cancelButtonStyle}
                  type="clear"
                  icon={
                    <MaterialCommunityIcons
                      size={20}
                      name={securedPassword ? 'eye' : 'eye-outline'}
                      style={styles.cancelIconStyle}
                    />
                  }
                  onPress={() => setSecuredPassword(!securedPassword)}
                />
              }
              autoCapitalize="none"
              secureTextEntry={securedPassword}
              autoCorrect={false}
              style={styles.inputStyle}
              inputContainerStyle={styles.inputContainerStyle}
              placeholder="contraseña"
              onChangeText={setLoginPassword}
              value={loginPassword}
            />
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={login}>
                <Text style={styles.textStyle}>Ingresar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {loginModal()}
      <ScrollView>{news.length ? renderCards(news) : null}</ScrollView>
      <View style={{height: 20}} />
      <View style={styles.buttonView}>
        <Button
          buttonStyle={styles.button}
          color="#0047AB"
          disabled={!userToken}
          icon={{
            name: 'reply',
            type: 'font-awesome',
            size: 0.04 * SCREEN_WIDTH,
            color: 'white',
          }}
          onPress={() => logout()}>
          Salir
        </Button>
        <Button
          buttonStyle={styles.button}
          color="#0047AB"
          icon={{
            name: 'edit',
            type: 'font-awesome',
            size: 0.04 * SCREEN_WIDTH,
            color: 'white',
          }}
          onPress={() => newPostifUserPresent()}>
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
  contactIcons: {
    flexDirection: 'row',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactText: {
    color: 'navy',
    fontWeight: 'bold',
  },
  cardTitle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  // modal
  buttonRow: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  inputContainerStyle: {
    borderBottomWidth: 1,
    width: '100%',
  },
  inputStyle: {
    fontSize: FONT_SIZE,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  trashIconStyle: {
    color: 'red',
  },
});

export default PanelScreen;
