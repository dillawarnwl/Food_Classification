import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getItem } from '../context/Storage';

import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Globe/GlobeScreen';
import CameraScreen from '../screens/Camera/CameraScreen';
import ProfileScreen from '../screens/Authentication/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomBottomTab = ({ state, descriptors, navigation }) => {
  const handleTabPress = async (route, isFocused) => {
    if (route.name === 'Profile') {
      const email = await getItem('email');
      const token = await getItem('authToken');

      if (email && token) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('Login'); 
      }
    } else {
      navigation.navigate(route.name);
    }
  };
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconNames = {
          Home: 'home',
          Explore: 'globe',
          Camera: 'camera',
          Profile: 'person',
        };

        return (
          <TouchableOpacity
            key={route.name}
            onPress={() => handleTabPress(route, isFocused)}
            style={styles.tabButton}
          >
            <Ionicons
              name={iconNames[route.name]}
              size={28}
              color={isFocused ? '#4C8CFF' : 'white'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomBottomTab {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000', 
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabNavigator;
