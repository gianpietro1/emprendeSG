import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const MainScreen = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    {label: 'Todas', value: null},
    {label: 'Entretenimiento', value: 'entretenimiento'},
    {label: 'Papelería', value: 'papelería'},
  ]);

  const getBusinesses = async () => {
    await axios.get('https://sg.radioperu.pe/api/businesses').then(response => {
      setData(response.data);
      setOrigData(response.data);
    });
  };

  useEffect(() => {
    getBusinesses();
    SplashScreen.hide();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getBusinesses();
    }, []),
  );

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
        <Image style={styles.logos} src={item.item.logo} />
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
      setData(origData);
    }
  };

  const onCancelSearch = () => {
    setTerm('');
    setData(origData);
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
      {data ? (
        <FlatList
          data={data
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(item => (category ? item.category === category : true))}
          numColumns={2}
          keyExtractor={(item, index) => item.name}
          renderItem={renderItem}
        />
      ) : null}
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
