import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';
const TOKEN_KEY = 'authToken';

// Generic storage functions
export const setItem = async (key, value) => {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

export const getItem = async (key) => {
  if (isWeb) {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const removeItem = async (key) => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Specific token functions
export const saveToken = async (key, token) => {
  await setItem(key, token);
};

export const getToken = async () => {
  return await getItem(TOKEN_KEY);
};

export const deleteToken = async () => {
  await removeItem(TOKEN_KEY);
};
