import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Favorites.style';

const Favorites = () => {
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Text>Favorites</Text>
    </SafeAreaView>
  );
};

export default Favorites;
