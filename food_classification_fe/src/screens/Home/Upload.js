import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import ScreenWrapper from '../Navigation/ScreenWrapper';

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Dynamically get IP from Expo dev environment
  const IP_ADDRESS = Constants.expoConfig?.extra?.ip || '192.168.1.15'; 
  const API_URL = `http://${IP_ADDRESS}:8000/llm/classify/`;

  // print the API URL
  console.log("API URL:", API_URL);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      setResult(null); // Reset previous result
      await classifyImage(selectedImage);
    }
  };

  const classifyImage = async (imageUri) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'image',
        type: 'image/jpeg',
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper title="Upload Food Image">
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Upload Image Card */}
        <View style={styles.card}>
          <Ionicons name="cloud-upload-outline" size={80} color="#4CAF50" />
          <Text style={styles.cardTitle}>Upload an Image</Text>
          <Text style={styles.cardDescription}>Select a food image to classify</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Text style={styles.uploadBtnText}>Choose Image</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={{ marginTop: 10, color: '#555' }}>Classifying...</Text>
          </View>
        )}

        {/* Preview & Result Card */}
        {result && (
          <View style={styles.card}>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <Text style={styles.cardTitle}>{result.predicted_dish}</Text>
            <Text style={styles.cardDescription}>Cuisine: {result.predicted_cuisine}</Text>
            <Text style={styles.cardDescription}>Confidence: {(result.confidence * 100).toFixed(2)}%</Text>
            {result.gradcam_heatmap && (
              <>
                <Text style={[styles.cardDescription, { marginTop: 10 }]}>AI Heatmap:</Text>
                <Image
                  source={{ uri: `data:image/png;base64,${result.gradcam_heatmap}` }}
                  style={styles.heatmapImage}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F6FFF0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
    color: '#222',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  uploadBtn: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  previewImage: {
    width: 256,
    height: 160,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  heatmapImage: {
    width: 256,
    height: 160,
    borderRadius: 10,
    marginTop: 8,
    resizeMode: 'cover',
  },
});
