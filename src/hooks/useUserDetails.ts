import { useEffect, useState } from 'react';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';
import { useLoading } from '@context/LoadingContext';

export function useUserDetails(userId: string | null) {
  const { showLoading, hideLoading } = useLoading();
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserDetails(null);
      return;
    }

    const userRef = doc(db, 'Users', userId);
    showLoading();

    const unsubscribe = onSnapshot(
      userRef,
      snap => {
        if (snap.exists()) {
          setUserDetails(snap.data() as User);
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
      // Yükleme durumu temizleniyor
      hideLoading();
    };
  }, [userId]); // Bağımlılık dizisini user?.uid yerine userId olarak değiştiriyoruz

  return { userDetails };
}
