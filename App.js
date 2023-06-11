import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View} from 'react-native';
import MainScreen from './src/screens/MainScreen';
import ItemScreen from './src/screens/ItemScreen';
import PanelScreen from './src/screens/PanelScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MainStack = createNativeStackNavigator();
const PanelStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="ItemScreen"
        component={ItemScreen}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

const PanelStackScreen = () => {
  return (
    <PanelStack.Navigator>
      <PanelStack.Screen
        name="PanelScreen"
        component={PanelScreen}
        options={{headerShown: false}}
      />
    </PanelStack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarActiveTintColor: 'cyan',
            tabBarInactiveTintColor: 'white',
            tabBarLabelStyle: {
              marginBottom: 5,
            },
            tabBarStyle: [
              {
                margin: 0,
                paddingVertical: 5,
                backgroundColor: '#383838',
                display: 'flex',
              },
            ],
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Directorio') {
                iconName = focused
                  ? 'format-list-bulleted'
                  : 'format-list-bulleted';
              } else if (route.name === 'Anuncios PTA') {
                iconName = focused
                  ? 'newspaper-variant-outline'
                  : 'newspaper-variant-outline';
              }
              return (
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={size}
                    color={color}
                  />
                </View>
              );
            },
          })}>
          <Tab.Screen name="Directorio" component={MainStackScreen} />
          <Tab.Screen name="Anuncios PTA" component={PanelStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
