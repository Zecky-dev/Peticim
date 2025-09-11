import { useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import axios from 'axios';

const useLocation = () => {
  const [loading, setLoading] = useState(false);

  const getLocationInfo = async (): Promise<{
    latitude: number;
    longitude: number;
    formattedAddress: string;
  } | null> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message: 'Adresinizi eklemek için konumunuza erişmemiz gerekiyor.',
            buttonNegative: 'Reddet',
            buttonPositive: 'İzin Ver',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'İzin Gerekli',
            'Adresinizi belirleyebilmeniz için konum izni vermeniz gerekir',
          );
          return null;
        }
      }

      setLoading(true);

      const position: GeoPosition = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          error => {
            console.warn('Geolocation error:', error);
            Alert.alert('Hata', 'Konum alınamadı.');
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      });

      const { latitude, longitude } = position.coords;

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${latitude}&lon=${longitude}`,
        { headers: { 'User-Agent': 'PeticimApp/1.0 (info@peticimapp.com)' } },
      );

      const feature = response.data.features?.[0];
      let formattedAddress = '';

      if (feature?.properties?.address) {
        const addr = feature.properties.address;
        formattedAddress = [
          addr.road,
          addr.suburb,
          addr.town,
          addr.province,
          addr.country,
        ]
          .filter(Boolean)
          .join(', ');
      } else if (feature?.properties?.display_name) {
        formattedAddress = feature.properties.display_name;
      }

      return { latitude, longitude, formattedAddress };
    } catch (err) {
      console.warn('getLocationInfo error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getLocationInfo, loading };
};

export default useLocation;