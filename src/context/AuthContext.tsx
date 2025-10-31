import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import { auth, db } from '@firebase/firebase';
import { doc, getDoc, onSnapshot } from '@react-native-firebase/firestore';
import { useLoading } from './LoadingContext';
import { User } from 'types/global';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  googleSignIn,
  resetPassword,
  signInUser,
  signUpUser,
} from '@firebase/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userDetails: User | null;
  refreshUserDetails: () => void;
  requiresPrivacyPolicyAcceptance: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, otherData: any) => Promise<void>;
  logout: () => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [requiresPrivacyPolicyAcceptance, setRequiresPrivacyPolicyAcceptance] =
    useState(false);
  const { showLoading, hideLoading } = useLoading();

  // 🔹 Auth değişimlerini dinle
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, u => {
      if (u && u.emailVerified) {
        setUser(u);
      } else {
        setUser(null);
        setUserDetails(null);
        setRequiresPrivacyPolicyAcceptance(false);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  // 🔹 Firestore’daki kullanıcı detaylarını realtime olarak dinle
  useEffect(() => {
    refreshUserDetails();
  }, [user?.uid]);

  // 🔹 Auth işlemleri
  const login = async (email: string, password: string) => {
    try {
      showLoading();
      await signInUser(email.toLowerCase(), password);
    } finally {
      hideLoading();
    }
  };

  const register = async (email: string, password: string, otherData: any) => {
    try {
      showLoading();
      await signUpUser(email, password, otherData);
      await logout();
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    try {
      showLoading();
      try {
        await GoogleSignin.signOut();
      } catch (_) {}
      await signOut(auth);
      setUser(null);
      setUserDetails(null);
    } finally {
      hideLoading();
    }
  };

  const passwordReset = async (email: string) => {
    try {
      showLoading();
      await resetPassword(email);
    } finally {
      hideLoading();
    }
  };

  const googleLogin = async () => {
    try {
      showLoading();
      await googleSignIn();
      
      const loggedInUser = auth.currentUser; // Anlık oturum açmış kullanıcıyı al
      
      // 🚨 Anlık UID'yi fonksiyona parametre olarak gönderin
      if (loggedInUser) {
        await refreshUserDetails(loggedInUser.uid); 
      }
    } catch (error) {
      console.error('GOOGLE_LOGIN_ERROR:', error);
    } finally {
      hideLoading();
    }
  };

  const refreshUserDetails = async (uidToRefresh?: string) => {
    const currentUid = uidToRefresh || user?.uid;
    if (!currentUid) return;
    try {
      const userRef = doc(db, 'Users', currentUid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as User;
        setUserDetails({ ...data, id: snap.id });
        setRequiresPrivacyPolicyAcceptance(data.privacyPolicyAccepted !== true);
      } else if (!uidToRefresh) {
        console.warn(`User document not found for UID: ${currentUid}`);
      }
    } catch (error) {
      console.error('Refresh user details error:', error);
      setUserDetails(null);
      setRequiresPrivacyPolicyAcceptance(false);
    }
  };

  const value: AuthContextType = {
    user,
    userDetails,
    refreshUserDetails,
    initializing,
    login,
    register,
    logout,
    passwordReset,
    googleLogin,
    requiresPrivacyPolicyAcceptance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;
