import React from 'react';
import { View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { useLoading } from '@context/LoadingContext';
import { deleteListing } from '@firebase/listingService';
import { useAuth } from '@context/AuthContext';
import styles from './ListItem.style';
import { Icon } from '@components';
import { useNavigation } from '@react-navigation/native';
import { ListingItem } from 'types/global';
import colors from '@utils/colors';

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
        {item.images?.length > 0 ? (
          <Image source={{ uri: item.images[0].url }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.gray }]}>
            <Icon name="image-outline" size={32} color={colors.white} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.animalType}>{item.animalType}</Text>

          {/* Onay durumu badge */}
          <Text
            style={[
              styles.approvalText,
              {
                color:
                  item.status === 'approved'
                    ? colors.success
                    : item.status === 'pending'
                    ? colors.warning
                    : colors.error,
              },
            ]}
          >
            {item.status === 'approved'
              ? 'Onaylandı'
              : item.status === 'pending'
              ? 'Onay bekliyor'
              : 'Reddedildi'}
          </Text>

          {/* Reddedilme nedeni */}
          {item.status === 'rejected' && item.rejectionReason && (
            <Text style={styles.rejectionText}>
              <Text style={styles.rejectionTitle}>
                Sebep:{' '}
              </Text>
              {item.rejectionReason}
            </Text>
          )}

          {item.status === 'approved' && (
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
