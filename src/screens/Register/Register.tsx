import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from './Register.style';
import { BackButton, Button, Alert, Input } from '@components';
import { Formik } from 'formik';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerValidationSchema } from '@utils/validationSchemas';

import { showToast } from '@config/toastConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';

const Register = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { hideLoading } = useLoading();

  const handleRegister = async (
    email: string,
    password: string,
    otherData: any,
  ) => {
    try {
      await register(email, password, otherData);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
              params: { prefilledEmail: email },
            },
          ],
        }),
      );
      showToast({
        type: 'info',
        text1: 'Hesabını Doğrula',
        text2:
          'Girmiş olduğunuz e-posta adresinden e-posta adresinizi doğrulayın.',
        duration: 'long',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        text1: 'Hata!',
        text2: error.message,
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.backButtonContainer, { top: insets.top + 16, left: insets.left + 16}]}>
        <BackButton size={36} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 32}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.registerText}>Kayıt Ol</Text>

          <Formik
            initialValues={{
              name: '',
              surname: '',
              email: '',
              password: '',
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const otherData = {
                name: values.name,
                surname: values.surname,
                email: values.email,
                profilePicture: '',
                address: '',
                phone: '',
              };
              await handleRegister(values.email, values.password, otherData);
              setSubmitting(false);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={styles.form}>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Input
                      label="İsim"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      placeholder="İsim"
                    />
                    {errors.name && touched.name && isSubmitted && (
                      <Alert withIcon={false} message={errors.name} />
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Input
                      label="Soyisim"
                      onChangeText={handleChange('surname')}
                      onBlur={handleBlur('surname')}
                      value={values.surname}
                      placeholder="Soyisim"
                    />
                    {errors.surname && touched.surname && isSubmitted && (
                      <Alert withIcon={false} message={errors.surname} />
                    )}
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    label="E-posta"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="ornek@mail.com"
                    keyboardType="email-address"
                    value={values.email}
                  />
                  {errors.email && touched.email && isSubmitted && (
                    <Alert withIcon={false} message={errors.email} />
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    label="Şifre"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="********"
                    maxLength={12}
                    keyboardType="default"
                    secureContent={true}
                  />
                  {errors.password && touched.password && isSubmitted && (
                    <Alert withIcon={false} message={errors.phone} />
                  )}
                </View>
                <View style={{ marginTop: 12 }}>
                  <Button
                    label="Kayıt Ol"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
