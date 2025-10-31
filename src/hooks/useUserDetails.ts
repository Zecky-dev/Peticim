import { useEffect, useState } from 'react';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';
import { useLoading } from '@context/LoadingContext';
import { useAuth } from '@context/AuthContext';
import { User } from 'types/global';

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
            const ud = {
              id: userId,
              ...snap.data(),
            };
            setUserDetails(ud);
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
