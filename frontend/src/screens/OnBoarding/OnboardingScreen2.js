import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const OnboardingScreen2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/onboarding2.jpeg')} style={styles.image} />
      
      <Text style={styles.text}>
        Snap a photo and discover what you're looking at in seconds.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding3')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D23',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 350,
    borderRadius: 15,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
});

export default OnboardingScreen2;
