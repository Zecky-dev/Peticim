import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseAuthTypes, updateProfile } from '@react-native-firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdToken,
  onIdTokenChanged,
} from '@react-native-firebase/auth';
import { generateErrorMessage } from '@firebase/helpers/generateErrorMessage';
import { sendVerificationEmail, sendPasswordResetEmail } from '@api/auth';
import { useLoading } from './LoadingContext';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { app, auth, db } from '@firebase/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, otherData: any) => Promise<void>;
  logout: () => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  async function onAuthStateChangedCallback(
    user: FirebaseAuthTypes.User | null,
  ) {
    if (user) {
      if (!user.emailVerified) {
        setUser(null);
        setToken(null);
      } else {
        setUser(user);
        const idToken = await getIdToken(user);
        console.log('TOKEN', idToken);
        setToken(idToken || null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChangedCallback);
    return subscriber;
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async user => {
      if (user) {
        const idToken = await getIdToken(user, true);
        setToken(idToken);
      } else {
        setToken(null);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      showLoading();
      const userCredential = await signInWithEmailAndPassword(
        auth,
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
        auth,
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
        await logout();
      }
    } catch (error: any) {
      console.log('REGISTER_ERROR', error);
      throw new Error(generateErrorMessage(error.code));
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    try {
      showLoading();
      await signOut(auth);
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
      console.log('PASSWORD_RESET_ERROR', error);
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
    token,
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
