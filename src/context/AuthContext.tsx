import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import { sendPasswordResetEmail } from '@api/auth';
import { useLoading } from './LoadingContext';
import { auth } from '@firebase/firebase';
import { signInUser, signUpUser } from '@firebase/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, otherData: any) => Promise<void>;
  logout: () => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  async function onAuthStateChangedCallback(
    user: FirebaseAuthTypes.User | null,
  ) {
    if (user && user.emailVerified) {
      setUser(user);
    } else {
      setUser(null);
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChangedCallback);
    return subscriber;
  }, []);

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
      await signOut(auth);
    } finally {
      hideLoading();
    }
  };

  const passwordReset = async (email: string) => {
    try {
      showLoading();
      await sendPasswordResetEmail(email);
    } finally {
      hideLoading();
    }
  };

  const value: AuthContextType = {
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;
