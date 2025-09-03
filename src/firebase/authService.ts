import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';
import { auth, db } from './firebase';
import { generateErrorMessage } from './helpers/generateErrorMessage';
import { sendVerificationEmail } from '@api/auth';
import { doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

const register = async (email: string, password: string, otherData: any) => {
  try {
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
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(generateErrorMessage(error.code));
  }
};

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      await auth.signOut();
      const error: any = new Error('E-posta adresi doğrulanmamış.');
      error.code = 'auth/email-not-verified';
      throw error;
    }
    console.log('LOGIN_SUCCESS');
    return true;
  } catch (error: any) {
    console.log('LOGIN_ERROR', error);
    throw new Error(generateErrorMessage(error.code));
  }
};

export { login, register };
