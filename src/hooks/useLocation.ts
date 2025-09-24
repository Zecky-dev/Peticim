import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { useLoading } from '@context/LoadingContext';
import { showToast } from '@config/toastConfig';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import axios from 'axios';
import * as geofire from 'geofire-common';

const useLocation = () => {
  const { showLoading, hideLoading } = useLoading();

  const getLocationInfo = async (): Promise<{
    latitude: number;
    longitude: number;
    formattedAddress: string;
    city: string;
    district: string;
    geohash: string;
  } | null> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message:
              'Konumunuzla işlem yapabilmek için konum izni vermeniz gerekmektedir.',
            buttonNegative: 'Reddet',
            buttonPositive: 'İzin Ver',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'İzin Gerekli',
            'Konumunuzla işlem yapabilmek için konum izni vermeniz gerekmektedir.',
            [
              {
                text: 'Tamam',
                style: 'default',
              },
            ],
          );
          return null;
        }
      }

      showLoading();

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
      const hash = geofire.geohashForLocation([latitude, longitude]);

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${latitude}&lon=${longitude}`,
        { headers: { 'User-Agent': 'PeticimApp/1.0 (info@peticimapp.com)' } },
      );

      const feature = response.data.features?.[0];
      let formattedAddress = '';
      let city = '';
      let district = '';

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
        console.log(addr);
        city = addr.province || addr.city || addr.town || addr.state || '';
        district =
          addr.district || addr.suburb || addr.county || addr.town || '';
      } else if (feature?.properties?.display_name) {
        formattedAddress = feature.properties.display_name;
      }

      return {
        latitude,
        longitude,
        formattedAddress,
        city,
        district,
        geohash: hash,
      };
    } catch (err) {
      console.warn('getLocationInfo error:', err);
      showToast({
        type: 'error',
        text1: 'Konum Alınamadı',
        text2:
          'Lütfen konum izinlerinizi ve internet bağlantınızı kontrol edin.',
        duration: 'long',
      });
      return null;
    } finally {
      hideLoading();
    }
  };

  return { getLocationInfo };
};

export default useLocation;
