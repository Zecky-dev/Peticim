import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '@utils/colors'
import Icon from '@components/Icon';

interface BackButtonProps {
  color?: string; 
  size?: number;
}

const BackButton = ({ color = colors.black_50, size = 32 }: BackButtonProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{zIndex: 999}} activeOpacity={0.8} onPress={() => navigation.goBack()}>
      <Icon name="chevron-left" type="feather" color={color} size={size} />
    </TouchableOpacity>
  );
};

export default BackButton;