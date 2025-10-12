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
  addDoc,
} from '@react-native-firebase/firestore';
import { uploadImages, deleteImages } from '@api/image';
import { showToast } from '@config/toastConfig';
import * as geofire from 'geofire-common';
import { Filter } from 'types/global';

const listingsCollection = collection(db, 'Listings');
let lastVisible: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null;

// 🔹 Filtre uygulama yardımcı fonksiyonu
const applyFilters = (
  q: any,
  filters?: Filter[],
  onlyApproved: boolean = true,
) => {
  if (onlyApproved) {
    q = query(q, where('status', '==', 'approved'));
  }

  if (!filters) return q;
  filters.forEach(filter => {
    q = query(q, where(filter.field, filter.operator, filter.value));
  });
  return q;
};

// 🔹 İlan oluşturma
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

// 🔹 Tek fonksiyonla sayfalama yönetimi
export const getListings = async (
  filters: Filter[] = [],
  onlyApproved: boolean = true,
  startAfterDoc: any = null,
  pageSize: number = 10,
) => {
  try {
    let q = query(
      listingsCollection,
      orderBy('createdAt', 'desc'),
      limit(pageSize),
    );
    q = applyFilters(q, filters, onlyApproved);
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { listings: [], lastDoc: null };
    }
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return { listings, lastDoc };
  } catch (error) {
    console.error('GET_LISTINGS_ERROR', error);
    return { listings: [], lastDoc: null };
  }
};

// 🔹 Favori ekleme / çıkarma
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
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(listingId),
        });
      }
      return true;
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

// 🔹 Belirli ilanları ID ile getir
export const getListingsByIds = async (listingIds: string[]) => {
  if (!listingIds || listingIds.length === 0) return [];

  try {
    const chunks: string[][] = [];
    for (let i = 0; i < listingIds.length; i += 10) {
      chunks.push(listingIds.slice(i, i + 10));
    }

    const allListings: any[] = [];

    for (const chunk of chunks) {
      const q = query(
        listingsCollection,
        where(documentId(), 'in', chunk),
        where('status', '==', 'approved'),
      );

      const documentSnapshots = await getDocs(q);
      const listings = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      allListings.push(...listings);
    }

    return allListings.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
    );
  } catch (error) {
    console.error('GET_LISTINGS_BY_IDS_ERROR', error);
    return [];
  }
};

// 🔹 Yakındaki ilanları getir
export const getNearbyListings = async (
  center: { latitude: number; longitude: number },
  radius: number,
  onlyApproved: boolean = true,
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
        const approveStatus = doc.get('status');
        if (distanceInM <= radiusInM) {
          if (approveStatus !== 'approved') continue;
          matchingDocs.push({
            id: doc.id,
            ...doc.data(),
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

export const deleteListing = async (listingId?: string, userId?: string) => {
  if (!listingId || !userId) return;
  try {
    const docRef = doc(db, 'Listings', listingId);
    await deleteImages(userId, listingId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('DELETE_LISTING_ERROR', error);
  }
};

export const reportListing = async (
  report: { selectedReason: string; reasonText: string },
  listingId?: string,
  userId?: string,
) => {
  if (!report || !listingId || !userId) return;

  try {
    const listingReportDocRef = doc(db, 'ListingReports', listingId);
    await setDoc(
      listingReportDocRef,
      {
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
    const reportsCollectionRef = collection(listingReportDocRef, 'reports');
    await addDoc(reportsCollectionRef, {
      userId: userId,
      selectedReason: report.selectedReason || 'Neden belirtilmemiş',
      reasonText: report.reasonText || '',
      createdAt: serverTimestamp(),
    });
    showToast({
      type: 'success',
      text1: 'Başarılı',
      text2: 'Raporunuz başarıyla iletildi, en yakın sürede incelenecektir.',
      duration: 'medium',
    })
    console.log('Rapor başarıyla gönderildi!');
  } catch (error) {
    console.error('Rapor gönderilirken hata oluştu:', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'Rapor gönderilirken bir hata meydana geldi, tekrar deneyiniz.',
      duration: 'medium',
    })
  }
};

// 🔹 Sayfalama resetleme
export const resetPagination = () => {
  lastVisible = null;
};
