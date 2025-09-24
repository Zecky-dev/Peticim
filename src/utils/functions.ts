import { auth } from '@firebase/firebase';
import { getIdToken } from '@react-native-firebase/auth';
export const getValidToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  try {
    return await getIdToken(currentUser, false);
  } catch (e: any) {
    console.log('TOKEN_ERROR', e);
    return null;
  }
};
