import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const MainScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <SearchBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
