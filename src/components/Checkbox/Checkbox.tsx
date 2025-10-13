import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './Checkbox.style';
import Icon from '@components/Icon';
import colors from '@utils/colors';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onCheckChange: (newValue: boolean) => void;
  labelColor?: string;
};

const Checkbox = ({
  label,
  checked,
  onCheckChange,
  labelColor,
}: CheckboxProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onCheckChange(!checked)}
      style={styles.container}
    >
      <View style={styles.checkboxButton}>
        {checked && (
          <Icon name="checkmark" type="ion" color={colors.primary} size={12} />
        )}
      </View>
      <Text style={[styles.checkboxLabel, { color: labelColor || '#000' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
