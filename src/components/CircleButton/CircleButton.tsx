import { TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '@utils/colors';
import Icon from '@components/Icon';

interface CircleButtonProps {
  onPress?: () => void;
  iconName?: string;
  iconType?: string;
  iconColor?: string;
  iconSize?: number;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

const CircleButton = ({
  onPress,
  iconName = 'chevron-left',
  iconType = 'feather',
  iconColor = colors.primary,
  iconSize = 32,
  size,
  backgroundColor = 'transparent',
  style,
}: CircleButtonProps) => {
  const navigation = useNavigation();
  const buttonSize = size || iconSize + 16;

  // onPress yoksa varsayılan geri fonksiyon
  const handlePress = onPress ?? (() => navigation.goBack());

  return (
    <TouchableOpacity
      style={[
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      {iconName && (
        <Icon
          name={iconName}
          type={iconType}
          color={iconColor}
          size={iconSize}
        />
      )}
    </TouchableOpacity>
  );
};

export default CircleButton;
