import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './Checkbox.style';
import Icon from '@components/Icon';
import colors from '@utils/colors';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onCheckChange: (newValue: boolean) => void;
};

const Checkbox = ({ label, checked, onCheckChange }: CheckboxProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        const newValue = !checked;
        onCheckChange(newValue);
      }}
      style={styles.container}
    >
      <View style={styles.checkboxButton}>
        {checked && (
          <Icon name="checkmark" type="ion" color={colors.primary} size={12} />
        )}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
