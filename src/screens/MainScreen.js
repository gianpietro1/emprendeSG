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

const LOCAL_VERSION = '1.1.5';

const MainScreen = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);

  const getBusinesses = async () => {
    await axios.get('https://sg.radioperu.pe/api/businesses').then(response => {
      getCategories();
      setData(response.data);
      setOrigData(response.data);
      SplashScreen.hide();
      // setTimeout(() => SplashScreen.hide(), 1000);
    });
  };

  const sortExceptNull = (a, b) => {
    if (a.value == b.value) return 0;
    if (a.value == null) return -1;
    if (b.value == null) return 1;

    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  };

  const getCategories = async () => {
    await axios.get('https://sg.radioperu.pe/api/categories').then(response => {
      setItems(response.data.sort((a, b) => sortExceptNull(a, b)));
    });
  };

  useEffect(() => {
    getBusinesses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getBusinesses();
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
        <View style={styles.dataView}>
          <FlatList
            data={data
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(item => (category ? item.category === category : true))}
            numColumns={2}
            keyExtractor={(item, index) => item.name}
            renderItem={renderItem}
            ListFooterComponent={<View style={{height: 60}} />}
          />
        </View>
      ) : null}
      <VersionCheck localVersion={LOCAL_VERSION} />
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
  dataView: {
    flexDirection: 'column',
    zIndex: -1,
    flex: 1,
  },
  dropdown: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: '80%',
    zIndex: 1000,
    elevation: 1000,
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
