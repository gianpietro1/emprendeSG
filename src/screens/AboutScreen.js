import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AboutScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.aboutTextView}>
        <Text style={styles.aboutText}>
          Aplicación creada por el grupo PTA Promoción 2027 del Colegio
          St.George's Lima
        </Text>
        <Text style={styles.aboutText}>
          Todo el contenido es administrado y es responsabilidad de los padres
          de familia
        </Text>
        <Text style={styles.aboutText}>
          © 2023 Todos los derechos reservados
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  aboutText: {
    marginTop: 10,
    textAlign: 'center',
  },
  aboutTextView: {
    width: '80%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyItems: 'center',
    marginTop: SCREEN_HEIGHT / 2 - 120,
  },
});

export default AboutScreen;
