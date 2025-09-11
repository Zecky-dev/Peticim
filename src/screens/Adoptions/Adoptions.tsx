import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Adoptions.style';

import {
  getFirstListings,
  getNextListings,
  resetPagination,
} from '@firebase/listingService';
import { getImages } from '@api/image';
import { useAuth } from '@context/AuthContext';
import { ListingItem } from '@components';
import { useLoading } from '@context/LoadingContext';
import colors from '@utils/colors';

const Adoptions = () => {
  const [photoMap, setPhotoMap] = useState<Record<string, string[]>>({});
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { token } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const loadInitialData = async (refreshing: boolean = false) => {
    showLoading();
    resetPagination();
    const initialListings = await getFirstListings();
    setListings(initialListings);
    await fetchPhotoUrls(initialListings);
    if (refreshing) setIsRefreshing(false);
    if (initialListings.length < 10) {
      setHasMore(false);
    }
    hideLoading();
  };

  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    showLoading();
    const nextListings = await getNextListings();
    setListings(prevListings => [...prevListings, ...nextListings]);
    await fetchPhotoUrls(nextListings);
    hideLoading();
    if (nextListings.length === 0 || nextListings.length < 10) {
      setHasMore(false);
    }
  };

  const fetchPhotoUrls = async (items: ListingItem[]) => {
    if (!items.length && !token) return;
    const publicIds = items
      .flatMap(item => item.images)
      .map(image => image.publicId);
    try {
      const res = await getImages(publicIds, token);
      if (res.success) {
        const newPhotoMap: Record<string, string[]> = {};
        items.forEach(item => {
          newPhotoMap[item.id] = item.images.map(
            image => res.urls[image.publicId],
          );
        });
        setPhotoMap(prev => ({ ...prev, ...newPhotoMap }));
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  useEffect(() => {
    if(!token) return;
    loadInitialData();
  }, [token]);


  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        data={listings}
        renderItem={({ item }) => {
          if (photoMap[item.id]) {
            return <ListingItem data={item} photoURLs={photoMap[item.id]} />;
          }
          return null;
        }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={isRefreshing}
        onRefresh={() => {
          resetPagination();
          loadInitialData(isRefreshing);
        }}
      />
    </SafeAreaView>
  );
};

export default Adoptions;
