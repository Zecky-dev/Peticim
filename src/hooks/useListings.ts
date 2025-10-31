import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';
import { useCallback, useEffect, useState, useRef } from 'react';
import { getListings, getListingsByIds } from '@firebase/listingService';
import { isEqual } from '@utils/basicValidations';
import { ListingItem, Filter } from 'types/global';

export function useListings(showFavorites = false) {
  const { userDetails } = useAuth();
  const { showLoading, hideLoading, isLoading } = useLoading();

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const prevFiltersRef = useRef<Filter[]>([]);

  // Favorite listings
  const [favoriteListings, setFavoriteListings] = useState<ListingItem[]>([]);
  const prevFavoriteIdsRef = useRef<string[]>([]);
  useEffect(() => {
    const currentFavoriteIds = userDetails?.favorites || [];
    if (isEqual(prevFavoriteIdsRef.current, currentFavoriteIds)) return;
    prevFavoriteIdsRef.current = currentFavoriteIds;
    const getFavoriteListings = async () => {
      if (currentFavoriteIds.length) {
        const favoriteListingsRes = await getListingsByIds(currentFavoriteIds);
        setFavoriteListings(favoriteListingsRes);
      } else {
        setFavoriteListings([]);
      }
    };
    getFavoriteListings();
  }, [userDetails?.favorites]);

  // Önbellekleme yaparak listing'leri çeken sorgu
  const listingsCache = useRef(new Map());
  const lastFetchTime = useRef(0);
  const CACHE_DURATION = 15;
  const loadInitialListings = useCallback(
    async (newFilters: Filter[] = [], onlyApproved = true, force = false) => {
      const cacheKey = JSON.stringify({ filters: newFilters, onlyApproved });
      const now = Date.now();
      // Önbellek süresi bitmemişse ve daha önce ön belleğe alınmışsa
      if (
        !force &&
        listingsCache.current.has(cacheKey) &&
        now - lastFetchTime.current < CACHE_DURATION
      ) {
        const cached = listingsCache.current.get(cacheKey);
        setLastDoc(cached.lastDoc);
        hideLoading();
        return;
      }

      prevFiltersRef.current = newFilters;
      showLoading();
      setLastDoc(null);

      try {
        const { listings: initialListings, lastDoc: newLastDoc } =
          await getListings(newFilters, onlyApproved, null);

        // Önbelleğe kaydet
        listingsCache.current.set(cacheKey, {
          listings: initialListings,
          lastDoc: newLastDoc,
        });
        lastFetchTime.current = now;

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
