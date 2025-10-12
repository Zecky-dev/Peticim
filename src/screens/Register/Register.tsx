import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CircleButton, Button, Alert, Input } from '@components';

import { Formik } from 'formik';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { showToast } from '@config/toastConfig';
import { registerValidationSchema } from '@utils/validationSchemas';
import { generateFirebaseErrorMessage } from '@firebase/helpers/generateFirebaseErrorMessage';
import { useAuth } from '@context/AuthContext';

import styles from './Register.style';

const Register = () => {
  const { register } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleRegister = async (
    email: string,
    password: string,
    otherData: any,
  ) => {
    try {
      await register(email.toLowerCase(), password, otherData);
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
      if (error.code) {
        showToast({
          type: 'error',
          text1: 'Hata',
          text2: generateFirebaseErrorMessage(error.code),
        });
      } else {
        showToast({
          type: 'error',
          text1: 'Hata',
          text2: 'Bilinmeyen bir hata oluştu, tekrar deneyiniz.',
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.backButtonContainer,
          { top: insets.top + 16, left: insets.left + 16 },
        ]}
      >
        <CircleButton iconSize={36} />
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
                role: 'user',
                isBanned: false,
                privacyPolicyAccepted: false,
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
                    {errors.name && isSubmitted && (
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
                    {errors.surname && isSubmitted && (
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
                    autoCapitalize="none"
                  />
                  {errors.email && isSubmitted && (
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
                    autoCapitalize="none"
                  />
                  {errors.password && isSubmitted && (
                    <Alert withIcon={false} message={errors.password} />
                  )}
                </View>
                <View style={{ marginTop: 12 }}>
                  <Button
                    label="Kayıt Ol"
                    onPress={() => {
                      setIsSubmitted(true);
                      handleSubmit();
                    }}
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
