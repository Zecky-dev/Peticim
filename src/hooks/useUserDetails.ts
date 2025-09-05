import { useEffect, useState } from 'react';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';
import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';

export function useUserDetails() {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) {
      setUserDetails(null);
      return;
    }
    const userRef = doc(db, 'Users', user.uid);
    showLoading();
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setUserDetails(snap.data());
        } else {
          setUserDetails(null);
        }
        hideLoading();
      },
      (err) => {
        console.error("useUserDetails error:", err);
        hideLoading();
      }
    );

    return () => {
      unsubscribe();
      hideLoading();
    };
  }, [user?.uid]);

  return { userDetails };
}
