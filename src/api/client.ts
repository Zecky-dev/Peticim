// src/api/axiosClient.ts
import axios from 'axios';

console.log(process.env.DEV_API_ANDROID_URL)

const axiosClient = axios.create({
  baseURL: process.env.DEV_API_ANDROID_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
// 🔹 Request Interceptor (örn. token eklemek için)
axiosClient.interceptors.request.use(
  async (config) => {
    // örn: AsyncStorage'dan token al
    // const token = await AsyncStorage.getItem("token");
    const token = "dummy-token"; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
*/

// 🔹 Response Interceptor (hataları yakalamak için)
axiosClient.interceptors.response.use(
  response => response,
  error => {
    // Sunucudan dönen hata yanıtı varsa
    if (error.response) {
      console.log('Hata Durum Kodu:', error.response.status);
      console.log('Hata Verisi:', error.response.data);
      console.log('Hata Başlıkları:', error.response.headers);
    }
    // İstek gönderildi ancak yanıt alınamadıysa
    else if (error.request) {
      console.log('Yanıt Alınamadı:', error.request);
    }
    // Hatayı oluşturan başka bir şey varsa
    else {
      console.log('Hata:', error.message);
    }

    console.log('Hata Konfigürasyonu:', error.config);
    return Promise.reject(error);
  },
);

export default axiosClient;
