import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import styles from './ListingItem.style';
import Icon from '@components/Icon';
import colors from '@utils/colors';
import Modal from 'react-native-modal';

import moment from 'moment';
import 'moment/locale/tr';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ListingItemProps = {
  data: ListingItem;
  photoURLs: string[];
};

type InfoLabelProps = {
  label: string;
  icon: React.ReactNode;
};

const InfoRow = ({ icon, label }: InfoLabelProps) => {
  return (
    <View style={styles.infoRowContainer}>
      {icon}
      <Text style={styles.infoRowLabel}>{label}</Text>
    </View>
  );
};

const ListingItem = ({ data, photoURLs }: ListingItemProps) => {
  const [fullScreenModalVisible, setFullScreenModalVisible] = useState(false);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'AdoptionDetails'>
    >();

  const formattedDate = () => {
    const formattedDate = moment(data.createdAt.toDate()).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    return moment(formattedDate).fromNow();
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AdoptionDetails', {
          data: { ...data, photoURLs },
        });
      }}
      style={styles.container}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photoURLs[0] }}
          style={styles.backgroundImage}
          blurRadius={20}
        />
        <Image source={{ uri: photoURLs[0] }} style={styles.mainImage} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoTopContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.breed}>{data.animalBreed}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <View style={styles.infoRowsContainer}>
            <InfoRow
              label={data.address.city}
              icon={
                <Icon
                  name="location-outline"
                  type="ion"
                  color={colors.white}
                  size={14}
                />
              }
            />
            <InfoRow
              label={formattedDate()}
              icon={
                <Icon
                  name="clock-outline"
                  type="material-community"
                  color={colors.white}
                  size={14}
                />
              }
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => console.log('Favorite')}
        style={styles.favoriteButton}
      >
        <Icon name="heart" type="ion" color={colors.white} size={18} />
      </TouchableOpacity>

      <Modal
        backdropOpacity={0.95}
        isVisible={fullScreenModalVisible}
        style={styles.fullScreenModalContainer}
        onBackButtonPress={() => setFullScreenModalVisible(false)}
        onBackdropPress={() => setFullScreenModalVisible(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        backdropTransitionOutTiming={1}
      >
        <Image source={{ uri: photoURLs[0] }} style={styles.fullScreenImage} />
      </Modal>
    </TouchableOpacity>
  );
};

export default ListingItem;
