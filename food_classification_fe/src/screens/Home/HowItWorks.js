import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../Navigation/ScreenWrapper';

export default function HowItWorksScreen() {
  const steps = [
    {
      icon: <Ionicons name="camera-outline" size={40} color="#4CAF50" />,
      title: "Upload",
      description: "Snap or upload a photo of your meal for analysis.",
    },
    {
      icon: <MaterialCommunityIcons name="image-filter-center-focus" size={40} color="#4CAF50" />,
      title: "Process Image",
      description: "Our AI processes and enhances the image for recognition.",
    },
    {
      icon: <FontAwesome5 name="search" size={36} color="#4CAF50" />,
      title: "Generate GradeCam",
      description: "AI creates a grading mask to evaluate different food regions.",
    },
    {
      icon: <MaterialCommunityIcons name="fire" size={40} color="#4CAF50" />,
      title: "Overlay Heatmap",
      description: "A heatmap is overlaid to highlight important food features.",
    },
    {
      icon: <Ionicons name="checkmark-circle-outline" size={40} color="#4CAF50" />,
      title: "Response",
      description: "Get instant feedback, results, and suggestions from the AI.",
    },
  ];

  // Animation refs
  const fadeAnim = useRef(steps.map(() => new Animated.Value(0))).current;
  const slideAnim = useRef(steps.map(() => new Animated.Value(30))).current;

  useEffect(() => {
    // Stagger animation for each card
    const animations = steps.map((_, i) => {
      return Animated.parallel([
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
        })
      ]);
    });
    Animated.stagger(150, animations).start();
  }, []);

  return (
    <ScreenWrapper title="How It Works">
      <ScrollView contentContainerStyle={styles.container}>
        {steps.map((step, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              {
                opacity: fadeAnim[index],
                transform: [{ translateY: slideAnim[index] }],
              }
            ]}
          >
            <View style={styles.iconWrapper}>
              {step.icon}
            </View>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardDescription}>{step.description}</Text>

            {index !== steps.length - 1 && (
              <View style={styles.connector} />
            )}
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
