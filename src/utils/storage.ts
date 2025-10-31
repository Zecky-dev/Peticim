import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCredentials = async (email: string, password: string) => {
  try {
    await Keychain.setGenericPassword(email, password);
    return true;
  } catch (error) {
    return false;
  }
};

export const getCredentials = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return { email: credentials.username, password: credentials.password };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const removeCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();
    return true;
  } catch (error) {
    return false;
  }
};

// AsyncStorage functions
export const saveItemToAsyncStorage = async (
  key: string,
  value: string,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error saving to AsyncStorage [${key}]:`, error);
  }
};

export const getItemFromAsyncStorage = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from AsyncStorage [${key}]:`, error);
    return null;
  }
};

export const removeItemFromAsyncStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from AsyncStorage [${key}]:`, error);
  }
};
