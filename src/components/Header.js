import {Image, StyleSheet, Text, View} from 'react-native';
import logo from '../assets/logoPTA.png';

const Header = () => {
  return (
    <View style={styles.headerRow}>
      <Image style={styles.logo} source={logo} />
      <Text style={styles.headerText}>emprendeSG</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  logo: {
    height: 70,
    resizeMode: 'contain',
  },
});

export default Header;
