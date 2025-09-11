import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import styles from './AdoptionDetails.style';
import Swiper from 'react-native-swiper';
import colors from '@utils/colors';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BackButton, Icon } from '@components';
import { useUserDetails } from '@hooks/useUserDetails';
import { getImages } from '@api/image';
import { useAuth } from '@context/AuthContext';

const AdoptionDetails = () => {
  const route =
    useRoute<RouteProp<AdoptionStackParamList, 'AdoptionDetails'>>();
  const insets = useSafeAreaInsets();
  const data = route.params.data;
  const { userDetails } = useUserDetails(data.userId);
  const { token } = useAuth();
  const [profileImageURL, setProfileImageURL] = useState<string>('');

  useEffect(() => {
    const getProfileImage = async () => {
      if (userDetails && token) {
        const profileImageURL = await getImages(
          [userDetails.profilePicture.publicId],
          token,
        );
        setProfileImageURL(
          profileImageURL.urls[userDetails.profilePicture.publicId],
        );
      }
    };
    getProfileImage();
  }, [userDetails]);

  const sendWhatsappMessage = () => {
    const phoneNumber = data.phone;
    const message = `Merhaba ${userDetails?.name}, ${data.title} ilanıyla ilgileniyorum.`;
    if (!phoneNumber) {
      Alert.alert('Telefon numarası bulunamadı.');
      return;
    }
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert(
            'WhatsApp yüklü değil.',
            'Mesaj gönderebilmeniz için telefonunuzda Whatsapp yüklü olmalıdır.',
            [{ text: 'Tamam' }],
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView>
        {/* Fotoğraflar slider */}
        <View style={{ width: '100%', height: 300 }}>
          <Swiper
            horizontal
            loop={false}
            height={350}
            dotColor={colors.gray}
            activeDotColor={colors.white}
            style={{
              backgroundColor: colors.gray,
            }}
          >
            {data.photoURLs!.map((photoURL, i) => (
              <Image
                key={i}
                style={{
                  width: '100%',
                  height: 300,
                  resizeMode: 'cover',
                }}
                source={{ uri: photoURL }}
              />
            ))}
          </Swiper>
          <View
            style={{
              ...styles.backButtonContainer,
              top: insets.top + 16,
              left: insets.left + 16,
            }}
          >
            <BackButton color={colors.primary} size={28} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoTopSection}>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.listingTitle}>{data.title}</Text>
              <Text style={styles.animalBreed}>{data.animalBreed}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon
                name="location-outline"
                type="ion"
                color={colors.black_50}
                size={18}
              />
              <Text style={styles.locationText}>{data.address.city}</Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>{data.description}</Text>
          <View style={styles.infoSectionRow}>
            <Icon
              name="medkit-outline"
              type="ion"
              color={colors.error}
              size={24}
            />

            <Text style={styles.infoSectionRowLabel}>Aşılar:</Text>
            <Text style={styles.infoSectionRowValue}>
              {data.vaccinated ? 'Yapıldı' : 'Yapılmadı'}
            </Text>
          </View>
          <View style={styles.infoSectionRow}>
            <Icon
              name="fitness-outline"
              type="ion"
              color={colors.success}
              size={28}
            />
            <Text style={styles.infoSectionRowLabel}>Kısırlaştırma:</Text>
            <Text style={styles.infoSectionRowValue}>
              {data.sterilized ? 'Yapıldı' : 'Yapılmadı'}
            </Text>
          </View>

          <View style={styles.infoSectionRow}>
            <View style={styles.infoSectionRow}>
              <Image
                source={{ uri: profileImageURL }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
              <Text style={styles.infoSectionRowLabel}>Sahibi:</Text>
              <Text style={styles.infoSectionRowValue}>
                {userDetails?.name} {userDetails?.surname}
              </Text>
            </View>

            <TouchableOpacity
              onPress={sendWhatsappMessage}
              style={styles.sendWhatsappMessageButton}
              activeOpacity={0.8}
            >
              <Icon
                name="logo-whatsapp"
                color={colors.white}
                size={20}
                type="ion"
              />
              <Text style={styles.sendWhatsappMessageText}>Mesaj Gönder</Text>
            </TouchableOpacity>
          </View>

          <MapView
            initialRegion={{
              latitude: data.address.latitude,
              longitude: data.address.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            rotateEnabled={false}
            style={{ width: '100%', height: 150, marginTop: 12 }}
          >
            <Marker
              coordinate={{
                latitude: data.address.latitude,
                longitude: data.address.longitude,
              }}
            />
          </MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdoptionDetails;
