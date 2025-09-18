import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
  },
  title: {
    color: colors.black,
    fontFamily: 'Comfortaa-Bold',
  },
  animalType: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Medium',
  },
  viewsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  viewsText: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Medium',
  },
  removeAdoptionText: {
    color: colors.error,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
  },
  buttonLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  image: { width: 80, height: 80, borderRadius: 4, },
});
