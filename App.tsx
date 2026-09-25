import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';

import HomeScreen from './src/screens/Home';
// import DetailsScreen from './src/screens/Details';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#25292e' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown:false}}
        />
        <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{title: 'Detalhes'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}