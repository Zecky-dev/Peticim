import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
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
} & TextInputProps;

const Input = ({
  label,
  placeholder,
  customStyles,
  error,
  secureContent = false,
  ...rest
}: InputProps) => {
  const [hidden, setHidden] = useState(secureContent);
  return (
    <>
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
        </View>
      </View>
      {error && <Alert withIcon={false} message={error} />}
    </>
  );
};

export default Input;
