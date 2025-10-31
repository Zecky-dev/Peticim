import React, { useState, useRef, useEffect, useCallback } from 'react';
import Swiper from 'react-native-swiper';
import LottieView from 'lottie-react-native';
import {
  View,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Text,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Input, Checkbox, Button, Icon, Picker, Alert } from '@components';
import { useFormik } from 'formik';
import { useLoading } from '@context/LoadingContext';
import { useAuth } from '@context/AuthContext';
import { useImagePicker } from '@hooks/useImagePicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { adoptionValidationSchema } from '@utils/validationSchemas';
import { createListing } from '@firebase/listingService';
import animalData from '../../constants/animalData.json';
import colors from '@utils/colors';
import styles from './AddAdoption.style';

import Modal from 'react-native-modal';
import useLocation from '@hooks/useLocation';
import { getCities, getNeighborhoods, getDistricts } from '@api/location';
import { showToast } from '@config/toastConfig';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { PickerItem } from 'types/global';
import * as geofire from 'geofire-common';

const { width } = Dimensions.get('window');

const AddAdoption = () => {
  // Hooks
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList, 'AddAdoption'>>();
  const { pickFromLibrary } = useImagePicker();
  const { user, userDetails } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { getLocationInfo } = useLocation();

  // Formik
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      photos: [],
      animalType: '',
      animalBreed: '',
      vaccinated: false,
      sterilized: false,
      phone: '',
      age: null,
      address: null,
    },
    onSubmit: () => handleSubmit(),
    validationSchema: adoptionValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const canSubmit =
    formik.values.photos.length > 0 &&
    formik.values.animalType &&
    formik.values.animalBreed &&
    formik.values.phone &&
    formik.values.address;
  const shouldShowHealthOption =
    formik.values.animalType === 'Köpek' || formik.values.animalType === 'Kedi';

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [breedsList, setBreedsList] = useState<PickerItem[]>([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const [cities, setCities] = useState<PickerItem[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

  const [selectedCity, setSelectedCity] = useState<PickerItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<PickerItem | null>(
    null,
  );
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<PickerItem | null>(null);

  const handleCitySelect = async (city: PickerItem) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
    setSelectedNeighborhood(null);
    setNeighborhoods([]);
    const districtsRes = await getDistricts(Number(city.value));
    const districtItems = districtsRes.map((d: any) => ({
      label: d.name,
      value: d.id,
    }));
    districtItems.sort((a, b) => {
      return a.label.localeCompare(b.label, 'tr', { sensitivity: 'base' });
    });
    setDistricts(districtItems);
  };

  const handleDistrictSelect = async (district: PickerItem) => {
    setSelectedDistrict(district);
    setSelectedNeighborhood(null);

    const neighborhoodsRes = await getNeighborhoods(Number(district.value));
    const neighborhoodItems = neighborhoodsRes.map((n: any) => ({
      label: n.name,
      value: n.id,
    }));
    neighborhoodItems.sort((a, b) => {
      return a.label.localeCompare(b.label, 'tr', { sensitivity: 'base' });
    });
    setNeighborhoods(neighborhoodItems);
  };

  const handleNeighborhoodSelect = (neighborhood: PickerItem) => {
    setSelectedNeighborhood(neighborhood);
  };

  // Refs
  const lottieRefStep2 = useRef<LottieView>(null);
  const lottieRefStep3 = useRef<LottieView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const formikRef = useRef(formik);

  // Statics
  const animalTypes = animalData.map(animal => ({
    label: animal.type,
    value: animal.type,
  }));

  // Step check fields
  const stepFields: Record<number, string[]> = {
    1: ['title', 'description', 'photos'],
    2: ['animalType', 'animalBreed', 'age'],
    3: ['phone', 'address'],
  };

  // Functions
  const nextStep = async () => {
    const errors = await formik.validateForm();
    const fields = stepFields[currentStep] || [];
    const stepErrors = Object.keys(errors).filter(key => fields.includes(key));
    if (stepErrors.length === 0) {
      const next = currentStep + 1;
      setCurrentStep(next);
      Animated.timing(slideAnim, {
        toValue: -width * (next - 1),
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fields.forEach(field => formik.setFieldTouched(field, true));
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (currentStep === 3) {
      setCurrentStep(2);
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleTypeChange = (type: string) => {
    formik.setFieldValue('animalType', type);
    formik.setFieldValue('animalBreed', '');
    if (type !== 'Köpek' && type !== 'Kedi') {
      formik.setFieldValue('vaccinated', null);
      formik.setFieldValue('sterilized', null);
    }
    const selectedAnimalType = animalData.find(a => a.type === type);
    const breeds =
      selectedAnimalType?.breeds.map(breed => ({
        value: breed,
        label: breed,
      })) || [];
    setBreedsList(breeds);
  };

  const handleSubmit = async () => {
    if (!user?.uid || !canSubmit) return;
    showLoading();
    formik.setSubmitting(true);
    const {
      title,
      description,
      animalType,
      animalBreed,
      age,
      vaccinated,
      sterilized,
      phone,
      address,
      photos,
    } = formik.values;

    const listingData = {
      title,
      description,
      animalType,
      animalBreed,
      age,
      vaccinated,
      sterilized,
      phone,
      address,
      views: 0,
      geohash: (address as any)?.geohash ?? '',
      status: 'pending',
    };
    const createListingSuccess = await createListing(
      listingData,
      photos,
      user.uid,
    );

    if (createListingSuccess) {
      showToast({
        type: 'success',
        text1: 'İlanınız oluşturuldu',
        text2:
          'İlanınız onay sürecindedir, onaylandıktan sonra yayına alınacaktır.',
        duration: 'long',
      });

      // Navigate to ProfileStack with nested Profile screen
      navigation.navigate('ProfileStack' as any, undefined);
    }
    hideLoading();
    formik.setSubmitting(false);
  };

  const handleImagePick = async () => {
    try {
      showLoading();
      const pickedImages = await pickFromLibrary({
        selectionLimit: 5,
        mediaType: 'photo',
        maxHeight: 800,
        maxWidth: 800,
      });
      if (!pickedImages || pickedImages.length === 0) return;
      // Sadece formik'i güncelle, setImages'ı kaldır
      formik.setFieldValue('photos', pickedImages);
    } catch (err: any) {
      showToast({
        type: 'error',
        text1: 'Hata',
        text2: err.message,
      });
      formik.setFieldValue('photos', []);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    const getCityList = async () => {
      const citiesRes = await getCities();
      const cityNames = citiesRes.map((city: any) => ({
        value: city.id,
        label: city.name,
      }));
      cityNames.sort((a, b) => {
        return a.label.localeCompare(b.label, 'tr', { sensitivity: 'base' });
      });
      setCities(cityNames);
    };
    getCityList();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (currentStep > 1) {
          prevStep();
          return true;
        }
        return false;
      },
    );

    if (currentStep === 2) {
      lottieRefStep2.current?.play();
    } else {
      lottieRefStep2.current?.reset();
    }

    if (currentStep === 3) {
      lottieRefStep3.current?.play();
    } else {
      lottieRefStep3.current?.reset();
    }

    return () => backHandler.remove();
  }, [currentStep]);

  useEffect(() => {
    const getAddressCoordinate = async () => {
      if (!selectedCity || !selectedDistrict || !selectedNeighborhood) return;

      try {
        // Sorguyu hazırla
        const query = encodeURIComponent(
          `${selectedNeighborhood.label}, ${selectedDistrict.label}, ${selectedCity.label}, Turkey`,
        );
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'PeticimApp/1.0 (info@peticimapp.com)',
          },
        });
        const data = await response.json();
        if (!data[0]) {
          showToast({
            type: 'error',
            text1: 'Hata',
            text2:
              'Konum bilgisi alınırken hata meydana geldi, konum al seçeneğini kullanınız.',
          });
          setLocationModalVisible(false);
          return;
        }
        const hash = geofire.geohashForLocation([+data[0].lat, +data[0].lon]);
        const addressInfo = {
          city: selectedCity.label,
          district: selectedDistrict.label,
          formattedAddress: `${selectedNeighborhood.label} Mahallesi, ${selectedDistrict.label}, ${selectedCity.label}, Türkiye`,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          geohash: hash,
        };
        formik.setFieldValue('address', addressInfo);
        setSelectedCity(null);
        setSelectedDistrict(null);
        setSelectedNeighborhood(null);
        setLocationModalVisible(false);
      } catch (err: any) {
        console.error('Konum sorgusu hatası:', err.message);
      }
    };

    getAddressCoordinate();
  }, [selectedCity, selectedDistrict, selectedNeighborhood]);

  useFocusEffect(
    useCallback(() => {
      // formikRef'i güncelle
      formikRef.current = formik;

      // Formik reset et - tüm alanları temizle
      formikRef.current.resetForm({
        values: {
          title: '',
          description: '',
          photos: [],
          animalType: '',
          animalBreed: '',
          vaccinated: false,
          sterilized: false,
          phone: '',
          age: null,
          address: null,
        },
        touched: {},
        errors: {},
      });

      // Diğer state'leri reset et
      setCurrentStep(1);
      setBreedsList([]);
      setSelectedCity(null);
      setSelectedDistrict(null);
      setSelectedNeighborhood(null);
      setLocationModalVisible(false);
      slideAnim.setValue(0);

      return () => {};
    }, []), // ⚠️ Boş dependency array - sadece screen enter'da çalış
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <ScrollView style={{ flex: 1 }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              width: width * 3,
              transform: [{ translateX: slideAnim }],
            }}
          >
            {/* Step 1 → Fotoğraf, Başlık, Açıklama */}
            <View style={{ width, padding: 16 }}>
              {formik.values.photos.length === 0 ? (
                <>
                  <TouchableOpacity
                    onPress={handleImagePick}
                    style={styles.addImageButton}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name="images-outline"
                      color={colors.gray}
                      type="ion"
                      size={36}
                    />
                    <Text style={styles.addImageText}>Resim Seç</Text>
                  </TouchableOpacity>
                  {formik.touched.photos && formik.errors.photos && (
                    <Text style={styles.errorText}>{formik.errors.photos}</Text>
                  )}
                </>
              ) : (
                <View>
                  <Swiper
                    horizontal
                    loop={false}
                    height={200}
                    dotColor={colors.gray}
                    activeDotColor={colors.white}
                    style={{
                      backgroundColor: colors.gray,
                    }}
                  >
                    {formik.values.photos.map((image: any, i: number) => (
                      <Image
                        key={i}
                        style={{
                          width: '100%',
                          height: 200,
                          resizeMode: 'contain',
                          borderRadius: 12,
                        }}
                        source={{ uri: image.uri }}
                      />
                    ))}
                  </Swiper>

                  <TouchableOpacity
                    onPress={handleImagePick}
                    style={styles.pickNewPhotos}
                  >
                    <Text style={styles.pickNewPhotosText}>
                      Fotoğrafları Değiştir
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={{ gap: 12, marginTop: 12 }}>
                <Input
                  label="Başlık"
                  placeholder="İlan başlığı giriniz.."
                  defaultValue={formik.values.title}
                  value={formik.values.title}
                  onChangeText={text => formik.setFieldValue('title', text)}
                  onBlur={() => formik.setFieldTouched('title')}
                  error={formik.touched.title ? formik.errors.title : ''}
                />
                <Input
                  label="Açıklama"
                  placeholder="Hayvan hakkında açıklama..."
                  multiline
                  numberOfLines={5}
                  value={formik.values.description}
                  defaultValue={formik.values.description}
                  onChangeText={text =>
                    formik.setFieldValue('description', text)
                  }
                  onBlur={() => formik.setFieldTouched('description')}
                  maxLength={300}
                  customStyles={{
                    input: { minHeight: 80, textAlignVertical: 'top' },
                  }}
                  showCharacterCount
                  error={
                    formik.touched.description ? formik.errors.description : ''
                  }
                />
                <Button label="Devam Et" onPress={nextStep} />
              </View>
            </View>

            {/* Step 2 → Tür, Cins, Yaş, Sağlık Durumu */}
            <View style={{ width, padding: 16 }}>
              <View style={styles.headingContainer}>
                <LottieView
                  ref={lottieRefStep2}
                  source={require('@assets/lottie/questionMark.json')}
                  autoPlay={true}
                  loop={false}
                  style={{ width: 120, height: 120 }}
                />
                <Text style={styles.detailedTextSub}>
                  Hayvanınızla ilgili ek bilgiler ekleyin; sahiplenmek isteyen
                  kişilerin daha iyi karar vermesine yardımcı olur.
                </Text>
              </View>
              <View style={{ gap: 12 }}>
                <Picker
                  label="Tür"
                  items={animalTypes}
                  onSelect={(item: PickerItem) => handleTypeChange(item.value)}
                  value={formik.values.animalType}
                  error={
                    formik.touched.animalType && formik.errors.animalType
                      ? formik.errors.animalType
                      : undefined
                  }
                />
                {formik.values.animalType && breedsList.length > 0 && (
                  <Picker
                    label="Cins"
                    items={breedsList}
                    value={formik.values.animalBreed}
                    onSelect={(item: PickerItem) => {
                      formik.setFieldValue('animalBreed', item.value);
                    }}
                    error={
                      formik.touched.animalBreed && formik.errors.animalBreed
                        ? formik.errors.animalBreed
                        : ''
                    }
                  />
                )}
                <Input
                  label="Yaş"
                  placeholder="Yaş giriniz.."
                  keyboardType="decimal-pad"
                  defaultValue={
                    formik.values.age ? String(formik.values.age) : ''
                  }
                  value={formik.values.age ? String(formik.values.age) : ''}
                  onChangeText={text =>
                    formik.setFieldValue('age', text ? Number(text) : '')
                  }
                  onBlur={() => formik.setFieldTouched('age')}
                  error={formik.touched.age ? formik.errors.age : ''}
                />
                {shouldShowHealthOption && (
                  <View style={styles.healthStatusContainer}>
                    <Text style={styles.healthStatusText}>Sağlık Durumu</Text>
                    <View style={styles.healthStatusCheckboxesContainer}>
                      <Checkbox
                        label="Aşıları yapılı mı?"
                        checked={formik.values.vaccinated}
                        onCheckChange={val =>
                          formik.setFieldValue('vaccinated', val)
                        }
                      />
                      <Checkbox
                        label="Kısırlaştırıldı mı?"
                        checked={formik.values.sterilized}
                        onCheckChange={val =>
                          formik.setFieldValue('sterilized', val)
                        }
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.stepButtonsContainer}>
                <Button label="Geri" outline onPress={prevStep} />
                <Button label="Devam Et" onPress={nextStep} />
              </View>
            </View>
            {/* Step 3 → İletişim Bilgileri */}
            <View style={{ width, padding: 16, gap: 12 }}>
              <View style={styles.headingContainer}>
                <LottieView
                  ref={lottieRefStep3}
                  source={require('@assets/lottie/contact.json')}
                  loop={false}
                  autoPlay={true}
                  style={{ width: 120, height: 120 }}
                />
                <Text style={styles.detailedTextSub}>
                  Sahiplenmek isteyen kişilerin size ulaşabilmesi için iletişim
                  bilgilerinizi paylaşın.
                </Text>
              </View>

              {/* Auto-fill saved details option */}
              {userDetails?.phone || userDetails?.address ? (
                <View style={styles.autoFillContainer}>
                  <Text style={styles.autoFillTitle}>
                    Kaydedilmiş Bilgilerinizi Kullanın
                  </Text>
                  <TouchableOpacity
                    style={styles.autoFillButton}
                    onPress={() => {
                      if (userDetails?.phone) {
                        formik.setFieldValue('phone', userDetails.phone);
                      }
                      if (userDetails?.address) {
                        formik.setFieldValue('address', userDetails.address);
                      }
                    }}
                  >
                    <Icon
                      name="checkmark-circle-outline"
                      type="ion"
                      size={20}
                      color={colors.primary}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      {userDetails?.phone && (
                        <Text style={styles.autoFillText}>
                          Tel: {userDetails.phone}
                        </Text>
                      )}
                      {userDetails?.address && (
                        <Text style={styles.autoFillText} numberOfLines={2}>
                          Adres:{' '}
                          {(userDetails.address as any).formattedAddress ||
                            userDetails.address}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              <Input
                label="Telefon"
                placeholder="5xxxxxxxxx"
                keyboardType="phone-pad"
                maxLength={10}
                defaultValue={formik.values.phone}
                value={formik.values.phone}
                onChangeText={text => formik.setFieldValue('phone', text)}
                onBlur={() => formik.setFieldTouched('phone')}
                error={formik.touched.phone ? formik.errors.phone : ''}
              />
              <View>
                <Text style={styles.addressLabel}>Adres</Text>
                {formik.values.address && (
                  <Text style={styles.formattedAddressText}>
                    {typeof formik.values.address === 'string'
                      ? formik.values.address
                      : (formik.values.address as any).formattedAddress}
                  </Text>
                )}
                <View>
                  <View style={styles.addressSelectOption}>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Konumumu Al"
                        onPress={async () => {
                          const addressInfo = await getLocationInfo();
                          if (addressInfo) {
                            formik.setFieldValue('address', addressInfo);
                          }
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Konum Seç"
                        onPress={() => {
                          setLocationModalVisible(true);
                        }}
                      />
                    </View>
                  </View>
                </View>

                {formik.errors.address && formik.touched.address && (
                  <Alert withIcon={false} message={formik.errors.address} />
                )}
              </View>
              <View style={styles.stepButtonsContainer}>
                <Button label="Geri" outline onPress={prevStep} />
                <Button label="Paylaş" onPress={formik.handleSubmit} />
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <Modal
          isVisible={locationModalVisible}
          onBackdropPress={() => setLocationModalVisible(false)}
          onBackButtonPress={() => setLocationModalVisible(false)}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropTransitionOutTiming={1}
          hideModalContentWhileAnimating={false}
          style={styles.locationModalContainer}
        >
          <View style={styles.locationModalContentContainer}>
            <Picker
              items={cities}
              label="Şehir"
              value={selectedCity?.value || null}
              onSelect={handleCitySelect}
            />
            {selectedCity && (
              <Picker
                label="İlçe"
                items={districts}
                value={selectedDistrict?.value || null}
                onSelect={handleDistrictSelect}
              />
            )}
            {selectedDistrict && (
              <Picker
                label="Mahalle"
                items={neighborhoods}
                value={selectedNeighborhood?.value || null}
                onSelect={handleNeighborhoodSelect}
              />
            )}
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddAdoption;
