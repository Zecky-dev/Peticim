import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
const auth = getAuth();
const db = getFirestore();
export { auth, db };
