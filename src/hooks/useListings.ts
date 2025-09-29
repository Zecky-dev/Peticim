import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';
import { useCallback, useEffect, useState } from 'react';
import {
  getFirstListings,
  getNextListings,
  resetPagination,
  getListingsByIds,
} from '@firebase/listingService';
import { useUserDetails } from './useUserDetails';
import { ListingItem, Filter } from 'types/global';

export function useListings(
  filters: Filter[] = [],
  showFavorites: boolean = false,
) {
  const { user } = useAuth();
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
        setFavoriteListings(favoriteListingsRes);
      }
    };
    getFavoriteListings();
  }, [userDetails?.favorites]);

  const loadInitialListings = useCallback(
    async (filters: Filter[] = [], onlyApproved: boolean = true) => {
      showLoading();
      resetPagination();
      try {
        const initialListings = await getFirstListings(filters, onlyApproved);
        setListings(initialListings);
        setHasMore(initialListings.length >= 10);
      } finally {
        hideLoading();
        setHasLoadedOnce(true);
      }
    },
    [filters],
  );

  const loadMoreListings = useCallback(async () => {
    if (isLoading || !hasMore) return;
    showLoading();
    const nextListings = await getNextListings(filters);
    setListings(prev => [...prev, ...nextListings]);
    if (nextListings.length === 0 || nextListings.length < 10)
      setHasMore(false);
    hideLoading();
  }, [isLoading, hasMore, filters]);

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
