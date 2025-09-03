import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '@utils/colors';
import styles from './Button.style';

type ButtonProps = {
  icon?: React.ReactNode;
  label: string;
  backgroundColor?: string;
  labelColor?: string;
  additionalStyles?: {
    container?: ViewStyle;
    label?: TextStyle;
  };
  outline?: boolean;
} & TouchableOpacityProps;

const Button = ({
  label,
  icon,
  labelColor = colors.white,
  backgroundColor = colors.primary,
  additionalStyles,
  outline,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        additionalStyles?.container,
        { backgroundColor: outline ? 'transparent' : backgroundColor },
        outline && { borderColor: backgroundColor, borderWidth: 1 },
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {icon && icon}
      <Text
        style={[
          styles.label,
          additionalStyles?.label,
          { color: outline ? backgroundColor : labelColor },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
