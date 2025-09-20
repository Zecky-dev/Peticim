import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Input, Button, CircleButton } from '@components';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import styles from './ForgotPassword.style';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';
import { isValidEmail, isEmpty } from '@utils/basicValidations';
import { showToast } from '@config/toastConfig';
import { generateFirebaseErrorMessage } from '@firebase/helpers/generateFirebaseErrorMessage';

const ForgotPassword = () => {
  const route = useRoute<RouteProp<AuthStackParamList, 'ForgotPassword'>>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(route.params.prefilledEmail || '');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { passwordReset } = useAuth();

  const handleForgotPassword = async () => {
    setIsSubmitted(true);
    if (error) return;
    try {
      await passwordReset(email);
      showToast({
        type: 'info',
        text1: 'E-posta Kontrolü',
        text2:
          'Girmiş olduğunuz e-posta adresine (hesabınız varsa) şifre sıfırlama bağlantısı gönderildi.',
        duration: 'long',
      });
      navigation.goBack();
    } catch (error: any) {
      console.error('HANDLE_FORGOT_PASSWORD_ERROR', error);
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

  const onEmailChange = (value: string) => {
    setEmail(value);
    if (isEmpty(value)) {
      setError('E-posta alanı boş bırakılamaz.');
    } else if (!isValidEmail(value)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
    } else {
      setError('');
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View
        style={[
          styles.backButtonContainer,
          { top: insets.top + 16, left: insets.left + 16 },
        ]}
      >
        <CircleButton iconSize={36}/>
      </View>
      <View style={styles.forgotPasswodForm}>
        <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
        <Input
          label="E-posta Adresi"
          value={email}
          onChangeText={val => onEmailChange(val)}
          placeholder="ornek@gmail.com"
          error={isSubmitted ? error : ''}
          keyboardType="email-address"
        />
        <Button
          label="Şifremi Sıfırla"
          onPress={() => {
            setIsSubmitted(true);
            handleForgotPassword();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
