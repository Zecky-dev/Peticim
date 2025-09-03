import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  RouteProp,
} from '@react-navigation/native';
import { Alert, Checkbox, Input } from '@components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Formik } from 'formik';
import { loginValidationSchema } from '@utils/validationSchemas';
import { showToast } from '@config/toastConfig';
import { useLoading } from '@context/LoadingContext';
import Storage from '@utils/storage';
import styles from './Login.style';
import { useAuth } from '@context/AuthContext';

const REMEMBER_ME_KEY = 'rememberMe';
const EMAIL_KEY = 'email';
const PASSWORD_KEY = 'password';

const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const { showLoading, hideLoading } = useLoading();
  const { login } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: route.params?.prefilledEmail || '',
    password: '',
  });

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const storedRememberMe = await Storage.getItem(REMEMBER_ME_KEY);
        if (storedRememberMe === 'true') {
          setRememberMe(true);
          const storedEmail = await Storage.getItem(EMAIL_KEY);
          const storedPassword = await Storage.getItem(PASSWORD_KEY);
          if (storedEmail && storedPassword) {
            setInitialValues({
              email: storedEmail,
              password: storedPassword,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load credentials from storage:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsSubmitted(false);
    }, []),
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      showLoading();
      await login(email, password);
      if (rememberMe) {
        await Promise.all([
          Storage.saveItem(REMEMBER_ME_KEY, 'true'),
          Storage.saveItem(EMAIL_KEY, email),
          Storage.saveItem(PASSWORD_KEY, password),
        ]);
      } else {
        await Promise.all([
          Storage.removeItem(REMEMBER_ME_KEY),
          Storage.removeItem(EMAIL_KEY),
          Storage.removeItem(PASSWORD_KEY),
        ]);
      }
    } catch (error: any) {
      console.log('HANDLE_LOGIN_ERROR', error);
      showToast({
        type: 'error',
        text1: 'Hata!',
        text2: error.message,
        duration: 'medium',
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image
          source={require('@assets/images/logo.png')}
          style={styles.logo}
        />

        <View style={styles.loginContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleLogin(values.email, values.password);
              setSubmitting(false);
            }}
            enableReinitialize
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              resetForm,
            }) => {
              return (
                <View style={styles.form}>
                  <Input
                    label="E-posta"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="ornek@mail.com"
                    keyboardType="email-address"
                    value={values.email}
                    error={
                      errors.email && touched.email && isSubmitted
                        ? errors.email
                        : ''
                    }
                  />
                  <Input
                    label="Şifre"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="********"
                    maxLength={12}
                    keyboardType="default"
                    secureContent={true}
                    error={
                      errors.password && touched.password && isSubmitted
                        ? errors.password
                        : ''
                    }
                  />
                  <View style={{ marginTop: 8 }}>
                    <Checkbox
                      label="Beni hatırla"
                      checked={rememberMe}
                      onCheckChange={setRememberMe}
                    />
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setIsSubmitted(true);
                        handleSubmit();
                      }}
                      style={styles.loginButton}
                      disabled={isSubmitting}
                    >
                      <Text style={styles.loginButtonText}>Giriş Yap</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('Register')}
                      style={styles.registerButton}
                    >
                      <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={styles.forgotPasswordButton}
                      onPress={() =>
                        navigation.navigate('ForgotPassword', {
                          prefilledEmail: values.email,
                        })
                      }
                    >
                      <Text style={styles.forgotPasswordButtonText}>
                        Şifremi Unuttum?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
