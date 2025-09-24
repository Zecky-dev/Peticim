import { useLoading } from '@context/LoadingContext';
import { getNearbyListings } from '@firebase/listingService';
import useLocation from '@hooks/useLocation';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon } from '@components';
import { WebView } from 'react-native-webview';
import { Svg, Image as ImageSvg } from 'react-native-svg';

import styles from './NearAdoptions.style';
import colors from '@utils/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const NearAdoptions = () => {
  const [coordinates, setCoordinates] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [nearbyListings, setNearbyListings] = useState<ListingItem[]>([]);
  const { getLocationInfo } = useLocation();
  const { isLoading } = useLoading();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'AdoptionDetails'>
    >();

  const fetchNearbyListings = async () => {
    const locationInfo = await getLocationInfo();
    if (!locationInfo) return;
    const { latitude, longitude } = locationInfo;
    setCoordinates({ latitude, longitude });

    const nearby = await getNearbyListings({ latitude, longitude }, 5);
    console.log('nearby list', nearby);
    setNearbyListings(nearby);
  };

  useEffect(() => {
    fetchNearbyListings();
  }, []);

  if (isLoading) return null;

  if (!coordinates) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.locationPermissionText}>
          Konum bilgisine erişilemiyor. Lütfen uygulama ayarlarından konum
          iznini aktifleştirin.
        </Text>
        <View>
          <Button
            label="Tekrar Dene"
            onPress={() => fetchNearbyListings()}
            icon={
              <Icon name="refresh" color={colors.white} size={24} type="ion" />
            }
          />
        </View>
      </View>
    );
  } else {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
        >
          <Circle
            center={coordinates}
            radius={5000}
            strokeWidth={2}
            strokeColor="#FFFFFF"
            fillColor="rgba(255,255,255,0.2)"
          />
          {nearbyListings.map(l => (
            <Marker
              key={l.id.toString()}
              coordinate={{
                latitude: l.address.latitude,
                longitude: l.address.longitude,
              }}
            >
              <Callout
                tooltip
                onPress={() =>
                  navigation.navigate('AdoptionDetails', { data: l })
                }
              >
                <View style={styles.calloutContainer}>
                  <View style={styles.calloutContentContainer}>
                    <Text style={styles.calloutTitle}>{l.title}</Text>
                    <Text style={styles.calloutSubtitle}>
                      {l.animalType} - {l.animalBreed}
                    </Text>
                  </View>

                  <View style={styles.calloutButton}>
                    <Text style={styles.calloutButtonText}>İlanı Gör</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        {nearbyListings && (
          <View style={styles.nearbyListingsTextContainer}>
            <Text style={styles.nearbyListingsText}>
              {nearbyListings.length === 0
                ? 'Yakınınızda ilan bulunmuyor 😿'
                : `Yakınınızda ${nearbyListings.length} ilan bulunuyor 🐈`}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
};

export default NearAdoptions;
