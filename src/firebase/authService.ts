import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  signInWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';
import { auth, db } from './firebase';
import { sendVerificationEmail } from '@api/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import { showToast } from '@config/toastConfig';
import { getFcmTokenService } from './notificationService';

const createUserAccount = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

const saveUserData = async (uid: string, email: string, otherData: any) => {
  await setDoc(doc(db, 'Users', uid), {
    email,
    ...otherData,
    createdAt: serverTimestamp(),
  });
};

const updateUserProfile = async (user: any, otherData: any) => {
  await updateProfile(user, {
    displayName: `${otherData.name} ${otherData.surname}`,
    photoURL: otherData.profilePicture || null,
  });
};

const sendVerification = async (email: string) => {
  await sendVerificationEmail(email);
};

export const signUpUser = async (
  email: string,
  password: string,
  otherData: any,
) => {
  try {
    const user = await createUserAccount(email, password);
    if (user) {
      await saveUserData(user.uid, email, otherData);
      await updateUserProfile(user, otherData);
      await sendVerification(email);
    }
  } catch (error: any) {
    throw error;
  }
};

export const updateFCMToken = async (
  user: FirebaseAuthTypes.User | null,
  token: string | null,
) => {
  if (token && user) {
    await updateDoc(doc(db, 'Users', user.uid), { fcmToken: token });
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      showToast({
        type: 'error',
        text1: 'Hata',
        text2: 'E-posta adresi onaylanmamış.',
      });
    }

    getFcmTokenService().then(async token => updateFCMToken(user, token));

    return true;
  } catch (error: any) {
    console.error('SIGN_IN_USER_ERROR', error);
    throw error;
  }
};
