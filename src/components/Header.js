import {Platform, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const Header = () => {
  return (
    <View style={styles.headerRow}>
      <FastImage
        style={styles.logo}
        source={require('../assets/logoPTA.png')}
      />
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
    width: 70,
    resizeMode: 'contain',
  },
});

export default Header;
