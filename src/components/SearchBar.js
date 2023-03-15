import {useRef} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Button, Input} from '@rneui/themed';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const FONT_SIZE = 0.024 * SCREEN_HEIGHT > 18 ? 18 : 0.024 * SCREEN_HEIGHT;

const SearchBar = ({cancelSearch, term, termChange, placeholder}) => {
  const cancelSearchLocal = () => {
    cancelSearch();
    input.current.blur();
  };

  const input = useRef();

  return (
    <View style={styles.backgroundStyle}>
      <Input
        leftIcon={{type: 'font-awesome', name: 'search'}}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.inputStyle}
        inputContainerStyle={styles.inputContainerStyle}
        placeholder={placeholder}
        value={term}
        onChangeText={termChange}
        ref={input}
      />
      {term ? (
        <Button
          type="clear"
          icon={
            <MaterialCommunityIcons
              size={30}
              name="window-close"
              style={styles.cancelIconStyle}
            />
          }
          onPress={cancelSearchLocal}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flexDirection: 'row',
    width: 0.9 * SCREEN_WIDTH,
    height: 0.11 * SCREEN_HEIGHT,
    maxHeight: 85,
    paddingHorizontal: 0.01 * SCREEN_WIDTH,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    fontSize: FONT_SIZE,
  },
  cancelIconStyle: {
    color: 'grey',
  },
});

export default SearchBar;
