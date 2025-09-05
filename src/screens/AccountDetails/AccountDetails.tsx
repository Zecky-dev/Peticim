import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { BackButton, Button, Input } from '@components';
import { useAuth } from '@context/AuthContext';
import { Formik } from 'formik';
import { accountDetailsValidationSchema } from '@utils/validationSchemas';
import { useLoading } from '@context/LoadingContext';
import { useUserDetails } from '@hooks/useUserDetails';
import styles from './AccountDetails.style';

import axios from 'axios';
import { doc, setDoc } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';

const AccountDetails = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { userDetails } = useUserDetails();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const name = user?.displayName?.split(' ')[0] || '';
  const surname = user?.displayName?.split(' ')[1] || '';

  const getAddressInfo = async (): Promise<{
    latitude: number;
    longitude: number;
    formattedAddress: string;
  } | null> => {
    try {
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
          [{ text: 'Tamam', style: 'default' }],
        );
        return null;
      }

      showLoading();

      const position = await new Promise<Geolocation.GeoPosition>(
        (resolve, reject) =>
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }),
      );

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const addressInfo = (
        await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${latitude}&lon=${longitude}`,
          {
            headers: { 'User-Agent': 'PeticimApp/1.0 (info@peticimapp.com)' },
          },
        )
      ).data;

      const feature = addressInfo.features[0];
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
      console.warn(err);
      return null;
    } finally {
      hideLoading();
    }
  };

  const updateUserDetails = async (values: any) => {
    if (!user?.uid) return;

    const userRef = doc(db, 'Users', user.uid);

    const dataToUpdate = {
      name: values.name,
      surname: values.surname,
      phone: values.phone || null,
      bio: values.bio || null,
      address:
        values.address && values.address.formattedAddress
          ? values.address
          : null,
    };

    try {
      showLoading();
      await setDoc(userRef, dataToUpdate, { merge: true });
      Alert.alert('Başarılı', 'Hesap detaylarınız güncellendi.');
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
    } finally {
      hideLoading();
    }
  };

  const initialValues = {
    name: name,
    surname: surname,
    phone: userDetails?.phone || '',
    bio: userDetails?.bio || '',
    address: userDetails?.address || {
      formattedAddress: '',
      latitude: -1,
      longitude: -1,
    },
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={110}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <View style={{ marginBottom: 16 }}>
              <BackButton size={36} />
            </View>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={accountDetailsValidationSchema}
              onSubmit={(values) => updateUserDetails(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <View style={{ gap: 12 }}>
                  <Text style={styles.accountDetailsText}>Hesap Detayları</Text>

                  <View style={styles.row}>
                    <View style={styles.full}>
                      <Input
                        label="İsim"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        placeholder="İsim"
                        error={
                          touched.name && errors.name && isSubmitted
                            ? errors.name
                            : undefined
                        }
                      />
                    </View>
                    <View style={styles.full}>
                      <Input
                        label="Soyisim"
                        placeholder="Soyisim"
                        value={values.surname}
                        onChangeText={handleChange('surname')}
                        onBlur={handleBlur('surname')}
                        error={
                          touched.surname && errors.surname
                            ? errors.surname
                            : undefined
                        }
                      />
                    </View>
                  </View>

                  <Input
                    label="Telefon Numarası"
                    maxLength={10}
                    keyboardType="numeric"
                    placeholder="5xxxxxxxxx"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    error={
                      touched.phone && errors.phone && isSubmitted
                        ? errors.phone
                        : undefined
                    }
                  />

                  <View>
                    <Text style={styles.addressTitle}>Adres</Text>
                    {values.address.formattedAddress && (
                      <Text style={styles.addressText}>
                        {values.address.formattedAddress}
                      </Text>
                    )}
                    <Button
                      label="Adres Ekle"
                      onPress={async () => {
                        const addressObj = await getAddressInfo();
                        if (addressObj) {
                          setFieldValue('address', addressObj);
                        }
                      }}
                      outline={true}
                    />
                  </View>

                  <Input
                    label="Biyografi"
                    multiline={true}
                    value={values.bio}
                    onChangeText={handleChange('bio')}
                    placeholder="Hayvanları çok severim...."
                    onBlur={handleBlur('bio')}
                    error={touched.bio && errors.bio ? errors.bio : undefined}
                    customStyles={{
                      input: {
                        height: 100,
                        textAlignVertical: 'top',
                      },
                    }}
                    showCharacterCount={true}
                    maxLength={120}
                  />

                  <Button
                    label="Kaydet"
                    onPress={() => {
                      setIsSubmitted(true);
                      handleSubmit();
                    }}
                  />
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountDetails;
