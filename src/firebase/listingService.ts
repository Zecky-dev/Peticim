import { db } from './firebase';
import * as Sentry from '@sentry/react-native';
import {
  serverTimestamp,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
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
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { uploadImages, deleteImages } from '@api/image';
import { showToast } from '@config/toastConfig';
import { Filter } from 'types/global';
import * as geofire from 'geofire-common';

const listingsCollection = collection(db, 'Listings');

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

// ============================
// CREATE LISTING
// ============================
export const createListing = async (
  listingData: any,
  images: any[],
  userId: string,
) => {
  if (!listingData || images.length === 0 || !userId) return false;

  try {
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
    Sentry.withScope(scope => {
      scope.setTag('function', 'createListing');
      scope.setExtra('userId', userId);
      scope.setExtra('listingData', listingData);
      Sentry.captureException(error);
    });
    console.error('CREATE_LISTING_ERROR', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'İlan oluşturulurken bir sorun oluştu.',
    });
    return false;
  }
};

// ============================
// GET LISTINGS
// ============================
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
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));

    const snapshot = await getDocs(q);
    if (snapshot.empty) return { listings: [], lastDoc: null };

    const listings = snapshot.docs.map(
      (doc: FirebaseFirestoreTypes.DocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      }),
    );
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return { listings, lastDoc };
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'getListings');
      scope.setExtra('filters', filters);
      Sentry.captureException(error);
    });
    console.error('GET_LISTINGS_ERROR', error);
    return { listings: [], lastDoc: null };
  }
};

// ============================
// TOGGLE FAVORITE
// ============================
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

    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    const favorites = userData?.favorites || [];

    if (favorites.includes(listingId)) {
      await updateDoc(userRef, { favorites: arrayRemove(listingId) });
    } else {
      await updateDoc(userRef, { favorites: arrayUnion(listingId) });
    }
    return true;
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'toggleFavorite');
      scope.setExtra('listingId', listingId);
      scope.setExtra('userId', userId);
      Sentry.captureException(error);
    });
    console.error('TOGGLE_FAVORITE_ERROR', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'Favori durumu güncellenirken bir sorun oluştu.',
    });
    return false;
  }
};

// ============================
// GET LISTINGS BY IDS
// ============================
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
      allListings.push(
        ...documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      );
    }

    return allListings.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
    );
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'getListingsByIds');
      scope.setExtra('listingIds', listingIds);
      Sentry.captureException(error);
    });
    console.error('GET_LISTINGS_BY_IDS_ERROR', error);
    return [];
  }
};

// ============================
// GET NEARBY LISTINGS
// ============================
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
    const promises = bounds
      .map(b =>
        query(
          listingsCollection,
          orderBy('geohash'),
          startAt(b[0]),
          endAt(b[1]),
        ),
      )
      .map(getDocs);

    const snapshots = await Promise.all(promises);
    const matchingDocs: any[] = [];

    snapshots.forEach(snap => {
      snap.docs.forEach(doc => {
        const lat = doc.get('address.latitude');
        const lng = doc.get('address.longitude');
        const distanceInKm = geofire.distanceBetween(
          [lat, lng],
          [center.latitude, center.longitude],
        );
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM && doc.get('status') === 'approved') {
          matchingDocs.push({ id: doc.id, ...doc.data() });
        }
      });
    });

    return matchingDocs;
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'getNearbyListings');
      scope.setExtra('center', center);
      scope.setExtra('radius', radius);
      Sentry.captureException(error);
    });
    console.error('GET_NEARBY_LISTINGS_ERROR', error);
    return [];
  }
};

// ============================
// DELETE LISTING
// ============================
export const deleteListing = async (listingId?: string, userId?: string) => {
  if (!listingId || !userId) return;

  try {
    const docRef = doc(db, 'Listings', listingId);
    await deleteImages(userId, listingId);
    await deleteDoc(docRef);
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'deleteListing');
      scope.setExtra('listingId', listingId);
      scope.setExtra('userId', userId);
      Sentry.captureException(error);
    });
    console.error('DELETE_LISTING_ERROR', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'İlan silinirken bir sorun oluştu.',
    });
  }
};

// ============================
// REPORT LISTING
// ============================
export const reportListing = async (
  report: { selectedReason: string; reasonText: string },
  listingId?: string,
  userId?: string,
) => {
  if (!report || !listingId || !userId) return;

  try {
    const listingReportDocRef = doc(db, 'ListingReports', listingId);
    const reportsCollectionRef = collection(listingReportDocRef, 'reports');
    const reportId = `${userId}_${listingId}`;
    const userReportDocRef = doc(reportsCollectionRef, reportId);
    const userReportDoc = await getDoc(userReportDocRef);
    if (userReportDoc.exists()) {
      showToast({
        type: 'info',
        text1: 'Bilgilendirme',
        text2: 'Bu ilanı daha önce raporladınız, raporunuz inceleniyor..',
        duration: 'medium',
      });
      return;
    }
    await setDoc(
      listingReportDocRef,
      { createdAt: serverTimestamp() },
      { merge: true },
    );
    await setDoc(userReportDocRef, {
      userId,
      selectedReason: report.selectedReason || 'Neden belirtilmemiş',
      reasonText: report.reasonText || '',
      createdAt: serverTimestamp(),
    });
    showToast({
      type: 'success',
      text1: 'Başarılı',
      text2: 'Raporunuz başarıyla iletildi, en yakın sürede incelenecektir.',
      duration: 'medium',
    });
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'reportListing');
      scope.setExtra('listingId', listingId);
      scope.setExtra('userId', userId);
      scope.setExtra('report', report);
      Sentry.captureException(error);
    });
    console.error('REPORT_LISTING_ERROR', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: 'Rapor gönderilirken bir hata meydana geldi, tekrar deneyiniz.',
      duration: 'medium',
    });
  }
};
