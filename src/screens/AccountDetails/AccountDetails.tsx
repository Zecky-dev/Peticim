import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import styles from './AccountDetails.style';
import { CircleButton, Button, Input } from '@components';
import { useAuth } from '@context/AuthContext';
import { Formik } from 'formik';
import { accountDetailsValidationSchema } from '@utils/validationSchemas';
import { useLoading } from '@context/LoadingContext';
import { useUserDetails } from '@hooks/useUserDetails';

import { doc, setDoc } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';
import useLocation from '@hooks/useLocation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '@config/toastConfig';
import colors from '@utils/colors';

const AccountDetails = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { userDetails } = useUserDetails(user?.uid || null); 
  const { getLocationInfo } = useLocation();

  const [isSubmitted, setIsSubmitted] = useState(false);

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
      showToast({
        type: 'success',
        text1: 'Başarılı',
        text2: 'Hesap detaylarınız güncellendi.'
      })
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
    } finally {
      hideLoading();
    }
  };

  const initialValues = {
    name: userDetails?.name,
    surname: userDetails?.surname,
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
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <View style={{ marginBottom: 16 }}>
              <CircleButton/>
            </View>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={accountDetailsValidationSchema}
              onSubmit={values => updateUserDetails(values)}
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
                        const addressObj = await getLocationInfo();
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