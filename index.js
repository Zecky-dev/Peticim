/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { cm } from '@firebase/firebase'
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
setBackgroundMessageHandler(cm, async remoteMessage => {
  console.log('Background message handled:', remoteMessage);
});