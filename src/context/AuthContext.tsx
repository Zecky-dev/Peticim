import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  onAuthStateChanged,
  signOut,
  getIdToken,
  onIdTokenChanged,
} from '@react-native-firebase/auth';
import { sendPasswordResetEmail } from '@api/auth';
import { useLoading } from './LoadingContext';
import { auth } from '@firebase/firebase';
import { signInUser, signUpUser } from '@firebase/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
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
      await signInUser(email.toLowerCase(), password);
    } catch (error: any) {
      throw error;
    } finally {
      hideLoading();
    }
  };

  const register = async (email: string, password: string, otherData: any) => {
    try {
      showLoading();
      await signUpUser(email, password, otherData);
      await logout();
    } catch (error: any) {
      throw error;
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    try {
      showLoading();
      await signOut(auth);
    } catch (error: any) {
      console.error('LOGOUT_ERROR', error);
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
      throw error;
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
