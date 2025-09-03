import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseAuthTypes, getAuth, updateProfile } from '@react-native-firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '@react-native-firebase/auth';
import { generateErrorMessage } from '@firebase/helpers/generateErrorMessage';
import { sendVerificationEmail, sendPasswordResetEmail } from '@api/auth';
import { useLoading } from './LoadingContext';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { db } from '@firebase/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, otherData: any) => Promise<void>;
  logout: () => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  function onAuthStateChangedCallback(user: FirebaseAuthTypes.User | null) {
    if (user && !user.emailVerified) {
      setUser(null);
      logout();
    } else {
      setUser(user);
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(
      getAuth(),
      onAuthStateChangedCallback,
    );
    return subscriber;
  }, []);

  const login = async (email: string, password: string) => {
    console.log('login_start');
    try {
      showLoading();
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        const error: any = new Error('E-posta adresi doğrulanmamış.');
        error.code = 'auth/email-not-verified';
        throw error;
      }
      return true;
    } catch (error: any) {
      console.log('LOGIN_ERROR', error);
      throw new Error(generateErrorMessage(error.code));
    } finally {
      hideLoading();
    }
  };

  const register = async (email: string, password: string, otherData: any) => {
    try {
      showLoading();
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );
      const user = userCredential.user;
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email,
          ...otherData,
          createdAt: serverTimestamp(),
        });
        await updateProfile(user, {
          displayName: `${otherData.name} ${otherData.surname}`,
          photoURL: otherData.profilePicture || null,
        });
        await sendVerificationEmail(email);
      }
    } catch (error: any) {
      console.error('REGISTER_ERROR', error);
      throw new Error(generateErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      showLoading();
      await signOut(getAuth());
    } catch (error: any) {
      throw new Error('Çıkış yapılırken bir hata oluştu.');
    } finally {
      hideLoading();
    }
  };

  const passwordReset = async (email: string) => {
    try {
      showLoading();
      await sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error('PASSWORD_RESET_ERROR', error);
      throw new Error(
        error.message ||
          'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.',
      );
    } finally {
      hideLoading();
    }
  };

  const value = {
    user,
    initializing,
    login,
    register,
    logout,
    passwordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export default AuthProvider;
