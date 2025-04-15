import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = "http://192.168.241.210:8000";
const SIGNUP_URL = `${API_BASE_URL}/auth/registration/`;

const SignUpScreen = ({ navigation }) => {
  const [username, setUserName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordInputRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSignUp = async () => {
    if (!username || !password1 || !password2) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password1 !== password2) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(SIGNUP_URL, {
        username,
        password1,
        password2,
      });

      Alert.alert("Success", "Account created! Please log in.");
      navigation.navigate('Login');
    } catch (error) {
      const data = error.response?.data || {};
      let errorMessage =
        data.username?.[0] ||
        data.password1?.[0] ||
        data.non_field_errors?.[0] ||
        "Failed to create account.";

      // Optional: log full error to debug
      if (__DEV__) console.log("Signup error:", data);

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUserName}
        keyboardType="default"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />

      <TextInput
        ref={passwordInputRef}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password1}
        onChangeText={setPassword1}
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      <TextInput
        ref={confirmPasswordRef}
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
        returnKeyType="done"
        onSubmitEditing={handleSignUp}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already a member?{' '}
        <Text
          style={styles.loginText}
          onPress={() => navigation.replace('Login')}
        >
          Login
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e21',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1e2240',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4c6ef5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#aaa',
    marginTop: 20,
  },
  loginText: {
    color: '#4c6ef5',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
