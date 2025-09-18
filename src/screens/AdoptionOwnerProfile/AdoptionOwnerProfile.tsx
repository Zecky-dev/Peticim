import React, { useEffect } from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import styles from './AdoptionOwnerProfile.style';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';

const AdoptionOwnerProfile = () => {
  const route =
    useRoute<RouteProp<AdoptionStackParamList, 'AdoptionOwnerProfile'>>();
  const { ownerData } = route.params;
  
  if (ownerData) {
    return (
      <View style={styles.container}>
        <Image
          source={
            !ownerData.profilePictureURL
              ? require('@assets/images/avatar_default.png')
              : { uri: ownerData.profilePictureURL }
          }
          style={styles.avatar}
        />
      </View>
    );
  }
};

export default AdoptionOwnerProfile;
