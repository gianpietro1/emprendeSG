import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {launchImageLibrary} from 'react-native-image-picker';
import {Input, Button, Card} from 'react-native-elements';

const PanelForm = ({initialValues, submit, cancel, deleteImage}) => {
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(
    initialValues.description || '',
  );
  const [image, setImage] = useState(initialValues.image || '');
  const [localImage, setLocalImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const checkIfNewImageAndDeleteOld = image => {
    const oldImage = initialValues.image && image ? initialValues.image : null;
    if (oldImage) {
      deleteImage(oldImage);
    }
  };

  const hasAndroidPermission = async () => {
    const getCheckPermissionPromise = async () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = async () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  };

  const getPermissionAsync = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
  };

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      response => {
        setLocalImage(response?.assets[0]?.uri);
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled>
      <Card>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
            }}>
            {localImage ? (
              <Image
                source={{url: localImage}}
                style={{width: 200, height: 200}}
              />
            ) : (
              <Image url={image} width={200} height={200} />
            )}
            <Button
              title="Escoger Nueva Foto"
              onPress={pickImage}
              style={{margin: 5}}
            />
          </View>
          <Input
            label="Título del pedido"
            value={name}
            onChangeText={setName}
            autoCorrect={false}
          />
          <Input
            label="Descripción del pedido"
            value={description}
            onChangeText={setDescription}
            autoCorrect={false}
          />
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button
                title="Cancelar"
                buttonStyle={styles.buttonLeft}
                onPress={cancel}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Enviar"
                buttonStyle={styles.buttonRight}
                loading={isLoading}
                onPress={() => {
                  submit({
                    name,
                    description,
                    image: localImage,
                  });
                  setIsLoading(true);
                  checkIfNewImageAndDeleteOld(localImage);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {flex: 1},
  buttonLeft: {margin: 2, backgroundColor: '#dc3545'},
  buttonRight: {margin: 2, backgroundColor: '#28a745'},
});
export default PanelForm;
