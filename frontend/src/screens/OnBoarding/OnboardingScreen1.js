import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const OnboardingScreen1 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../../assets/onboarding1.jpeg')} style={styles.image} />

      <Text style={styles.text}>
        Upload or capture an image and let our AI classify it in seconds.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Onboarding2')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')} activeOpacity={0.6}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D23',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 350,
    borderRadius: 15,
    marginBottom: 30,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default OnboardingScreen1;
