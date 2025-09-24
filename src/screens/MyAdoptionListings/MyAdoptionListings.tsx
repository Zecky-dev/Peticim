import { useAuth } from '@context/AuthContext';
import { useListings } from '@hooks/useListings';
import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import ListItem from './components/ListingItem';
import { EmptyList } from '@components';

import LottieView from 'lottie-react-native';
import styles from './MyAdoptionListings.style';
import colors from '@utils/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyAdoptionListings = () => {
  const { user } = useAuth();
  const { listings, loadInitialListings, setListings, hasLoadedOnce } =
    useListings();
  const userListings = listings.filter((item: any) => !item.isAd);
  useEffect(() => {
    loadInitialListings([
      { field: 'userId', operator: '==', value: user?.uid },
    ], false);
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <FlatList
        contentContainerStyle={[
          userListings.length === 0
            ? styles.emptyListingContainer
            : styles.listingsContainer,
        ]}
        showsVerticalScrollIndicator={false}
        data={userListings}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onDeleted={(deletedId: string) => {
              setListings((prev: any[]) =>
                prev.filter(l => l.id !== deletedId),
              );
            }}
          />
        )}
        ListEmptyComponent={() => {
          if (!hasLoadedOnce) {
            return <ActivityIndicator size={'large'} color={colors.primary} />;
          }
          return (
            <EmptyList
              image={
                <LottieView
                  autoPlay={true}
                  loop={true}
                  source={require('@assets/lottie/notFound.json')}
                  style={styles.notFoundAnimation}
                />
              }
              label="İlan Bulunamadı"
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default MyAdoptionListings;
