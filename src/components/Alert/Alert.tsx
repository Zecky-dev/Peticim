import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@utils/colors';
import Icon from '@components/Icon';

type AlertType = 'info' | 'warning' | 'success' | 'error';

type AlertProps = {
  message: string;
  type?: AlertType;
  withIcon?: boolean;
};

const Alert = ({ message, type = 'error', withIcon = true }: AlertProps) => {
  if (!message) {
    return null;
  }
  const config = {
    info: {
      iconName: 'information-outline',
      color: colors.info,
    },
    warning: {
      iconName: 'alert-outline',
      color: colors.warning,
    },
    success: {
      iconName: 'checkmark-circle-outline',
      color: colors.success,
    },
    error: {
      iconName: 'warning-outline',
      color: colors.error,
    },
  };

  const { iconName, color } = config[type];

  return (
    <View style={styles.container}>
      {withIcon && (
        <Icon name={iconName} type={'ion'} size={16} color={color} />
      )}
      <Text style={[styles.text, { color: color }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Comfortaa-Bold',
  },
});

export default Alert;
