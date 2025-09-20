import React, { useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@components';
import colors from '@utils/colors';
import styles from './InformationBox.style';

const InformationBox = () => {
  const [visible, setVisible] = useState(true);
  const animation = useRef(new Animated.Value(1)).current;

  const closeBox = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
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
