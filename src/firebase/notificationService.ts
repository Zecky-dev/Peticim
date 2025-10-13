import { cm } from '@firebase/firebase';
import * as Sentry from '@sentry/react-native';
import {
  getToken,
  onTokenRefresh,
  onMessage,
  setBackgroundMessageHandler,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, Event, EventType } from '@notifee/react-native';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification action types
export enum NotificationActionType {
  LISTING_APPROVED = 'listing_approved',
  LISTING_REJECTED = 'listing_rejected',
}

// Navigation reference
let navigationRef: NavigationContainerRef<any> | null = null;
export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

// Notification channel setup
export const setupNotificationChannel = async () => {
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Peticim Bildirimleri',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'setupNotificationChannel');
      Sentry.captureException(error);
    });
    console.error('SETUP_NOTIFICATION_CHANNEL_ERROR', error);
  }
};

// Notification action handler
const handleNotificationAction = (notificationData: any) => {
  if (!navigationRef) {
    AsyncStorage.setItem('pendingNotificationAction', JSON.stringify(notificationData));
    return;
  }

  try {
    const actionType = notificationData?.actionType || notificationData?.type || notificationData?.action;
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'AdoptionStacks',
            state: { routes: [{ name: 'Adoptions', params: { shouldRefresh: true } }] },
          },
        ],
      })
    );
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'handleNotificationAction');
      scope.setExtra('notificationData', notificationData);
      Sentry.captureException(error);
    });
    console.error('HANDLE_NOTIFICATION_ACTION_ERROR', error);
  }
};

// ============================
// FCM TOKEN SERVICES
// ============================
export const getFcmTokenService = async () => {
  try {
    const token = await getToken(cm);
    console.log('FCM Token obtained:', token);
    return token;
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'getFcmTokenService');
      Sentry.captureException(error);
    });
    console.error('GET_FCM_TOKEN_ERROR', error);
    return null;
  }
};

export const listenFcmTokenRefreshService = (callback: (token: string) => void) => {
  const unsubscribe = onTokenRefresh(cm, token => {
    console.log('FCM Token refreshed:', token);
    callback(token);
  });
  return unsubscribe;
};

// ============================
// FOREGROUND NOTIFICATIONS
// ============================
export const listenForegroundNotifications = () => {
  const unsubscribe = onMessage(cm, async remoteMessage => {
    try {
      if (remoteMessage.notification?.title && remoteMessage.notification?.body) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
          android: { channelId: 'default', smallIcon: 'ic_notification_icon', pressAction: { id: 'default' } },
        });
      }
    } catch (error: any) {
      Sentry.withScope(scope => {
        scope.setTag('function', 'listenForegroundNotifications');
        scope.setExtra('remoteMessage', remoteMessage);
        Sentry.captureException(error);
      });
      console.error('FOREGROUND_NOTIFICATION_ERROR', error);
    }
  });
  return unsubscribe;
};

// ============================
// BACKGROUND NOTIFICATIONS
// ============================
export const setBackgroundNotificationHandler = () => {
  setBackgroundMessageHandler(cm, async remoteMessage => {
    try {
      if (remoteMessage.notification?.title && remoteMessage.notification?.body) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
          android: { channelId: 'default', smallIcon: 'ic_notification_icon', pressAction: { id: 'default' } },
        });
      }
    } catch (error: any) {
      Sentry.withScope(scope => {
        scope.setTag('function', 'setBackgroundNotificationHandler');
        scope.setExtra('remoteMessage', remoteMessage);
        Sentry.captureException(error);
      });
      console.error('BACKGROUND_NOTIFICATION_ERROR', error);
    }
  });
};

// ============================
// NOTIFICATION PRESS HANDLERS
// ============================
export const setupNotificationPressHandler = () => {
  notifee.onForegroundEvent(({ type, detail }: Event) => {
    if (type === EventType.PRESS && detail.notification?.data) {
      try {
        handleNotificationAction(detail.notification.data);
      } catch (error: any) {
        Sentry.withScope(scope => {
          scope.setTag('function', 'foregroundNotificationPress');
          scope.setExtra('notificationData', detail.notification.data);
          Sentry.captureException(error);
        });
        console.error('FOREGROUND_NOTIFICATION_PRESS_ERROR', error);
      }
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }: Event) => {
    if (type === EventType.PRESS && detail.notification?.data) {
      try {
        await AsyncStorage.setItem('pendingNotificationAction', JSON.stringify(detail.notification.data));
      } catch (error: any) {
        Sentry.withScope(scope => {
          scope.setTag('function', 'backgroundNotificationPress');
          scope.setExtra('notificationData', detail.notification.data);
          Sentry.captureException(error);
        });
        console.error('BACKGROUND_NOTIFICATION_PRESS_ERROR', error);
      }
    }
  });
};

// ============================
// INITIAL & PENDING NOTIFICATIONS
// ============================
export const handleInitialNotification = async () => {
  try {
    const remoteMessage = await getInitialNotification(cm);
    if (remoteMessage?.data) setTimeout(() => handleNotificationAction(remoteMessage.data), 1500);

    const pendingAction = await AsyncStorage.getItem('pendingNotificationAction');
    if (pendingAction) {
      const notificationData = JSON.parse(pendingAction);
      await AsyncStorage.removeItem('pendingNotificationAction');
      setTimeout(() => handleNotificationAction(notificationData), 1500);
    }
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'handleInitialNotification');
      Sentry.captureException(error);
    });
    console.error('HANDLE_INITIAL_NOTIFICATION_ERROR', error);
  }
};

export const handlePendingNotificationActions = async () => {
  try {
    const pendingAction = await AsyncStorage.getItem('pendingNotificationAction');
    if (pendingAction && navigationRef) {
      const notificationData = JSON.parse(pendingAction);
      await AsyncStorage.removeItem('pendingNotificationAction');
      handleNotificationAction(notificationData);
    }
  } catch (error: any) {
    Sentry.withScope(scope => {
      scope.setTag('function', 'handlePendingNotificationActions');
      Sentry.captureException(error);
    });
    console.error('HANDLE_PENDING_ACTIONS_ERROR', error);
  }
};