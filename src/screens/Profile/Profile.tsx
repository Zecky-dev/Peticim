import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Profile.style';
import { Icon } from '@components';
import colors from '@utils/colors';
import { useAuth } from '@context/AuthContext';

const Profile = () => {

  const {user} = useAuth();

  console.log(user);


  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TouchableOpacity onPress={() => console.log('Select Image')}>
        <Image
          source={require('@assets/images/avatar_default.png')}
          style={styles.avatar}
        />
        <View style={styles.plusContainer}>
          <Icon name="plus" type="feather" size={14} color={colors.white} />
        </View>
      </TouchableOpacity>
      <Text style={styles.nameSurname}>{user?.displayName}</Text>
    </SafeAreaView>
  );
};

export default Profile;
