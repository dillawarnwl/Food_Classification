import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const OnboardingScreen3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/onboarding3.jpeg')} style={styles.image} />

      <Text style={styles.text}>
        Start classifying images in real-time and explore the power of machine learning.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Get Started</Text>
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
});

export default OnboardingScreen3;
