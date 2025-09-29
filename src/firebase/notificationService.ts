import { cm } from '@firebase/firebase';
import {
  getToken,
  onTokenRefresh,
  onMessage,
  setBackgroundMessageHandler,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  Event,
  EventType,
} from '@notifee/react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification action types (dış servisten gelen data'ya göre)
export enum NotificationActionType {
  LISTING_APPROVED = 'listing_approved',
  LISTING_REJECTED = 'listing_rejected',
}

// Navigation reference
let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

export const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Peticim Bildirimleri',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

// Notification action handler - dış servisten gelen data'ya göre yönlendirme
const handleNotificationAction = (notificationData: any) => {
  if (!navigationRef) {
    console.log('Navigation ref not ready, storing action for later');
    AsyncStorage.setItem(
      'pendingNotificationAction',
      JSON.stringify(notificationData),
    );
    return;
  }

  console.log('Handling notification action:', notificationData);

  const actionType =
    notificationData?.actionType ||
    notificationData?.type ||
    notificationData?.action;

  switch (actionType) {
    case 'listing_approved':
    case 'LISTING_APPROVED':
      console.log('Navigating to Adoptions with refresh');
      navigationRef.navigate('AdoptionStacks', {
        screen: 'Adoptions',
        params: { shouldRefresh: true }
      });
      break;

    case 'listing_rejected':
    case 'LISTING_REJECTED':
      console.log('Navigating to MyAdoptionListings with refresh');
      navigationRef.navigate('ProfileStack', {
        screen: 'MyAdoptionListings',
        params: { shouldRefresh: true }
      });
      break;

    default:
      console.log('Navigating to Adoptions (default)');
      navigationRef.navigate('AdoptionStacks', {
        screen: 'Adoptions',
        params: { shouldRefreshrefresh: true }
      });
      break;
  }
};

export const getFcmTokenService = async () => {
  try {
    const token = await getToken(cm);
    console.log('FCM Token obtained:', token);
    return token;
  } catch (error) {
    console.log('GET_FCM_TOKEN_ERROR', error);
    return null;
  }
};

export const listenFcmTokenRefreshService = (
  callback: (token: string) => void,
) => {
  const unsubscribe = onTokenRefresh(cm, token => {
    console.log('FCM Token refreshed:', token);
    callback(token);
  });
  return unsubscribe;
};

export const listenForegroundNotifications = () => {
  const unsubscribe = onMessage(cm, async remoteMessage => {
    if (
      remoteMessage.notification &&
      remoteMessage.notification.title &&
      remoteMessage.notification.body
    ) {
      // Notification'ı göster
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        android: {
          channelId: 'default',
          smallIcon: 'ic_notification_icon',
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  });
  return unsubscribe;
};

// Background notification handler (uygulama background'dayken)
export const setBackgroundNotificationHandler = () => {
  setBackgroundMessageHandler(cm, async remoteMessage => {
    console.log('Background notification received:', remoteMessage);

    if (
      remoteMessage.notification &&
      remoteMessage.notification.title &&
      remoteMessage.notification.body
    ) {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        android: {
          channelId: 'default',
          smallIcon: 'ic_notification_icon',
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  });
};

export const setupNotificationPressHandler = () => {
  notifee.onForegroundEvent(({ type, detail }: Event) => {
    if (type === EventType.PRESS) {
      console.log(
        'Notification pressed (foreground):',
        detail.notification?.data,
      );

      if (detail.notification?.data) {
        handleNotificationAction(detail.notification.data);
      }
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }: Event) => {
    if (type === EventType.PRESS) {
      console.log(
        'Notification pressed (background):',
        detail.notification?.data,
      );

      if (detail.notification?.data) {
        await AsyncStorage.setItem(
          'pendingNotificationAction',
          JSON.stringify(detail.notification.data),
        );
      }
    }
  });
};

export const handleInitialNotification = async () => {
  try {
    const remoteMessage = await getInitialNotification(cm);
    if (remoteMessage?.data) {
      console.log(
        'App opened from notification (killed state):',
        remoteMessage.data,
      );

      // Navigation hazır olana kadar bekle
      setTimeout(() => {
        handleNotificationAction(remoteMessage.data);
      }, 1500);
    }

    // Pending action var mı kontrol et (background'dan kalan)
    const pendingAction = await AsyncStorage.getItem(
      'pendingNotificationAction',
    );
    if (pendingAction) {
      console.log('Found pending notification action:', pendingAction);
      const notificationData = JSON.parse(pendingAction);

      // Pending action'ı temizle
      await AsyncStorage.removeItem('pendingNotificationAction');

      // Action'ı handle et
      setTimeout(() => {
        handleNotificationAction(notificationData);
      }, 1500);
    }
  } catch (error) {
    console.log('HANDLE_INITIAL_NOTIFICATION_ERROR', error);
  }
};

// Pending action'ları handle et (navigation hazır olduktan sonra)
export const handlePendingNotificationActions = async () => {
  try {
    const pendingAction = await AsyncStorage.getItem(
      'pendingNotificationAction',
    );
    if (pendingAction && navigationRef) {
      console.log('Handling pending notification action:', pendingAction);
      const notificationData = JSON.parse(pendingAction);

      await AsyncStorage.removeItem('pendingNotificationAction');
      handleNotificationAction(notificationData);
    }
  } catch (error) {
    console.log('HANDLE_PENDING_ACTIONS_ERROR', error);
  }
};
