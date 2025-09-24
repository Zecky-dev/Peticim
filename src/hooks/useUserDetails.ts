import { useEffect, useState } from 'react';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';
import { useLoading } from '@context/LoadingContext';
import { getImages } from '@api/image';
import { useAuth } from '@context/AuthContext';

export function useUserDetails(userId: string | null) {
  const { showLoading, hideLoading } = useLoading();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId) {
      setUserDetails(null);
      return;
    }
    const userRef = doc(db, 'Users', userId);
    showLoading();

    const unsubscribe = onSnapshot(
      userRef,
      async snap => {
        if (snap.exists()) {
          const userData = snap.data();
          if (userData && user) {
            const profilePictureRes = await getImages(
              [userData.profilePicture.publicId],
            );
            const profilePictureURL = Object.entries(
              profilePictureRes.urls,
            ).find(([key]) => key.startsWith('profile_images/'))?.[1];
            setUserDetails({
              ...snap.data(),
              profilePictureURL,
            } as User);
          }
        } else {
          setUserDetails(null);
        }
        hideLoading();
      },
      err => {
        console.error('useUserDetails error:', err);
        hideLoading();
      },
    );
    return () => {
      unsubscribe();
      hideLoading();
    };
  }, [userId]);

  return { userDetails };
}
