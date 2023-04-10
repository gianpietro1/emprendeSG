import {useState, useEffect, useContext} from 'react';
import {Text, View, Linking, StyleSheet, Dimensions} from 'react-native';
import checkVersion from 'react-native-store-version';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const FONT_SIZE = 0.024 * SCREEN_HEIGHT;

const VersionChecker = ({localVersion}) => {
  const [remoteVersionStatus, setRemoteVersionStatus] = useState('old');

  const iosURL = 'settings.ios_url'; // actualizar
  const iosStoreURL = 'https://' + iosURL;
  const iosAppStoreURL = 'itms-apps://' + iosURL;

  const androidURL = 'settings.android_url'; // actualizar
  const androidStoreURL = 'https://' + androidURL;

  useEffect(() => {
    (async () => {
      if (iosURL && androidURL) {
        setRemoteVersionStatus(await versionCheck());
      }
    })();
  }, [iosURL, androidURL]);

  const versionCheck = async () => {
    try {
      const check = await checkVersion({
        version: localVersion, // app local version
        iosStoreURL,
        androidStoreURL,
        country: 'pe',
      });

      if (check.result) {
        return check.result;
      }
    } catch (e) {
      return 'old';
    }
  };

  const renewVersion = () => {
    return remoteVersionStatus ? (
      <View
        style={{
          ...styles.renewVersion,
          backgroundColor:
            remoteVersionStatus === 'new' ? '#b53737' : '#3c3c3c',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 0.7 * FONT_SIZE,
            fontWeight: 'bold',
          }}>
          {remoteVersionStatus === 'new' ? (
            <Text
              onPress={() =>
                Linking.openURL(
                  Platform.OS === 'ios' ? iosAppStoreURL : androidStoreURL,
                )
              }>
              {`versión ${localVersion} es antigua - clic para actualizar`}
            </Text>
          ) : (
            <Text>versión {localVersion}</Text>
          )}
        </Text>
      </View>
    ) : null;
  };

  return <>{renewVersion()}</>;
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
