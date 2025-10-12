import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';
import { useCallback, useEffect, useState, useRef } from 'react';
import { getListings, getListingsByIds } from '@firebase/listingService';
import { ListingItem, Filter } from 'types/global';

export function useListings(showFavorites = false) {
  const { userDetails } = useAuth();
  const { showLoading, hideLoading, isLoading } = useLoading();

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [favoriteListings, setFavoriteListings] = useState<ListingItem[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  
  const prevFiltersRef = useRef<Filter[]>([]);

  useEffect(() => {
    const getFavoriteListings = async () => {
      if (userDetails?.favorites?.length) {
        const favoriteListingsRes = await getListingsByIds(
          userDetails.favorites,
        );
        setFavoriteListings(favoriteListingsRes);
      } else {
        setFavoriteListings([]);
      }
    };
    getFavoriteListings();
  }, [userDetails?.favorites]);

  // 🔹 İlk sayfayı yükle
  const loadInitialListings = useCallback(
    async (newFilters: Filter[] = [], onlyApproved = true, force = false) => {
      const sameFilters =
        JSON.stringify(prevFiltersRef.current) === JSON.stringify(newFilters);
      if (!force && hasLoadedOnce && sameFilters) return;

      prevFiltersRef.current = newFilters;
      showLoading();
      setLastDoc(null);

      try {
        const { listings: initialListings, lastDoc: newLastDoc } = await getListings(
          newFilters,
          onlyApproved,
          null,
        );

        setListings(initialListings);
        setLastDoc(newLastDoc);
      } finally {
        hideLoading();
        setHasLoadedOnce(true);
      }
    },
    [hasLoadedOnce],
  );

  // 🔹 Sonraki sayfayı getir
  const loadMoreListings = useCallback(async () => {
    if (isLoading || !lastDoc) return;
    showLoading();
    try {
      const { listings: nextListings, lastDoc: newLastDoc } = await getListings(
        prevFiltersRef.current,
        true,
        lastDoc,
      );

      if (nextListings.length > 0) {
        setListings(prev => {
          const ids = new Set(prev.map(l => l.id));
          const filteredNext = nextListings.filter(l => !ids.has(l.id));
          return [...prev, ...filteredNext];
        });
        setLastDoc(newLastDoc);
      } else {
        setLastDoc(null);
      }
    } finally {
      hideLoading();
    }
  }, [isLoading, lastDoc]);

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
