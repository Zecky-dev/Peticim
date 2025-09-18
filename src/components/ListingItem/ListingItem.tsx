import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Touchable } from 'react-native';
import styles from './ListingItem.style';
import Icon from '@components/Icon';
import colors from '@utils/colors';

import moment from 'moment';
import 'moment/locale/tr';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toggleFavorite } from '@firebase/listingService';
import { useAuth } from '@context/AuthContext';

type ListingItemProps = {
  data: ListingItem;
  favorited: boolean;
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

const ListingItem = ({ data, favorited }: ListingItemProps) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'AdoptionDetails'>
    >();
  const { user } = useAuth();

  const [isFavorited, setIsFavorited] = useState(favorited);
  const handleToggleFavorite = async () => {
    const toggleSuccess = await toggleFavorite(data.id, user?.uid);
    if (toggleSuccess) {
      setIsFavorited(!isFavorited);
    }
  };

  // Formats date
  const formattedDate = () => {
    const formattedDate = moment(data.createdAt.toDate()).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    return moment(formattedDate).fromNow();
  };

  const navigateToAdoptionDetails = () => {
    navigation.navigate('AdoptionDetails', { data });
  };

  if (data && data.photoURLs) {
    return (
      <TouchableOpacity
        onPress={navigateToAdoptionDetails}
        style={styles.container}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.photoURLs[0] }}
            style={styles.backgroundImage}
            blurRadius={20}
          />
          <Image source={{ uri: data.photoURLs[0] }} style={styles.image} />
          {data.userId !== user?.uid && (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={
                [styles.favoriteButton, { backgroundColor: isFavorited ? colors.white : "transparent"}]
              }
            >
              <Icon
                name={!isFavorited ? 'heart-outline' : 'heart'}
                color={isFavorited ? colors.error : colors.white}
                size={20}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={{flexShrink: 1}}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{data.title}</Text>
            <Text style={styles.animalBreed}>{data.animalBreed}</Text>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.infoRowWithIcon}>
              <Icon
                name="location-outline"
                type="ion"
                color={colors.white}
                size={18}
              />
              <Text style={styles.infoRowValue}>{data.address.city}</Text>
            </View>
            <View style={styles.infoRowWithIcon}>
              <Icon
                name="time-outline"
                type="ion"
                color={colors.white}
                size={18}
              />
              <Text style={styles.infoRowValue}>{formattedDate()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AdoptionDetails', {
          data,
        });
      }}
      style={styles.container}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.photoURLs[0] }}
          style={styles.backgroundImage}
          blurRadius={20}
        />
        <Image source={{ uri: data.photoURLs[0] }} style={styles.mainImage} />
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
      {data.userId !== user?.uid && (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[
            styles.favoriteButton,
            isFavorited && {
              borderColor: 'transparent',
              backgroundColor: colors.error,
            },
          ]}
        >
          <Icon
            name={isFavorited ? 'heart' : 'heart-outline'}
            type="ion"
            color={colors.white}
            size={18}
          />
        </TouchableOpacity>
      )}

      {data.views && data.views > 0 && (
        <View style={styles.viewCountContainer}>
          <Icon
            name="eye-outline"
            color={colors.black_50}
            size={18}
            type="ion"
          />
          <Text style={styles.viewCountText}>{data.views} Görüntüleme</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ListingItem;
