import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getMessaging } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const auth = getAuth();
const db = getFirestore();
const app = getApp();
const cm = getMessaging();

export { app, auth, db, cm };
