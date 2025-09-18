import { StyleSheet } from 'react-native';
import colors from '@utils/colors';
export default StyleSheet.create({
  addAdoptionTabBarButton: {
    backgroundColor: colors.primary,
    width: 80,
    height: 80,
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 40,
    bottom: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  addAdoptionTabBarButtonText: {
    color: colors.white,
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
