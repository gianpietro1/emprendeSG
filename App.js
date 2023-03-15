import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MainScreen from './src/screens/MainScreen';

const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: 'yellow',
          tabBarInactiveTintColor: 'white',
          tabBarLabelStyle: {
            marginBottom: 5,
          },
          tabBarStyle: [
            {
              margin: 0,
              paddingVertical: 5,
              backgroundColor: 'black',
              display: 'flex',
            },
          ],
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Main') {
              iconName = focused ? 'main' : 'main';
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
        <Tab.Screen name="Categorías" component={MainStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
