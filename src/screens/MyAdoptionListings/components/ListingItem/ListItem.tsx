import React from 'react';
import { View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { useLoading } from '@context/LoadingContext';
import { deleteListing } from '@firebase/listingService';
import { useAuth } from '@context/AuthContext';
import styles from './ListItem.style';
import { Icon } from '@components';
import colors from '@utils/colors';
import { useNavigation } from '@react-navigation/native';

type ListingItemProps = {
  item: ListingItem;
  onDeleted: (id: string) => void;
};

const ListItem = ({ item, onDeleted }: ListingItemProps) => {
  const navigation = useNavigation();
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();

  const handleDeleteListing = (listingId: string) => {
    Alert.alert(
      'İlanı Sil',
      'Bu ilanı silmek istediğine emin misin?',
      [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          style: 'destructive',
          onPress: async () => {
            try {
              showLoading();
              await deleteListing(listingId, user?.uid);
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

  const navigateToListing = () => {
    navigation.navigate('AdoptionDetails', { data: item });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonLeft} onPress={navigateToListing}>
        <Image source={{ uri: item.images[0]?.url }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.animalType}>{item.animalType}</Text>

          {/* Onay durumu badge */}
          <Text
            style={[
              styles.approvalText,
              { color: item.isApproved ? colors.success : colors.error },
            ]}
          >
            {item.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
          </Text>
          {item.isApproved && (
            <View style={styles.viewsContainer}>
              <Icon name="eye-outline" color={colors.black_50} size={18} />
              <Text style={styles.viewsText}>{item.views} görüntülenme</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDeleteListing(item.id)}>
        <Text style={styles.removeAdoptionText}>Kaldır</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListItem;
