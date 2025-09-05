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
  characterCounterContainer: {
    alignSelf: 'flex-end',
    bottom: 6,
  },
  characterCounterText: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 13,
  }
});
