import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  RouteProp,
} from '@react-navigation/native';
import { Checkbox, Input } from '@components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { loginValidationSchema } from '@utils/validationSchemas';
import { showToast } from '@config/toastConfig';
import { useAuth } from '@context/AuthContext';
import { generateFirebaseErrorMessage } from '@firebase/helpers/generateFirebaseErrorMessage';
import {
  getCredentials,
  removeCredentials,
  saveCredentials,
} from '@utils/storage';
import styles from './Login.style';

const Login = () => {
  // Hooks
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const { login } = useAuth();

  // States
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: route.params?.prefilledEmail || '',
    password: '',
  });

  // Hooks
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const credentials = await getCredentials();
        if (credentials) {
          setInitialValues({
            email: credentials.email,
            password: credentials.password,
          });
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Failed to load credentials from storage:', error);
        setRememberMe(false);
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
      await login(email, password);
      if (rememberMe) {
        await saveCredentials(email, password);
      } else {
        await removeCredentials();
      }
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
                    autoCapitalize='none'
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
                    autoCapitalize='none'
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
