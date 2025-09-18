import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';
import { useCallback, useEffect, useState } from 'react';
import {
  getFirstListings,
  getNextListings,
  resetPagination,
  getListingsByIds,
} from '@firebase/listingService';
import { getImages } from '@api/image';
import { useUserDetails } from './useUserDetails';

export function useListings(
  filters: Filter[] = [],
  showFavorites: boolean = false,
) {
  const { user, token } = useAuth();
  const { showLoading, hideLoading, isLoading } = useLoading();
  const { userDetails } = useUserDetails(user?.uid || null);

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [favoriteListings, setFavoriteListings] = useState<ListingItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    const getFavoriteListings = async () => {
      if (userDetails?.favorites) {
        const favoriteListingsRes = await getListingsByIds(
          userDetails?.favorites,
        );
        const favoriteListingsWithPhotos = await enrichListingsWithPhotos(
          favoriteListingsRes,
        );
        setFavoriteListings(favoriteListingsWithPhotos);
      }
    };
    getFavoriteListings();
  }, [userDetails?.favorites]);

  const enrichListingsWithPhotos = async (items: ListingItem[]) => {
    if (!items.length || !token) return items;
    const newItems = [];
    for (let item of items) {
      const publicIds = item.images.map(image => image.publicId);
      const itemPhotosRes = await getImages(publicIds, token);
      const photos = Object.values(itemPhotosRes.urls) as string[];
      item.photoURLs = photos;
      newItems.push(item);
    }
    return newItems;
  };

  const injectAds = (data: any[]) => {
    const AD_FREQUENCY = 2;
    const newData: any[] = [];
    data.forEach((item, index) => {
      newData.push(item);
      if ((index + 1) % AD_FREQUENCY === 0) {
        newData.push({
          id: `ad-${index}-${Math.random()}`,
          isAd: true,
        });
      }
    });
    return newData;
  };

  const loadInitialListings = useCallback(
    async (filters: Filter[] = []) => {
      if (!token) return;
      showLoading();
      resetPagination();
      try {
        const initialListings = await getFirstListings(filters);
        const listingsWithPhotos = await enrichListingsWithPhotos(
          initialListings,
        );
        const listingsWithAds = injectAds(listingsWithPhotos);
        setListings(listingsWithAds);
        setHasMore(initialListings.length >= 10);
      } finally {
        hideLoading();
        setHasLoadedOnce(true);
      }
    },
    [token, filters],
  );

  const loadMoreListings = useCallback(async () => {
    if (!token || isLoading || !hasMore) return;
    showLoading();
    const nextListings = await getNextListings(filters);
    const listingsWithPhotos = await enrichListingsWithPhotos(nextListings);
    const listingsWithAds = injectAds(listingsWithPhotos);
    setListings(prev => [...prev, ...listingsWithAds]);
    if (nextListings.length === 0 || nextListings.length < 10)
      setHasMore(false);
    hideLoading();
  }, [token, isLoading, hasMore, filters]);

  return {
    listings: showFavorites ? favoriteListings : listings,
    setListings,
    loadInitialListings,
    loadMoreListings,
    favoriteListings,
    hasLoadedOnce,
    isLoading,
  };
}
