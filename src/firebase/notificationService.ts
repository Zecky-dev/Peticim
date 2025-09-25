// notificationService.ts
import { cm } from '@firebase/firebase';
import { getToken, onTokenRefresh, onMessage, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: 4,
  });
};

export const getFcmTokenService = async () => {
  try {
    const token = await getToken(cm);
    return token;
  } catch (error) {
    console.log('GET_FCM_TOKEN_ERROR', error);
    return null;
  }
};

export const listenFcmTokenRefreshService = (callback: (token: string) => void) => {
  const unsubscribe = onTokenRefresh(cm, token => {
    callback(token);
  });
  return unsubscribe;
};

export const listenForegroundNotifications = () => {
  const unsubscribe = onMessage(cm, async remoteMessage => {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title ?? 'Yeni Bildirim',
      body: remoteMessage.notification?.body ?? '',
      android: { channelId: 'default', smallIcon: 'ic_notification_icon' },
    });
  });
  return unsubscribe;
};

export const setBackgroundNotificationHandler = () => {
  setBackgroundMessageHandler(cm, async remoteMessage => {
    console.log('Background message', remoteMessage);
  });
};
