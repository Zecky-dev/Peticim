/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message handled:', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
