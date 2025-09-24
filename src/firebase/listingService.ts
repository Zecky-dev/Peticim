import { db } from './firebase';
import {
  serverTimestamp,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  FirebaseFirestoreTypes,
  startAfter,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  where,
  documentId,
  startAt,
  endAt,
} from '@react-native-firebase/firestore';
import { uploadImages, deleteImages } from '@api/image';
import { showToast } from '@config/toastConfig';
import * as geofire from 'geofire-common';

const listingsCollection = collection(db, 'Listings');
let lastVisible: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null;

const applyFilters = (q: any, filters?: Filter[], onlyApproved: boolean = true) => {
  if (onlyApproved) {
    q = query(q, where('isApproved', '==', true));
  }

  if (!filters) return q;
  filters.forEach(filter => {
    q = query(q, where(filter.field, filter.operator, filter.value));
  });
  return q;
};

export const createListing = async (
  listingData: any,
  images: any[],
  userId: string,
) => {
  if (!listingData || images.length === 0 || !userId) return;
  try {
    const listingsCollection = collection(db, 'Listings');
    const docRef = doc(listingsCollection);
    await setDoc(docRef, {
      ...listingData,
      userId,
      createdAt: serverTimestamp(),
    });
    const listingId = docRef.id;
    await uploadImages(
      images,
      `Listings/${userId}/${listingId}`,
      userId,
      listingId,
    );
    return true;
  } catch (error: any) {
    console.error('CREATE_LISTING_ERROR', error);
    return false;
  }
};

export const getFirstListings = async (filters: Filter[] = [],onlyApproved: boolean = true) => {
  try {
    let q = query(listingsCollection, orderBy('createdAt', 'desc'), limit(10));
    q = applyFilters(q, filters, onlyApproved);
    const documentSnapshots = await getDocs(q);
    if (documentSnapshots.empty) {
      lastVisible = null;
      return [];
    }
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    const listings = documentSnapshots.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      }),
    );
    return listings;
  } catch (error) {
    console.error('GET_FIRST_LISTINGS_ERROR', error);
    return [];
  }
};

export const getNextListings = async (filters: Filter[] = [], onlyApproved: boolean = true) => {
  if (!lastVisible) return [];
  try {
    let q = query(listingsCollection, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(10));
    q = applyFilters(q, filters, onlyApproved);

    const documentSnapshots = await getDocs(q);
    if (documentSnapshots.empty) {
      lastVisible = null;
      return [];
    }
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    return documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('GET_NEXT_LISTING_ERROR', error);
    return [];
  }
};

export const deleteListing = async (listingId: string, userId?: string) => {
  if (!listingId || !userId) return;
  try {
    const docRef = doc(db, 'Listings', listingId);
    await deleteImages(userId, listingId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('DELETE_LISTING_ERROR', error);
  }
};

export const toggleFavorite = async (listingId?: string, userId?: string) => {
  if (!listingId || !userId) {
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'Geçersiz parametreler.',
    });
    return false;
  }

  try {
    const userRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favorites = userData?.favorites || [];
      if (favorites.includes(listingId)) {
        await updateDoc(userRef, {
          favorites: arrayRemove(listingId),
        });
        return true;
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(listingId),
        });
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error('TOGGLE_FAVORITE_ERROR', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'Favori durumu güncellenirken bir sorun oluştu.',
    });
    return false;
  }
};

export const getListingsByIds = async (listingIds: string[]) => {
  if (!listingIds || listingIds.length === 0) {
    return [];
  }
  try {
    const q = query(listingsCollection, where(documentId(), 'in', listingIds));
    const documentSnapshots = await getDocs(q);

    if (documentSnapshots.empty) {
      return [];
    }
    const listings = documentSnapshots.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      }),
    );
    return listings;
  } catch (error) {
    console.error('GET_LISTINGS_BY_IDS_ERROR', error);
    return [];
  }
};

// Yakındaki ilanları almak için..
export const getNearbyListings = async (
  center: { latitude: number; longitude: number },
  radius: number,
) => {
  try {
    const radiusInM = radius * 1000;
    const bounds = geofire.geohashQueryBounds(
      [center.latitude, center.longitude],
      radiusInM,
    );
    const promises = [];
    for (const b of bounds) {
      const q = query(
        listingsCollection,
        orderBy('geohash'),
        startAt(b[0]),
        endAt(b[1]),
      );
      promises.push(getDocs(q));
    }

    const snapshots = await Promise.all(promises);
    const matchingDocs = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('address.latitude');
        const lng = doc.get('address.longitude');

        const distanceInKm = geofire.distanceBetween(
          [lat, lng],
          [center.latitude, center.longitude],
        );
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push({
            id: doc.id,
            ...doc.data()[0],
          });
        }
      }
    }
    return matchingDocs;
  } catch (error) {
    console.error('GET_NEARBY_LISTINGS_ERROR', error);
    return [];
  }
};

export const resetPagination = () => {
  lastVisible = null;
};
