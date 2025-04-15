import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const LandingPage = ({ navigation }) => {
  return (
    <>
      {/* Status Bar */}
      <StatusBar
        backgroundColor="#070D23" // Match the hero section background
        barStyle="light-content" // Light icons for dark background
      />
      
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Image Classification</Text>
          <Text style={styles.heroSubtitle}>
            Quickly identify food categories using AI-powered image recognition.
          </Text>
          <Image
            source={require('../../../assets/hero.jpg')}
            style={styles.heroImage}
          />
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>App Features</Text>

          <View style={styles.featureItem}>
            <Image
              source={require('../../../assets/instant-clsfy.png')}
              style={styles.featureImage}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Instant Classification</Text>
              <Text style={styles.featureDescription}>
                Upload or snap a photo and get instant classification results.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Image
              source={require('../../../assets/try-sample.png')}
              style={styles.featureImage}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Try Sample Images</Text>
              <Text style={styles.featureDescription}>
                Use provided sample images to test classification performance.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Image
              source={require('../../../assets/simple-fast.png')}
              style={styles.featureImage}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Simple & Fast</Text>
              <Text style={styles.featureDescription}>
                No extra info—just upload and classify. That's it.
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Explore')}
          >
            <Text style={styles.ctaButtonText}>Start Classifying</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#070D23',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: StatusBar.currentHeight || 0, // Ensure content doesn't overlap with status bar
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: width * 0.8,
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  featureImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  ctaSection: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  ctaButton: {
    backgroundColor: '#070D23',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default LandingPage;