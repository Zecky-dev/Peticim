import axios from 'axios';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  ANDROID_EMULATOR_DEV_URL,
  IOS_EMULATOR_DEV_URL,
  ANDROID_PHYSICAL_DEV_URL,
  API_URL,
} from '@env';

export const getBaseURL = () => {
  const OS = Platform.OS;
  const isEmulator = DeviceInfo.isEmulatorSync();
  const IS_DEV = __DEV__;

  if (IS_DEV) {
    if (OS === 'android') {
      return isEmulator ? ANDROID_EMULATOR_DEV_URL : ANDROID_PHYSICAL_DEV_URL;
    } else {
      return IOS_EMULATOR_DEV_URL;
    }
  } else {
    return API_URL;
  }
};

console.log('BASE_URL', getBaseURL());

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('ERROR_STATUS_CODE: ', error.response.status);
      console.log('ERROR_STATUS_DATA: ', error.response.data);
    } else if (error.request) {
      console.log('ERROR_NO_RESPONSE: ', error.request);
    } else {
      console.log('ERROR: ', error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
