import { Platform, StyleSheet } from 'react-native';
import colors from '@utils/colors';
export default StyleSheet.create({
  outerContainer: {
    gap: 3,
  },
  label: {
    fontFamily: 'Comfortaa-Bold',
    color: colors.black_50,
  },
  inputContainer: {
    borderColor: colors.gray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    color: colors.black,
    padding: Platform.OS === "ios" ? 10 : undefined,
    fontFamily: 'Comfortaa-Bold',
  },
  hideUnhideButton: {
    paddingHorizontal: 4,
  },

  /*
  
    outerContainer: {
    gap: 8,
  },
  label: {
    fontFamily: 'Comfortaa-Bold',
    color: colors.black_50,
  },
  phoneInput: {
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  hideUnhideButton: {
    paddingHorizontal: 12,
  },
  input: {
    paddingHorizontal: 12,
    color: colors.black,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    color: colors.error,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 15,
    marginTop: -6,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  */
});
