import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import logo from '../assets/logoPTA.png';

const Header = () => {
  return (
    <View style={styles.headerRow}>
      <Image style={styles.logo} source={logo} />
      <Text
        style={{
          ...styles.headerText,
          fontFamily: Platform.android ? 'chalkduster' : 'Chalkduster',
        }}>
        emprendeSG
      </Text>
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
    color: 'black',
    fontSize: 15,
  },
  logo: {
    height: 70,
    resizeMode: 'contain',
  },
});

export default Header;
