import { useAuth } from '@context/AuthContext';
import { useListings } from '@hooks/useListings';
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import ListItem from './components/ListingItem';
import { EmptyList } from '@components';
import LottieView from 'lottie-react-native';
import styles from './MyAdoptionListings.style';
import colors from '@utils/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const MyAdoptionListings = () => {
  const { user } = useAuth();
  const { listings, loadInitialListings, setListings, hasLoadedOnce } =
    useListings();
  const [refreshing, setRefreshing] = useState(false);

  // Sayfa focus olduğunda veriyi yenile
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        loadInitialListings(
          [{ field: 'userId', operator: '==', value: user?.uid }],
          false,
        );
      }
    }, [user?.uid]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialListings(
      [{ field: 'userId', operator: '==', value: user?.uid }],
      false,
      true
    );
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <FlatList
        contentContainerStyle={[
          listings.length === 0
            ? styles.emptyListingContainer
            : styles.listingsContainer,
        ]}
        showsVerticalScrollIndicator={false}
        data={listings}
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
                  autoPlay
                  loop
                  source={require('@assets/lottie/notFound.json')}
                  style={styles.notFoundAnimation}
                />
              }
              label="İlan Bulunamadı"
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default MyAdoptionListings;
