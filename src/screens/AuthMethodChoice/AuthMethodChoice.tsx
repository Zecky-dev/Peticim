import React from 'react';
import { Image, View, Text } from 'react-native';
import { Button, Icon } from '@components';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './AuthMethodChoice.style';
import colors from '@utils/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@context/AuthContext';

const AuthMethodChoice = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AuthStackParamList, 'AuthMethodChoice'>
    >();
  const { googleLogin } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.chooseLoginMethodText}>Giriş Yöntemi</Text>
      <View style={styles.buttonsContainer}>
        <Button
          label="Google ile giriş yap"
          onPress={googleLogin}
          icon={
            <Icon
              name="logo-google"
              size={24}
              color={colors.white}
              type="ion"
            />
          }
        />
        <Button
          label="E-posta ve şifre kullan"
          onPress={() => navigation.navigate('Login')}
          icon={<Icon name="mail" size={24} color={colors.white} type="ion" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default AuthMethodChoice;
