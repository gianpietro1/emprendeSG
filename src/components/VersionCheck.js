import {useState, useEffect, useContext} from 'react';
import {Text, View, Linking, StyleSheet, Dimensions} from 'react-native';
import checkVersion from 'react-native-store-version';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const FONT_SIZE = 0.024 * SCREEN_HEIGHT;
const LOCAL_VERSION = '1.0.0';

const VersionChecker = () => {
  const [remoteVersion, setRemoteVersion] = useState('old');
  const [localVersion, setLocalVersion] = useState(LOCAL_VERSION);

  const iosURL = 'settings.ios_url';
  const iosStoreURL = 'https://' + iosURL;
  const iosAppStoreURL = 'itms-apps://' + iosURL;
  const androidURL = 'settings.android_url';
  const androidStoreURL = 'https://' + androidURL;

  useEffect(() => {
    (async () => {
      if (iosURL && androidURL) {
        setRemoteVersion(await versionCheck());
      }
      setLocalVersion(LOCAL_VERSION);
    })();
  }, [iosURL, androidURL]);

  const versionCheck = async () => {
    try {
      const check = await checkVersion({
        version: LOCAL_VERSION, // app local version --> 1.5.51 IS ANDROID ONLY, NEXT STEP IS 52 FOR BOTH
        iosStoreURL,
        androidStoreURL,
        country: 'pe',
      });

      if (check.result) {
        return check.result;
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const renewVersion = () => {
    return remoteVersion ? (
      <View
        style={{
          ...styles.renewVersion,
          backgroundColor: '#383838',
        }}>
        <Text style={{color: 'white', fontSize: 0.7 * FONT_SIZE}}>
          Hay una nueva versión, actualiza{' '}
          <Text
            style={{color: 'yellow'}}
            onPress={() =>
              Linking.openURL(
                Platform.OS === 'ios' ? iosAppStoreURL : androidStoreURL,
              )
            }>
            aquí
          </Text>
        </Text>
      </View>
    ) : null;
  };

  return <>{remoteVersion === 'new' ? renewVersion() : null}</>;
};

const styles = StyleSheet.create({
  renewVersion: {
    alignItems: 'center',
    bottom: 0,
    padding: 5,
    position: 'absolute',
    width: '100%',
  },
});

export default VersionChecker;
