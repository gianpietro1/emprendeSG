import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import VersionCheck from '../components/VersionCheck';

const MainScreen = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);

  const getBusinesses = async () => {
    await axios.get('https://sg.radioperu.pe/api/businesses').then(response => {
      setData(response.data);
      setOrigData(response.data);
    });
  };

  const getCategories = async () => {
    await axios.get('https://sg.radioperu.pe/api/categories').then(response => {
      setItems(response.data);
    });
  };

  useEffect(() => {
    getBusinesses();
    getCategories();
    SplashScreen.hide();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (term && term.length > 0) {
        onTermChange();
      }
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
        <FastImage
          style={styles.logos}
          source={{uri: item.item.logo}}
          resizeMode={FastImage.resizeMode.contain}
        />
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
      <View style={styles.searchBar}>
        <SearchBar
          term={term}
          placeholder={'Busca por marca o descripción'}
          termChange={onTermChange}
          cancelSearch={onCancelSearch}
        />
      </View>
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
      <VersionCheck />
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
    backgroundColor: 'white',
    width: '80%',
    zIndex: 1000,
  },
  logos: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  itemView: {
    height: 150,
    width: 150,
    margin: 10,
    padding: 10,
    zIndex: 0,
  },
  name: {
    textAlign: 'center',
  },
  searchBar: {
    marginTop: 15,
  },
});

export default MainScreen;
