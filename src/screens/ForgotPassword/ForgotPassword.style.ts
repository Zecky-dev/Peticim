import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  backButtonContainer: {
    position: 'absolute',
  },
  forgotPasswodForm: {
    gap: 12,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 28,
    textAlign: 'center',
  },
});
