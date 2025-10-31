import React, { useRef, useState, useEffect } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@components';
import colors from '@utils/colors';
import styles from './InformationBox.style';
import { getItemFromAsyncStorage, saveItemToAsyncStorage } from '@utils/storage';

const DISMISS_KEY = 'info_box_dismissed';

const InformationBox = () => {
  const [visible, setVisible] = useState(true);
  const animation = useRef(new Animated.Value(1)).current;

  // Uygulama açıldığında dismiss state'i kontrol et
  useEffect(() => {
    const checkDismissStatus = async () => {
      try {
        const isDismissed = await getItemFromAsyncStorage(DISMISS_KEY);
        if (isDismissed === 'true') {
          setVisible(false);
        }
      } catch (error) {
        console.error('Error checking dismiss status:', error);
      }
    };
    checkDismissStatus();
  }, []);

  const closeBox = async () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      setVisible(false);
      // Dismiss state'i AsyncStorage'a kaydet
      try {
        await saveItemToAsyncStorage(DISMISS_KEY, 'true');
      } catch (error) {
        console.error('Error saving dismiss status:', error);
      }
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <Icon
          name="information-circle-outline"
          size={18}
          color={colors.white}
          type="ion"
        />
        <Text style={styles.headerText}>Bilgilendirme</Text>
        <TouchableOpacity onPress={closeBox} style={styles.closeButton}>
          <Icon name="close-outline" color={colors.white} type="ion" size={20} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>
        Bu platformda yalnızca ücretsiz sahiplendirme yapılmaktadır. Ücret
        karşılığında sahiplendirme yapan kullanıcıların ilanlarını
        bildirebilirsiniz.
      </Text>
    </Animated.View>
  );
};

export default InformationBox;
