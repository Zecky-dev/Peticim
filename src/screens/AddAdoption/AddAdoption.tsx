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
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { adoptionValidationSchema } from '@utils/validationSchemas';
import { createListing } from '@firebase/listingService';
import { classifyAnimal } from '@api/image';
import animalData from '../../constants/animalData.json';
import colors from '@utils/colors';
import styles from './AddAdoption.style';

import Modal from 'react-native-modal';
import useLocation from '@hooks/useLocation';
import { getCities, getNeighborhoods, getDistricts } from '@api/location';
import { showToast } from '@config/toastConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MultiStepForm = () => {
  // Hooks
  const navigation = useNavigation();
  const { images, setImages, pickFromLibrary } = useImagePicker();
  const { user, token } = useAuth();
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
      age: null,
      vaccinated: false,
      sterilized: false,
      phone: '',
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
    setNeighborhoods(neighborhoodItems);
  };

  const handleNeighborhoodSelect = (neighborhood: PickerItem) => {
    setSelectedNeighborhood(neighborhood);
  };

  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  // Refs
  const lottieRefStep2 = useRef<LottieView>(null);
  const lottieRefStep3 = useRef<LottieView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    console.log(type);
    formik.setFieldValue('animalType', type);
    formik.setFieldTouched('animalType', true, true);
    formik.setFieldValue('animalBreed', '');
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
    const listingData = {
      title: formik.values.title,
      description: formik.values.description,
      animalType: formik.values.animalType,
      animalBreed: formik.values.animalBreed,
      age: formik.values.age,
      vaccinated: formik.values.vaccinated,
      sterilized: formik.values.sterilized,
      phone: formik.values.phone,
      address: formik.values.address,
    };
    const result = await createListing(
      listingData,
      formik.values.photos,
      user.uid,
    );
    if (result?.success) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Adoptions' }],
        }),
      );
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

      // Tüm fotoğrafları sınıflandır
      const results = await classifyAnimal(pickedImages, token);

      // Hayvan olmayan fotoğrafları filtrele
      const validImages = pickedImages.filter(
        (_, index) => results[index].isAnimal,
      );
      const nonAnimalCount = pickedImages.length - validImages.length;

      if (nonAnimalCount > 0) {
        showToast({
          type: 'error',
          text1: 'Hata',
          text2: `Sadece hayvan fotoğrafları yükleyebilirsiniz. ${nonAnimalCount} fotoğraf reddedildi.`,
        });
      }

      formik.setFieldValue('photos', validImages);
      setImages(validImages);
    } catch (err) {
      console.error('Hayvan kontrolü hatası:', err);
      showToast({
        type: 'error',
        text1: 'Hata',
        text2: 'Fotoğraflar kontrol edilemedi. Lütfen tekrar deneyin.',
      });
      formik.setFieldValue('photos', []);
      setImages([]);
    } finally {
      hideLoading();
    }
  };

  // Konum için gerekli
  useEffect(() => {
    const getCityList = async () => {
      const citiesRes = await getCities();
      const cityNames = citiesRes.map((city: any) => ({
        value: city.id,
        label: city.name,
      }));
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
        const addressInfo = {
          city: selectedCity.label,
          district: selectedDistrict.label,
          formattedAddress: `${selectedNeighborhood.label} Mahallesi, ${selectedDistrict.label}, ${selectedCity.label}, Türkiye`,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
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
      formik.resetForm();
      setCurrentStep(1);
      setImages([]);
      setBreedsList([]);
      slideAnim.setValue(0);
      return () => {};
    }, []),
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
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
              {images.length === 0 ? (
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
                    {images.map((image, i) => (
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
                  onChangeText={text =>
                    formik.setFieldValue('description', text)
                  }
                  onBlur={() => formik.setFieldTouched('description')}
                  maxLength={240}
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
              <Input
                label="Telefon"
                placeholder="5xxxxxxxxx"
                keyboardType="phone-pad"
                maxLength={10}
                value={formik.values.phone}
                onChangeText={text => formik.setFieldValue('phone', text)}
                onBlur={() => formik.setFieldTouched('phone')}
                error={formik.touched.phone ? formik.errors.phone : ''}
              />
              <View>
                <Text style={styles.addressLabel}>Adres</Text>
                {formik.values.address && (
                  <Text style={styles.formattedAddressText}>
                    {formik.values.address.formattedAddress}
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
    </SafeAreaView>
  );
};

export default MultiStepForm;
