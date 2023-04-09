import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const DATA = [
  {
    name: 'Paperstop',
    description: 'Útiles de escritorio, juguetes y más.',
    logo: require('../assets/temp/paperstopLogo.png'),
    flyer: require('../assets/temp/paperstopFlyer.png'),
    instagram: 'https://www.instagram.com/paperstop.pe/',
    facebook: 'https://www.facebook.com/paperstopperu/',
    whatsapp: '+51991686754',
    email: '',
    web: 'https://paperstop.pe/',
    category: 'papelería',
  },
  {
    name: 'Aquí Suena Perú',
    description: 'Servicio de música ambiental con propósito.',
    logo: require('../assets/temp/aspLogo.png'),
    flyer: require('../assets/temp/aspFlyer.png'),
    instagram: 'https://www.instagram.com/aquisuenaperu/',
    facebook: 'https://www.facebook.com/aquisuenaperu/',
    whatsapp: '+51991686754',
    email: '',
    web: 'https://aquisuenaperu.com/',
    category: 'entretenimiento',
  },
  {
    name: 'MocaCraft',
    description: 'Papelería, regalos y manualidades.',
    logo: require('../assets/temp/mocaLogo.jpeg'),
    flyer: require('../assets/temp/mocaFlyer.jpeg'),
    instagram: 'https://www.instagram.com/mocacraftstudio/',
    facebook: 'https://www.facebook.com/mocacraft/',
    whatsapp: '+51991686754',
    email: '',
    web: 'https://mocacraft.com/',
    category: 'papelería',
  },
];

const MainScreen = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(DATA);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    {label: 'Ninguna', value: null},
    {label: 'Entretenimiento', value: 'entretenimiento'},
    {label: 'Papelería', value: 'papelería'},
  ]);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('RESETTING');
  //     setData(DATA);
  //   }, []),
  // );

  const renderItem = item => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        onPress={() =>
          navigation.navigate('ItemScreen', {
            activeIndex: item.index,
            items: category
              ? data.filter(item => item.category === category)
              : data,
          })
        }>
        <Image style={styles.logos} source={item.item.logo} />
        <Text style={styles.name}>{item.item.name}</Text>
      </TouchableOpacity>
    );
  };

  const normalizeTerm = string => {
    return string.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  };

  const filteredData = (search, keys) => {
    const lowNormedSearch = normalizeTerm(search.toLowerCase());
    return data.filter(item =>
      keys.some(key =>
        normalizeTerm(String(item[key]))
          .toLowerCase()
          .includes(lowNormedSearch),
      ),
    );
  };

  const onTermChange = term => {
    setTerm(term);
    if (term.length > 2) {
      setData(filteredData(term, ['name', 'description']));
    } else {
      setData(DATA);
    }
  };

  const onCancelSearch = () => {
    setTerm('');
    setData(DATA);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <SearchBar
        term={term}
        placeholder={'Busca por marca o descripción'}
        termChange={onTermChange}
        cancelSearch={onCancelSearch}
      />
      <DropDownPicker
        open={open}
        value={category}
        items={items}
        placeholder="Filtra por categoría"
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdown}
      />
      <FlatList
        data={data
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(item => (category ? item.category === category : true))}
        numColumns={2}
        keyExtractor={(item, index) => item.name}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dropdown: {
    alignSelf: 'center',
    width: '80%',
  },
  logos: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  itemView: {
    height: 150,
    width: 150,
    margin: 10,
    padding: 10,
  },
  name: {
    textAlign: 'center',
  },
});

export default MainScreen;
