import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { getItem } from '../../context/Storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

const images = [
  require('../../../assets/food1.jpeg'),
  require('../../../assets/food2.jpeg'),
  require('../../../assets/food3.jpeg'),
];

const getBackgroundColor = (text) => {
  const colors = ['#f87171', '#60a5fa', '#34d399', '#facc15', '#5d3cbd'];
  const charCode = text?.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

const ProfileScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        let storedEmail = '';
        if (Platform.OS === 'web') {
          storedEmail = localStorage.getItem('email') || '';
        } else {
          storedEmail = await getItem('email') || '';
        }
        setEmail(storedEmail);
      } catch (err) {
        console.warn('Error loading email:', err);
      }
    };

    fetchEmail();
  }, []);

  const initial = email ? email.charAt(0).toUpperCase() : '?';
  const bgColor = getBackgroundColor(initial);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/profile-back.jpeg')} style={styles.bgImage} />
        <View style={styles.profileSection}>
          {email ? (
            <View style={[styles.initialCircle, { backgroundColor: bgColor }]}>
              <Text style={styles.initialText}>{initial}</Text>
            </View>
          ) : (
            <Image source={require('../../../assets/food.png')} style={styles.profileImage} />
          )}
          <Text style={styles.name}>{email || 'Ali Raza'}</Text>
        </View>

        {/* 🔐 Logout Icon */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            logout();
            navigation.navigate('Home');
          }}
        >
          <Icon name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Classified Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Classified</Text>
        <View style={styles.grid}>
          {images.map((img, idx) => (
            <Image key={idx} source={img} style={styles.gridImage} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1120',
    flex: 1,
  },
  header: {
    position: 'relative',
    height: 220,
    marginBottom: 60,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#0B1120',
  },
  initialCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#0B1120',
  },
  initialText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#334155',
    borderRadius: 30,
    padding: 10,
    zIndex: 10,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImage: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    marginBottom: 12,
  },
});

export default ProfileScreen;
