import colors from '@utils/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  full: {
    flex: 1,
  },
  addressTitle: {
    fontFamily: 'Comfortaa-Bold',
    color: colors.black_50,
    marginBottom: 4,
  },
  formContainer: {
    gap: 12,
    flex: 1,
  },
  accountDetailsText: {
    color: colors.primary,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 26,
    textAlign: 'center',
  },
  addressText: {
    color: colors.black,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
    marginBottom: 8,
  }
});