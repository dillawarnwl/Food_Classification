import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenWrapper from '../Navigation/ScreenWrapper';

export default function FeaturesScreen() {
  const features = [
    {
      icon: <Ionicons name="checkmark-done-circle-outline" size={40} color="#4CAF50" />,
      title: "High Accuracy",
      description: "Recognizes over 85% of dishes accurately on our test set."
    },
    {
      icon: <MaterialCommunityIcons name="silverware-fork-knife" size={40} color="#4CAF50" />,
      title: "Multi-Cuisine Support",
      description: "Identifies more than 30 different cuisines and dish types."
    },
    {
      icon: <Ionicons name="eye-outline" size={40} color="#4CAF50" />,
      title: "AI Explainability",
      description: "Visualize AI reasoning with Grad-CAM heatmaps."
    },
    {
      icon: <Ionicons name="cloud-download-outline" size={40} color="#4CAF50" />,
      title: "Offline Mode",
      description: "Classify recent dishes without an internet connection."
    }
  ];

  const fadeAnim = useRef(features.map(() => new Animated.Value(0))).current;
  const slideAnim = useRef(features.map(() => new Animated.Value(30))).current;

  useEffect(() => {
    const animations = features.map((_, i) =>
      Animated.parallel([
        Animated.timing(fadeAnim[i], {
          toValue: 1,
          duration: 500,
          delay: i * 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim[i], {
          toValue: 0,
          duration: 500,
          delay: i * 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(150, animations).start();
  }, []);

  return (
    <ScreenWrapper title="Features">
      <ScrollView contentContainerStyle={styles.container}>
        {features.map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              {
                opacity: fadeAnim[index],
                transform: [{ translateY: slideAnim[index] }],
              },
            ]}
          >
            <View style={styles.iconWrapper}>{feature.icon}</View>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardDescription}>{feature.description}</Text>
            {index !== features.length - 1 && <View style={styles.connector} />}
          </Animated.View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#F6FFF0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 30,
    width: '88%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    position: 'relative',
  },
  iconWrapper: {
    backgroundColor: '#E8F8E8',
    borderRadius: 50,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 4,
    color: '#222',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  connector: {
    position: 'absolute',
    bottom: -22,
    width: 2,
    height: 26,
    backgroundColor: '#4CAF50',
  },
});
