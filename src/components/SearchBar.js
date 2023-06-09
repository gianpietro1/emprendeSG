import {useRef} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Button, Input} from '@rneui/themed';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const FONT_SIZE = 0.02 * SCREEN_HEIGHT > 16 ? 16 : 0.02 * SCREEN_HEIGHT;

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
        rightIcon={
          term ? (
            <Button
              style={styles.cancelButtonStyle}
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
          ) : null
        }
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.inputStyle}
        inputContainerStyle={styles.inputContainerStyle}
        placeholder={placeholder}
        value={term}
        onChangeText={termChange}
        ref={input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flexDirection: 'row',
    width: 0.8 * SCREEN_WIDTH,
    maxHeight: 85,
  },
  inputContainerStyle: {
    borderBottomWidth: 1,
  },
  inputStyle: {
    fontSize: FONT_SIZE,
  },
  cancelButtonStyle: {
    marginLeft: -15,
    zIndex: 1000,
  },
  cancelIconStyle: {
    color: 'grey',
  },
});

export default SearchBar;
