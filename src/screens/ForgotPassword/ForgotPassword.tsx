import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Input, Button, BackButton } from '@components';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './ForgotPassword.style';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';
import { isValidEmail, isEmpty } from '@utils/basicValidations';
import { showToast } from '@config/toastConfig';

const ForgotPassword = () => {
  const route = useRoute<RouteProp<AuthStackParamList, 'ForgotPassword'>>();
  const navigation = useNavigation();
  const [email, setEmail] = useState(route.params.prefilledEmail || '');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { passwordReset } = useAuth();

  const handleForgotPassword = async () => {
    try {
      if (!error) {
        await passwordReset(email);
        showToast({
          type: 'info',
          text1: 'E-posta Kontrolü',
          text2:
            'Girmiş olduğunuz e-posta adresine şifre sıfırlama bağlantısı gönderildi.',
          duration: 'long',
        });
        navigation.goBack();
      }
    } catch (error: any) {
      setError(error.message);
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
      <View style={styles.backButtonContainer}>
        <BackButton size={36} />
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
