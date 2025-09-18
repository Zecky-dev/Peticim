import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Pressable,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import styles from './AdoptionDetails.style';
import Swiper from 'react-native-swiper';
import colors from '@utils/colors';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { BackButton, Button, Icon } from '@components';
import { useUserDetails } from '@hooks/useUserDetails';
import { getImages } from '@api/image';
import { useAuth } from '@context/AuthContext';
import { incrementListingView } from '@api/listing';
import { deleteListing } from '@firebase/listingService';
import { useLoading } from '@context/LoadingContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-1871077443093626~5754015120';

const AdoptionDetails = () => {
  const route =
    useRoute<RouteProp<AdoptionStackParamList, 'AdoptionDetails'>>();
  const data = route.params.data;
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'AdoptionDetails'>
    >();

  const { userDetails } = useUserDetails(data.userId);
  const { user, token } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const insets = useSafeAreaInsets();

  const [views, setViews] = useState<number>(data.views);
  const [visibleFullScreenImage, setVisibleFullScreenImage] = useState(false);

  // Görüntülenme sayısını artır
  useEffect(() => {
    const handleViewIncrement = async () => {
      try {
        const viewerId = user?.uid;
        if (!viewerId) return;
        const res = await incrementListingView(data.id, viewerId);
        if (res?.views !== undefined) {
          setViews(res.views);
        }
      } catch (err) {
        console.error('View increment error:', err);
      }
    };
    if (data.id && user?.uid) {
      handleViewIncrement();
    }
  }, [data.id, user?.uid]);

  // WhatsApp mesajı gönder
  const sendWhatsappMessage = () => {
    const phoneNumber = data.phone;
    const message = `Merhaba ${userDetails?.name}, Peticim'den gördüğüm "${data.title}" isimli ilanınız ile ilgileniyorum.`;

    if (!phoneNumber) {
      Alert.alert('Telefon numarası bulunamadı.');
      return;
    }

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;

    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert(
        'Hata',
        'Mesaj gönderilemedi. Lütfen Whatsapp uygulamasının yüklü ve güncel olduğundan emin olun.',
        [{ text: 'Tamam' }],
      );
    });
  };

  // İlanı kaldır.
  const handleDeleteListing = (listingId: string) => {
    Alert.alert(
      'İlanı Sil',
      'Bu ilanı silmek istediğine emin misin?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          style: 'destructive',
          onPress: async () => {
            try {
              showLoading();
              await deleteListing(listingId, user?.uid, token);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'AdoptionStacks',
                      params: {
                        screen: 'Adoptions',
                        params: { shouldRefresh: true },
                      },
                    },
                  ],
                }),
              );
            } catch (error) {
              console.error('HANDLE_DELETE_LISTING_ERROR', error);
            } finally {
              hideLoading();
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
        {/* Fotoğraflar slider */}
        <View style={{ width: '100%', height: 300 }}>
          <Swiper
            horizontal
            loop={false}
            height={300}
            dotColor={colors.gray}
            activeDotColor={colors.white}
            style={{ backgroundColor: colors.gray }}
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
          <TouchableOpacity
            onPress={() => setVisibleFullScreenImage(true)}
            style={styles.showFullScreenImageButton}
            activeOpacity={0.8}
          >
            <Icon
              name="zoom-in"
              color={colors.primary}
              size={24}
              type="material"
            />
          </TouchableOpacity>
          <View
            style={{
              ...styles.backButtonContainer,
              top: insets.top + 16,
              left: insets.left + 16,
            }}
          >
            <BackButton color={colors.primary} size={24} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoTopSection}>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.listingTitle}>{data.title}</Text>
              <Text style={styles.animalBreed}>{data.animalBreed}</Text>
            </View>
            <View style={{ justifyContent: 'center', gap: 4 }}>
              <View style={styles.infoRow}>
                <Icon
                  name="location-outline"
                  type="ion"
                  color={colors.black_50}
                  size={18}
                />
                <Text style={styles.locationText}>{data.address.city}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  name="eye-outline"
                  type="ion"
                  color={colors.black_50}
                  size={18}
                />
                {/* Güncel views buradan geliyor */}
                <Text style={styles.locationText}>{views} Görüntüleme</Text>
              </View>
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

          <View style={styles.ownerInfoRow}>
            <View style={styles.ownerInfoLeft}>
              <Image
                source={
                  !userDetails?.profilePictureURL
                    ? require('@assets/images/avatar_default.png')
                    : { uri: userDetails?.profilePictureURL }
                }
                style={styles.avatar}
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
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            style={{ width: '100%', height: 150, marginTop: 12 }}
          >
            <Marker
              coordinate={{
                latitude: data.address.latitude,
                longitude: data.address.longitude,
              }}
            />
          </MapView>

          {data.userId === user?.uid && (
            <Button
              backgroundColor={colors.error}
              labelColor={colors.white}
              label="İlanı Kaldır"
              onPress={() => handleDeleteListing(data.id)}
              icon={
                <Icon name="close" color={colors.white} size={24} type="ion" />
              }
            />
          )}
        </View>
      </ScrollView>
      <Modal
        isVisible={visibleFullScreenImage}
        onBackButtonPress={() => setVisibleFullScreenImage(false)}
        onBackdropPress={() => setVisibleFullScreenImage(false)}
      >
        <View style={{ height: '100%', backgroundColor: 'red' }}>
          <Swiper
            horizontal
            loop={false}
            dotColor={colors.gray}
            activeDotColor={colors.white}
            style={{ backgroundColor: colors.gray }}
          >
            {data.photoURLs!.map((photoURL, i) => (
              <Image
                key={i}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
                source={{ uri: photoURL }}
              />
            ))}
          </Swiper>
          <TouchableOpacity
            onPress={() => setVisibleFullScreenImage(false)}
            style={styles.modalCloseButton}
          >
            <Icon name="close" type="ion" color={colors.black_50} size={24} />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdoptionDetails;
