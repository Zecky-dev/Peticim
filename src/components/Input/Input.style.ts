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
    flexDirection: 'row',
    fontSize: 16,
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
  characterCounterText: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
    alignSelf: 'flex-end',
    position: "absolute",
    right: 4,
    bottom: 4
  }
});
