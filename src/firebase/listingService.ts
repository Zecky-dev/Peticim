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
} from '@react-native-firebase/firestore';
import { uploadImages, deleteImages } from '@api/image';
import { showToast } from '@config/toastConfig';

const listingsCollection = collection(db, 'Listings');
let lastVisible: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null;

const applyFilters = (q: any, filters?: Filter[]) => {
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
  token?: string | null,
) => {
  if (!listingData || images.length === 0 || !userId || !token) return;
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
      token,
    );
    return true;
  } catch (error: any) {
    console.error('CREATE_LISTING_ERROR', error);
    return false;
  }
};

export const getFirstListings = async (filters: Filter[] = []) => {
  try {
    let q = query(
      listingsCollection,
      orderBy('createdAt', 'desc'),
      limit(10),
    );
    q = applyFilters(q, filters)
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

export const getNextListings = async (filters: Filter[] = []) => {
  if (!lastVisible) return [];
  try {
    let q = query(
      listingsCollection,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(10),
    );
    q = applyFilters(q, filters);
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
    console.error('GET_NEXT_LISTING_ERROR', error);
    return [];
  }
};

export const deleteListing = async (
  listingId: string,
  userId?: string,
  token?: string | null,
) => {
  if (!listingId || !userId || !token) return;
  try {
    const docRef = doc(db, 'Listings', listingId);
    await deleteDoc(docRef);
    await deleteImages(userId, listingId, token);
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

export const resetPagination = () => {
  lastVisible = null;
};
