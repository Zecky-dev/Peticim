import axios from 'axios';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  ANDROID_EMULATOR_DEV_URL,
  IOS_EMULATOR_DEV_URL,
  ANDROID_PHYSICAL_DEV_URL,
  API_URL,
} from '@env';

console.log(API_URL);

const getBaseURL = () => {
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
      console.log('Hata Durum Kodu:', error.response.status);
      console.log('Hata Verisi:', error.response.data);
      console.log('Hata Başlıkları:', error.response.headers);
    } else if (error.request) {
      console.log('Yanıt Alınamadı:', error.request);
    } else {
      console.log('Hata:', error.message);
    }
    console.log('Hata Konfigürasyonu:', error.config);
    return Promise.reject(error);
  },
);

export default axiosClient;
