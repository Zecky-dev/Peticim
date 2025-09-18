import React from 'react';
import { View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { useLoading } from '@context/LoadingContext';
import { deleteListing } from '@firebase/listingService';
import { useAuth } from '@context/AuthContext';
import styles from './ListItem.style';
import { Icon } from '@components';
import colors from '@utils/colors';

type ListingItemProps = {
  item: ListingItem;
  onDeleted: (id: string) => void;
};

const ListItem = ({ item, onDeleted }: ListingItemProps) => {
  const { showLoading, hideLoading } = useLoading();
  const { user, token } = useAuth();

  const handleDeleteListing = (listingId: string) => {
    Alert.alert(
      'İlanı Sil',
      'Bu ilanı silmek istediğine emin misin?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          style: 'destructive',
          onPress: async () => {
            try {
              showLoading();
              await deleteListing(listingId, user?.uid, token);
              onDeleted(listingId);
            } catch (error) {
              console.error('HANDLE_DELETE_LISTING_ERROR', error);
            } finally {
              hideLoading();
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonLeft}>
        <Image
          source={{ uri: item.photoURLs[0] }}
          style={styles.image}
        />
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.animalType}>{item.animalType}</Text>
          <View style={styles.viewsContainer}>
            <Icon name='eye-outline' color={colors.black_50} size={18}/>
            <Text style={styles.viewsText}>{item.views} görüntülenme</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteListing(item.id)}>
        <Text style={styles.removeAdoptionText}>Kaldır</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListItem;
