import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
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
} from '@screens';
import { HeaderLogo, Icon } from '@components';

import LoadingProvider from '@context/LoadingContext';
import AuthProvider, { useAuth } from '@context/AuthContext';

import colors from '@utils/colors';
import styles from './App.style';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        })}
      />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  const { user, initializing } = useAuth();

  React.useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Bildirim izni verildi');
        } else {
          console.log('Bildirim izni reddedildi');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    if (user) {
      requestNotificationPermission();
    }
  }, [user]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return user ? <AppStack /> : <AuthStack />;
};

const AppContent = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <NavigationContainer>
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

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
