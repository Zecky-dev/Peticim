import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './AddAdoption.style';

const AddAdoption = () => {
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Text>Add Adoption!</Text>
    </SafeAreaView>
  );
};

export default AddAdoption;
