import { StyleSheet } from 'react-native';
import colors from '@utils/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    color: colors.primary,
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 24,
  },
});
