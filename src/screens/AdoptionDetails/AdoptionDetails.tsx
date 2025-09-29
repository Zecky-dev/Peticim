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
import { CircleButton, Button, Icon, ChipCard, Input } from '@components';
import { useUserDetails } from '@hooks/useUserDetails';
import { useAuth } from '@context/AuthContext';
import { incrementListingView } from '@api/listing';
import { deleteListing, toggleFavorite } from '@firebase/listingService';
import { useLoading } from '@context/LoadingContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AdoptionDetails = () => {
  const route =
    useRoute<RouteProp<AdoptionStackParamList, 'AdoptionDetails'>>();
  const data = route.params.data;
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'AdoptionDetails'>
    >();

  const { user } = useAuth();

  const { userDetails: currentUserDetails } = useUserDetails(user?.uid || null);
  const { userDetails: listingOwnerUserDetails } = useUserDetails(data.userId);

  const { showLoading, hideLoading } = useLoading();

  const [visibleFullScreenImage, setVisibleFullScreenImage] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [report, setReport] = useState<{
    selectedReason: string;
    reasonText?: string;
  }>({
    selectedReason: '',
    reasonText: '',
  });

  useEffect(() => {
    if (currentUserDetails?.favorites) {
      setIsFavorited(currentUserDetails.favorites.includes(data.id));
    }
  }, [currentUserDetails, data.id]);

  // Görüntülenme sayısını artır
  useEffect(() => {
    const handleViewIncrement = async () => {
      try {
        const viewerId = user?.uid;
        if (!viewerId) return;
        await incrementListingView(data.id, viewerId);
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
    const message = `Merhaba ${listingOwnerUserDetails?.name}, Peticim'den gördüğüm "${data.title}" isimli ilanınız ile ilgileniyorum.`;

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
            console.log('LISTING_ID', listingId);
            console.log('USER_ID', user?.uid);
            try {
              showLoading();
              await deleteListing(listingId, user?.uid);
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

  const handleToggleFavorite = async () => {
    const toggleSuccess = await toggleFavorite(data.id, user?.uid);
    if (toggleSuccess) {
      setIsFavorited(!isFavorited);
    }
  };

  const onReasonSelect = (reason: { id: number; text: string }) => {
    setReport(prev => ({ ...prev, selectedReason: reason.text }));
  };
  const reportReasonList = [
    { id: 1, text: 'Uygunsuz İçerik' },
    { id: 2, text: 'Sahte İlan' },
    { id: 3, text: 'Ücretli Sahiplendirme' },
    { id: 4, text: 'Diğer' },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView>
        {/* Fotoğraflar slider */}
        <View style={styles.imageSwiperContainer}>
          <Swiper
            horizontal
            loop={false}
            height={300}
            dotColor={colors.white}
            activeDotColor={colors.primary}
            style={{ backgroundColor: colors.gray }}
          >
            {data.images!.map((image, i) => (
              <Image key={i} style={styles.image} source={{ uri: image.url }} />
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
              top: 16,
              left: 16,
            }}
          >
            <CircleButton backgroundColor={colors.white} size={48} />
          </View>
          <View
            style={{
              ...styles.backButtonContainer,
              top: 16,
              right: 16,
            }}
          >
            <CircleButton
              onPress={handleToggleFavorite}
              backgroundColor={colors.white}
              iconColor={isFavorited ? colors.error : colors.primary}
              iconName={isFavorited ? 'heart' : 'heart-outline'}
              iconType="ion"
              iconSize={24}
              size={48}
            />
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.animalTypeBreed}>
            {data.animalType} - {data.animalBreed}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.descriptionText}>{data.description}</Text>
          <View style={styles.infoBoxesContainer}>
            <View style={styles.infoBox}>
              <Icon
                name="location-outline"
                color={colors.primary}
                type="ion"
                size={32}
              />
              <Text style={styles.infoBoxValue}>{data.address.city}</Text>
            </View>
            {typeof data.sterilized === 'boolean' && (
              <View style={styles.infoBox}>
                <Icon
                  name="medkit-outline"
                  color={colors.primary}
                  type="ion"
                  size={32}
                />
                <Text style={styles.infoBoxValue}>
                  {data.sterilized ? 'Kısırlaştırılmış' : 'Kısırlaştırılmamış'}
                </Text>
              </View>
            )}

            {typeof data.vaccinated === 'boolean' && (
              <View style={styles.infoBox}>
                <Icon
                  name="needle"
                  color={colors.primary}
                  type="material-community"
                  size={32}
                />
                <Text style={styles.infoBoxValue}>
                  {data.vaccinated ? 'Aşıları Tam' : 'Aşısı Yok'}
                </Text>
              </View>
            )}
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
            style={{ width: '100%', height: 120, marginTop: 12 }}
          >
            <Marker
              coordinate={{
                latitude: data.address.latitude,
                longitude: data.address.longitude,
              }}
            />
          </MapView>

          <View style={{ marginTop: 8 }}>
            <Text style={styles.sectionTitle}>İlan Sahibi</Text>
            <View style={styles.adsOwnerContainer}>
              <Image
                source={
                  !listingOwnerUserDetails?.profilePicture?.url
                    ? require('@assets/images/avatar_default.png')
                    : { uri: listingOwnerUserDetails?.profilePicture.url }
                }
                style={styles.adsOwnerImage}
              />
              <Text style={styles.adsOwnerNameSurname}>
                {listingOwnerUserDetails?.name}{' '}
                {listingOwnerUserDetails?.surname}
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {data.userId !== user?.uid && (
                <Button
                  label="Mesaj Gönder"
                  backgroundColor={colors.success}
                  additionalStyles={{
                    label: styles.sendWhatsappMessageButtonText,
                  }}
                  icon={
                    <Icon
                      name="logo-whatsapp"
                      color={colors.white}
                      size={24}
                      type="ion"
                    />
                  }
                  onPress={sendWhatsappMessage}
                />
              )}

              {data.userId === user?.uid && (
                <Button
                  backgroundColor={colors.error}
                  labelColor={colors.white}
                  label="İlanı Kaldır"
                  onPress={() => {
                    handleDeleteListing(data.id);
                  }}
                  additionalStyles={{
                    label: styles.sendWhatsappMessageButtonText,
                  }}
                  icon={
                    <Icon
                      name="close"
                      color={colors.white}
                      size={24}
                      type="ion"
                    />
                  }
                />
              )}
              {data.userId !== user?.uid && (
                <Button
                  backgroundColor={colors.error}
                  labelColor={colors.white}
                  label="İlanı Raporla"
                  onPress={() => {
                    setReportModalVisible(true);
                    setReport({ selectedReason: '', reasonText: '' });
                  }}
                  additionalStyles={{
                    label: styles.sendWhatsappMessageButtonText,
                  }}
                  icon={
                    <Icon
                      name="report-gmailerrorred"
                      color={colors.white}
                      size={24}
                      type="material"
                    />
                  }
                />
              )}
            </View>
          </View>
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
            {data.images!.map((image, i) => (
              <Image
                key={i}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
                source={{ uri: image.url }}
              />
            ))}
          </Swiper>
          <TouchableOpacity
            onPress={() => setVisibleFullScreenImage(false)}
            style={styles.modalCloseButton}
          >
            <Icon name="close" type="ion" color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={reportModalVisible}
        style={styles.reportModalContainer}
        onBackButtonPress={() => setReportModalVisible(false)}
        onBackdropPress={() => setReportModalVisible(false)}
      >
        <View style={styles.reportModalContentContainer}>
          <Text style={styles.reasonSelectText}>Neden Seçiniz</Text>
          <View style={styles.reasonsContainer}>
            {reportReasonList.map(reason => (
              <ChipCard
                isSelected={reason.text === report.selectedReason}
                key={reason.id.toString()}
                text={reason.text}
                onSelect={() => onReasonSelect(reason)}
              />
            ))}
          </View>

          <Input
            placeholder="İletmek istediğiniz mesajınız.."
            customStyles={{
              input: {
                height: 100,
                textAlignVertical: 'top',
              },
            }}
            showCharacterCount={true}
            maxLength={120}
          />

          <Button label="Raporla" onPress={() => console.log('Rapor')} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdoptionDetails;
