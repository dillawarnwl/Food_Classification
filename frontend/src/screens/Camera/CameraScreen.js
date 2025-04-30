import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import mime from 'mime';

const API_URL = 'http://192.168.100.6:8000/classifier/classify/';

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const route = useRoute();

  useEffect(() => {
    if (route.params?.image) {
      setImage({
        uri: route.params.image,
        fileName: 'remote-image.jpg',
        type: 'image/jpeg',
      });
    }
  }, [route.params?.image]);

  // Helper to get file name from URI if missing
  const getFileNameFromUri = (uri) => {
    return uri.split('/').pop().split('?')[0];
  };

  // Normalize image for upload
  const normalizeImage = (asset) => {
    // Fix the URI format for Android
    let uri = asset.uri;
    if (Platform.OS === 'android') {
      uri = 'file:///' + uri.split('file:/').join('');
    }

    const fileName = asset.fileName || uri.split('/').pop();
    const type = mime.getType(uri) || 'image/jpeg';

    return {
      uri,
      fileName,
      type,
    };
  };


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const normalized = normalizeImage(result.assets[0]);
      console.log('Picked Image:', normalized);
      setImage(normalized);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const normalized = normalizeImage(result.assets[0]);
      console.log('Taken Photo:', normalized);
      setImage(normalized);
    }
  };

  const classifyImage = async () => {
    if (!image) {
      Alert.alert('No image', 'Please select or take a photo first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: image.type,
    });

    try {
      console.log('Sending to API:', image);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      setShowModal(true);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', 'Something went wrong during classification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadBox}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        ) : (
          <Icon name="cloud-upload-outline" size={250} color="#333" />
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Icon name="camera-outline" size={35} color="white" />
          <Text style={styles.buttonText}> Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Icon name="cloud-upload-outline" size={35} color="white" />
          <Text style={styles.buttonText}> Upload</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.classifyButton}
        onPress={classifyImage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="checkmark-circle-outline" size={30} color="white" />
            <Text style={styles.classifyText}> Classify</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>🍽️ Classification Result</Text>

              {result ? (
                <>
                  <Text style={styles.predictedLabel}>
                    Predicted Class:{' '}
                    <Text style={{ color: '#FACC15' }}>
                      {result.predicted_class}
                    </Text>
                  </Text>

                  <Text style={{ textAlign: 'center', color: '#00DC82', marginTop: 8, fontSize: 16 }}>
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </Text>

                  {/* Add this section to display the heatmap image */}
                  {result.heatmap_image && (
                    <View style={{ marginVertical: 20, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', marginBottom: 10 }}>Heatmap:</Text>
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${result.heatmap_image}` }}
                        style={{ width: 300, height: 300, resizeMode: 'contain' }}
                      />
                    </View>
                  )}
                </>
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  No result data available.
                </Text>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowModal(false);
                  setImage(null);
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1120',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadBox: {
    backgroundColor: '#fff',
    width: 350,
    height: 450,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  classifyButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  classifyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FACC15',
    marginBottom: 12,
    textAlign: 'center',
  },
  predictedLabel: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultHeader: {
    fontSize: 16,
    color: '#A5F3FC',
    fontWeight: '600',
    marginBottom: 8,
  },
  probabilityRow: {
    marginBottom: 10,
  },
  countryLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  probabilityBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#334155',
    borderRadius: 5,
    overflow: 'hidden',
  },
  probabilityBar: {
    height: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  percentageLabel: {
    color: '#FACC15',
    fontSize: 14,
    marginTop: 2,
  },
  uncertaintyText: {
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#EF4444',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadScreen;
