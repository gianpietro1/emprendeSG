import {useContext} from 'react';
import PanelForm from '../components/PanelForm';
import sgBackend from '../api/sgBackend';
import {Context as UserContext} from '../context/UserContext';

const PanelCreateScreen = ({navigation}) => {
  const {
    state: {user, userToken},
  } = useContext(UserContext);
  const addPanel = async (panelObject, callback) => {
    const data = new FormData();
    data.append('name', panelObject.name);
    data.append('description', panelObject.description);
    data.append('date', panelObject.date);
    data.append('ownerName', panelObject.ownerName);
    data.append('ownerWhatsapp', panelObject.ownerWhatsapp);
    data.append('ownerEmail', panelObject.ownerEmail);
    if (panelObject.image) {
      data.append('image', {
        uri:
          Platform.OS === 'ios'
            ? panelObject.image.uri.replace('file://', '')
            : panelObject.image.uri,
        type: panelObject.image.type,
        name: panelObject.image.fileName,
      });
    }
    // console.log('posting with', userToken);
    await sgBackend.post('panelItem/', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'x-access-token': userToken,
      },
    });
    callback();
  };

  return (
    <PanelForm
      user={user}
      initialValues={{}}
      cancel={() => navigation.pop()}
      submit={panelObject => addPanel(panelObject, () => navigation.pop())}
    />
  );
};

export default PanelCreateScreen;
