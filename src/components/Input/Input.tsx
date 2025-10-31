import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Alert, Icon } from '@components';
import colors from '@utils/colors';
import styles from './Input.style';

type CustomStyle = {
  label?: TextStyle;
  outerContainer?: ViewStyle;
  inputContainer?: ViewStyle;
  input?: TextStyle;
  errorText?: TextStyle;
};

type InputProps = {
  label?: string;
  placeholder?: string;
  customStyles?: CustomStyle;
  secureContent?: boolean;
  error?: string;
  maxLength?: number;
  value?: string;
  showCharacterCount?: boolean;
} & TextInputProps;

const Input = ({
  label,
  placeholder,
  customStyles,
  error,
  secureContent = false,
  maxLength,
  value,
  showCharacterCount = false,
  ...rest
}: InputProps) => {
  const [hidden, setHidden] = useState(secureContent);
  const [textValue, setTextValue] = useState(value || '');
  useEffect(() => {
    setTextValue(value || '');
  }, [value]);

  const characterCount = textValue.length;

  const getCounterColor = () => {
    if (!maxLength) return colors.gray;
    if (characterCount >= maxLength) return colors.error;
    if (characterCount >= maxLength * 0.5) return colors.warning;
    return colors.gray;
  };

  return (
    <View style={[styles.outerContainer, customStyles?.outerContainer]}>
      {label && (
        <Text style={[styles.label, customStyles?.label]}>{label}</Text>
      )}

      <View style={[styles.inputContainer, customStyles?.inputContainer]}>
        <TextInput
          secureTextEntry={hidden}
          style={[styles.input, customStyles?.input]}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          maxLength={maxLength}
          onChangeText={text => {
            setTextValue(text);
            if (rest.onChangeText) rest.onChangeText(text);
          }}
          {...rest}
        />

        {secureContent && (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            style={styles.hideUnhideButton}
          >
            <Icon
              name={hidden ? 'eye-off' : 'eye'}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        )}

        {maxLength && showCharacterCount && (
          <Text
            style={[styles.characterCounterText, { color: getCounterColor() }]}
          >
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>

      {error && <Alert withIcon={false} message={error} />}
    </View>
  );
};

export default Input;
