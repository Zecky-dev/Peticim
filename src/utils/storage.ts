import * as Keychain from 'react-native-keychain';

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
