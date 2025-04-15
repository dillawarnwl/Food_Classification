import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { getItem, setItem } from '../context/Storage'; 

// Screens
import WelcomeScreen from '../components/WelcomeScreen';
import OnboardingScreen1 from '../screens/OnBoarding/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnBoarding/OnboardingScreen2';
import OnboardingScreen3 from '../screens/OnBoarding/OnboardingScreen3';
import SignUpScreen from '../screens/Authentication/SignUpScreen';
import LoginScreen from '../screens/Authentication/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Globe/GlobeScreen';
import CameraScreen from '../screens/Camera/CameraScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigation = () => {
  const { user, loading } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const launchedBefore = await getItem('launchedBefore');

      if (!launchedBefore) {
        await setItem('launchedBefore', 'true');
        setInitialRoute('Welcome');
      } else {
        setInitialRoute('Main');
      }
    };

    if (!loading) {
      checkFirstLaunch();
    }
  }, [loading, user]);

  if (loading || initialRoute === null) return null; // or loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppNavigation />
  </AuthProvider>
);

export default App;
