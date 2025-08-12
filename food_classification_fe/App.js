import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './src/screens/Welcome/LandingScreen';
import Features from './src/screens/Home/Features';
import Upload from './src/screens/Home/Upload';
import HowItWorks from './src/screens/Home/HowItWorks';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBackgroundColorAsync('transparent');
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={WelcomeScreen} />
        <Stack.Screen name="HowItWorks" component={HowItWorks} />
        <Stack.Screen name="Features" component={Features} />
        <Stack.Screen name="Upload" component={Upload} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
