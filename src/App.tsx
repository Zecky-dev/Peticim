import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@config/toastConfig';
import { NavigationContainer } from '@react-navigation/native';
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
  Favorites,
  ForgotPassword,
  AccountDetails,
  AdoptionDetails,
} from '@screens';
import LoadingProvider from '@context/LoadingContext';
import AuthProvider, { useAuth } from '@context/AuthContext';
import colors from '@utils/colors';
import { Icon } from '@components';

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
  </Stack.Navigator>
);

const AdoptionStacks = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Adoptions" component={Adoptions} />
    <Stack.Screen name="AdoptionDetails" component={AdoptionDetails} />
  </Stack.Navigator>
);

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.primary },
        tabBarInactiveTintColor: colors.white,
        tabBarActiveTintColor: colors.white,
        headerTitleStyle: { color: colors.white },
        headerStyle: { backgroundColor: colors.primary },
        headerTitleAlign: 'center',
        tabBarLabelStyle: { fontFamily: 'Comfortaa-Medium' },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Adoptions"
        component={AdoptionStacks}
        options={{
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
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'heart' : 'heart-outline'}
              type="ion"
              size={24}
              color={colors.white}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddAdoption"
        component={AddAdoption}
        options={{
          title: 'İlan Ekle',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'plus-box' : 'plus-box-outline'}
              type="material-community"
              size={24}
              color={colors.white}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              type="ion"
              size={24}
              color={colors.white}
            />
          ),
          popToTopOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}
      >
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
