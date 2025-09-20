import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
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
        <Image source={{ uri: data.photoURLs[0] }} style={styles.image} />

        <View style={styles.rightContainer}>
          <View style={styles.rightContainerTop}>
            <View style={styles.rightContainerTopLeft}>
              <Text style={styles.animalType}>
                {data.animalType} - {data.animalBreed}
              </Text>
              <Text style={styles.title}>{data.title}</Text>
              {data.age && <Text style={styles.age}>{data.age} yaşında</Text>}
            </View>
            <View style={{ gap: 6 }}>
              <View style={styles.infoRow}>
                <Icon
                  name="location-outline"
                  size={16}
                  color={colors.black}
                  type="ion"
                />
                <Text style={styles.infoValue}>{data.address.city}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  name="time-outline"
                  size={16}
                  color={colors.black}
                  type="ion"
                />
                <Text style={styles.infoValue}>{formattedDate()}</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.infoRow,
              { position: 'absolute', bottom: 4, right: 4 },
            ]}
          >
            <Text style={[styles.infoValue, { color: colors.black_50 }]}>
              {data.views} Görüntülenme
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

export default ListingItem;
