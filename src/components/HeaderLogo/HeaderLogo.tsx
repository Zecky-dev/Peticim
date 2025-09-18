import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@components/Icon';

import colors from '@utils/colors';
import styles from './HeaderLogo.style';

const HeaderLogo = () => {
  return (
    <View style={styles.container}>
      <Icon name="paw" type="ion" color={colors.primary} size={28} />
      <Text style={styles.title}>
        Peticim
      </Text>
    </View>
  );
};

export default HeaderLogo;
