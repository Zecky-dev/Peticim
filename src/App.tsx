import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@config/toastConfig';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  Adoptions,
  Login,
  Register,
  AddAdoption,
  Profile,
  ForgotPassword,
  AccountDetails,
  AdoptionDetails,
  MyAdoptionListings,
  AdoptionOwnerProfile,
  NearAdoptions,
  OnBoarding,
  AuthMethodChoice,
  PrivacyPolicy,
} from '@screens';
import { HeaderLogo, Icon } from '@components';
import { SENTRY_DSN } from '@env';

import LoadingProvider from '@context/LoadingContext';
import AuthProvider, { useAuth } from '@context/AuthContext';

import {
  setupNotificationChannel,
  listenFcmTokenRefreshService,
  listenForegroundNotifications,
  setBackgroundNotificationHandler,
  setupNotificationPressHandler,
  setNavigationRef,
  handlePendingNotificationActions,
} from '@firebase/notificationService';

import colors from '@utils/colors';
import styles from './App.style';

import { auth } from '@firebase/firebase';
import { updateFCMToken } from '@firebase/authService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: SENTRY_DSN,
  sendDefaultPii: false,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AuthMethodChoice" component={AuthMethodChoice} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="AccountDetails" component={AccountDetails} />
    <Stack.Screen name="MyAdoptionListings" component={MyAdoptionListings} />
    <Stack.Screen
      name="AdoptionDetails"
      component={AdoptionDetails}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

const AdoptionStacks = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Adoptions" component={Adoptions} />
    <Stack.Screen name="AdoptionDetails" component={AdoptionDetails} />
    <Stack.Screen
      name="AdoptionOwnerProfile"
      component={AdoptionOwnerProfile}
    />
    <Stack.Screen name="NearAdoptions" component={NearAdoptions} />
  </Stack.Navigator>
);

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarStyle: {
            backgroundColor: colors.primary,
            display: route.name !== 'AddAdoption' ? 'flex' : 'none',
          },
          tabBarInactiveTintColor: colors.white,
          tabBarActiveTintColor: colors.white,
          tabBarHideOnKeyboard: true,
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: 'center',
        };
      }}
    >
      <Tab.Screen
        name="AdoptionStacks"
        component={AdoptionStacks}
        options={({ navigation, route }) => ({
          title: 'İlanlar',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'paw' : 'paw-outline'}
              type="ion"
              size={24}
              color={colors.white}
            />
          ),
          popToTopOnBlur: true,
          tabBarStyle: (route => {
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? 'Adoptions';
            if (
              routeName === 'AdoptionDetails' ||
              routeName === 'AdoptionOwnerProfile' ||
              routeName === 'NearAdoptions'
            ) {
              return { display: 'none' };
            }
            return { backgroundColor: colors.primary };
          })(route),
          headerRight: () => {
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? 'Adoptions';
            if (routeName === 'Adoptions') {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AdoptionStacks', {
                      screen: 'NearAdoptions',
                    })
                  }
                  style={{ marginRight: 12 }}
                >
                  <Icon
                    name="map-outline"
                    type="ion"
                    color={colors.primary}
                    size={24}
                  />
                </TouchableOpacity>
              );
            }
            return null;
          },
        })}
      />
      <Tab.Screen
        name="AddAdoption"
        component={AddAdoption}
        options={{
          title: 'İlan Ekle',
          tabBarButton: ({ onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={styles.addAdoptionTabBarButton}
              activeOpacity={0.8}
            >
              <Icon name="plus" type="feather" size={28} color={colors.white} />
              <Text style={styles.addAdoptionTabBarButtonText}>İlan Ekle</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => ({
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              type="ion"
              size={24}
              color={colors.white}
            />
          ),
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
            if (
              routeName === 'AccountDetails' ||
              routeName === 'MyAdoptionListings' ||
              routeName === 'AdoptionDetails'
            ) {
              return { display: 'none' };
            }
            return { backgroundColor: colors.primary };
          })(),
          unmountOnBlur: false,
        })}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('ProfileStack', {
              screen: 'Profile',
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}

// 🆕 Gizlilik Sözleşmesi ekranı için Stack Navigator'ı tanımlayın
const PrivacyPolicyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicy} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, requiresPrivacyPolicyAcceptance } = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState<
    boolean | null
  >(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingStatus = await AsyncStorage.getItem(
        'onboarding_completed',
      );
      setIsOnboardingCompleted(onboardingStatus === 'true');
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  };

  // 1️⃣ Loading ekranı sadece initial auth check için
  if (user === undefined || isOnboardingCompleted === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 2️⃣ Onboarding ekranı
  if (!isOnboardingCompleted) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnBoarding">
          {() => <OnBoarding onComplete={handleOnboardingComplete} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  // 3️⃣ Login ekranları
  if (!user) {
    return <AuthStack />;
  }

  // 4️⃣ Gizlilik sözleşmesi ekranı
  if (requiresPrivacyPolicyAcceptance) {
    return <PrivacyPolicyStack />;
  }

  // 5️⃣ Ana uygulama
  return <AppStack />;
};

const AppContent = ({
  navigationRef,
  onNavigationReady,
}: {
  navigationRef: any;
  onNavigationReady: () => void;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
        <LoadingProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </LoadingProvider>
      </NavigationContainer>
      <Toast config={toastConfig} topOffset={insets.top + 32} />
    </>
  );
};

const App = () => {
  const navigationRef = useRef<any>(null);

  // INIT HELPER FUNCTIONS
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        '916856486435-5a8hal6o9hlq5vfgc210lbilsvrllncj.apps.googleusercontent.com',
      offlineAccess: false,
    });
  };

  const setupNotification = async () => {
    await setupNotificationChannel();
    setupNotificationPressHandler();
    setBackgroundNotificationHandler();
  };

  // INIT FUNCTION
  const initializeApp = async () => {
    configureGoogleSignIn();
    await setupNotification();
  };

  useEffect(() => {
    initializeApp();
    const unsubscribeToken = listenFcmTokenRefreshService(async token => {
      const user = auth.currentUser;
      updateFCMToken(user, token);
    });
    const unsubscribeForeground = listenForegroundNotifications();

    // Back press handler - app exit confirmation
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Uygulamadan Çık',
          'Uygulamadan çıkmak istiyor musunuz?',
          [
            {
              text: 'Hayır',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Evet',
              style: 'destructive',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
        );
        return true;
      },
    );

    return () => {
      unsubscribeToken();
      unsubscribeForeground();
      backHandler.remove();
    };
  }, []);

  // Navigation ready handler
  const onNavigationReady = async () => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
      await handlePendingNotificationActions();
    }
  };

  return (
    <SafeAreaProvider>
      <AppContent
        navigationRef={navigationRef}
        onNavigationReady={onNavigationReady}
      />
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(App);
