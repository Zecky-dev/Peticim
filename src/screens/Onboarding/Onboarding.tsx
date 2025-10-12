import React, { useRef, useState } from 'react';

import OnBoardingScreen from './components/OnBoardingScreen';
import { View, Text, FlatList, PermissionsAndroid, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OnBoardingSlide } from 'types/global';

import colors from '@utils/colors';
import onBoardingSlides from '../../constants/onboardingSlides.json';
import styles from './Onboarding.style';
import useLocation from '@hooks/useLocation';

interface OnBoardingProps {
  onComplete: () => void;
}

const OnBoarding = ({ onComplete }: OnBoardingProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { getLocationInfo } = useLocation();

  // Her slide için farklı işlevler
  const handleSlideAction = async (slideId: number) => {
    switch (slideId) {
      case 1:
        nextSlide();
        break;
      case 2:
        await requestLocationPermission();
        break;
      case 3:
        await requestNotificationPermission();
        break;
      case 4:
        await completeOnboarding();
        break;
      default:
        nextSlide();
    }
  };

  const nextSlide = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < onBoardingSlides.length) {
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konum İzni',
          message:
            'Peticim yakınınızdaki hayvanları gösterebilmek için konum izni istiyor.',
          buttonNeutral: 'Sonra Sor',
          buttonNegative: 'İptal',
          buttonPositive: 'İzin Ver',
        },
      );
      nextSlide();
    } catch (err) {
      console.warn('Konum izni hatası:', err);
      nextSlide();
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Bildirim İzni',
          message:
            'İlanlar ile ilgili güncellemeleri iletebilmek için bildirim iznine ihtiyaç bulunuyor.',
          buttonNegative: 'İptal',
          buttonPositive: 'İzin Ver',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Bildirim izni verildi');
      } else {
        console.log('Bildirim izni reddedildi');
      }
      nextSlide();
    } catch (err) {
      console.warn('Bildirim izni hatası:', err);
      nextSlide();
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
    } catch (error) {
      console.error('COMPLETE_ONBOARDING_ERROR', error);
    } finally {
      onComplete();
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={styles.onboardingList}
        contentContainerStyle={styles.onboardingContent}
        data={onBoardingSlides as OnBoardingSlide[]}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <OnBoardingScreen
            data={item}
            onButtonPress={() => handleSlideAction(item.id)}
          />
        )}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default OnBoarding;
