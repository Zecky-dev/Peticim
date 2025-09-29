import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from '@react-native-firebase/auth';
import { auth, db } from './firebase';
import { sendVerificationEmail } from '@api/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from '@react-native-firebase/firestore';
import { showToast } from '@config/toastConfig';
import { getFcmTokenService } from './notificationService';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const saveUserDataToFirebase = async (
  uid: string,
  email: string,
  otherData: any,
) => {
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

export const signUpUser = async (
  email: string,
  password: string,
  otherData: any,
) => {
  try {
    const user = (await createUserWithEmailAndPassword(auth, email, password))
      .user;
    if (user) {
      await saveUserDataToFirebase(user.uid, email, otherData);
      await updateUserProfile(user, otherData);
      await sendEmailVerification(user);
    }
  } catch (error: any) {
    throw error;
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
      return false;
    }
    getFcmTokenService().then(async token => updateFCMToken(user, token));
    return true;
  } catch (error: any) {
    console.error('SIGN_IN_USER_ERROR', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    showToast({
      type: 'success',
      text1: 'Başarılı',
      text2: 'Şifre sıfırlama e-postası gönderildi.',
    });
  } catch (error: any) {
    console.error('FORGOT_PASSWORD_ERROR', error);
    let message = 'Şifre sıfırlama e-postası gönderilemedi.';
    if (error.code === 'auth/user-not-found') {
      message = 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı.';
    }
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: message,
    });
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

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return;
    const { idToken } = response.data;
    const credential = GoogleAuthProvider.credential(idToken);
    const user = (await auth.signInWithCredential(credential)).user;
    const userDocRef = doc(db, 'Users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const [name, surname] = user.displayName?.split(' ') ?? ['', ''];
    const baseFirebaseUserData = {
      name,
      surname,
      isBanned: false,
      email: user.email,
      profilePicture: {
        url: user.photoURL,
      },
    };
    const fcmToken = await getFcmTokenService();
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        ...baseFirebaseUserData,
        createDate: serverTimestamp(),
        role: 'user',
        fcmToken,
      });
    } else {
      await setDoc(
        userDocRef,
        {
          ...baseFirebaseUserData,
          lastLoginDate: serverTimestamp(),
          fcmToken,
        },
        { merge: true },
      );
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          console.log('Google sign in progress..');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play services not available');
          break;
        default:
      }
    } else {
      throw error;
    }
  }
};
