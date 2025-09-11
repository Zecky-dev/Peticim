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
} from '@react-native-firebase/firestore';
import { uploadImages } from '@api/image';
import { showToast } from '@config/toastConfig';

const listingsCollection = collection(db, 'Listings');
let lastVisible: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null;

export const createListing = async (
  listingData: any,
  images: any[],
  userId: string,
) => {
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
    showToast({
      type: 'success',
      text1: 'Başarılı!',
      text2: 'İlanın başarıyla oluşturuldu!',
    });
    return { success: true, id: listingId };
  } catch (err: any) {
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'İlan oluşturulurken bir hata meydana geldi',
    });
    return { success: false, error: err.message };
  }
};

export const getFirstListings = async () => {
  try {
    const q = query(
      listingsCollection,
      orderBy('createdAt', 'desc'),
      limit(10),
    );
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
    console.error('Error fetching first listings: ', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'İlanlar yüklenirken bir hata oluştu.',
    });
    return [];
  }
};

export const getNextListings = async () => {
  if (!lastVisible) {
    console.log('No more documents to load.');
    return [];
  }

  try {
    const q = query(
      listingsCollection,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(10),
    );
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
    console.error('Error fetching next listings: ', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'İlanlar yüklenirken bir hata oluştu.',
    });
    return [];
  }
};

export const resetPagination = () => {
  lastVisible = null;
};
