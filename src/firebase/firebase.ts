import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
const auth = getAuth();
const db = getFirestore();
const app = getApp();
export { app, auth, db };
