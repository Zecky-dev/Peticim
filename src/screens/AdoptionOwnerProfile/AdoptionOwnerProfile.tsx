import React, { useEffect, useState } from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import styles from './AdoptionOwnerProfile.style';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getListingsByUserId } from '@firebase/listingService';
import { useLoading } from '@context/LoadingContext';
import { CircleButton, EmptyList, ListingItem } from '@components';
import LottieView from 'lottie-react-native';
import { ListingItem as ListingItemType } from 'types/global';
import { useAuth } from '@context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AdoptionOwnerProfile = () => {
  const route =
    useRoute<RouteProp<AdoptionStackParamList, 'AdoptionOwnerProfile'>>();
  const { ownerData } = route.params;
  const { showLoading, hideLoading } = useLoading();
  const { userDetails } = useAuth();
  const insets = useSafeAreaInsets();
  const [userListings, setUserListings] = useState<ListingItemType[]>([]);

  const getListingsOfUser = async () => {
    showLoading();
    if (ownerData?.id) {
      const listingsOfUser = await getListingsByUserId(ownerData.id);
      setUserListings(listingsOfUser);
    }
    hideLoading();
    return [];
  };

  useEffect(() => {
    getListingsOfUser();
  }, [ownerData]);

  if (ownerData) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.backButtonContainer,
            { top: insets.top, left: insets.left + 16 },
          ]}
        >
          <CircleButton iconSize={32} backgroundColor='white' />
        </View>
        <View style={styles.topContainer}>
          <Image
            source={
              ownerData.profilePicture?.url
                ? { uri: ownerData.profilePicture.url }
                : require('@assets/images/avatar_default.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.nameSurname}>
            {ownerData.name} {ownerData.surname}
          </Text>
        </View>
        {ownerData.bio && <Text style={styles.bioText}>{ownerData.bio}</Text>}
        {userListings && userListings.length > 0 && (
          <Text style={styles.listingLength}>{userListings.length} ilan</Text>
        )}
        <FlatList
          style={{ paddingTop: 12 }}
          data={userListings}
          renderItem={({ item }) => (
            <ListingItem
              data={item}
              favorited={userDetails?.favorites?.includes(item.id) || false}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyList
              label="İlanı bulunmuyor"
              image={
                <LottieView
                  autoPlay
                  loop
                  source={require('@assets/lottie/notFound.json')}
                  style={styles.notFoundAnimation}
                />
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
    );
  }
};

export default AdoptionOwnerProfile;
