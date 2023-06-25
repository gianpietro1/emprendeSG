import PanelForm from '../components/PanelForm';

const PanelCreateScreen = ({navigation}) => {
  const addPanel = async (panelObject, callback) => {
    console.log('sending', panelObject);
    callback();
  };

  return (
    <PanelForm
      initialValues={{}}
      cancel={() => navigation.pop()}
      submit={panelObject => addPanel(panelObject, () => navigation.pop())}
    />
  );
};

export default PanelCreateScreen;
