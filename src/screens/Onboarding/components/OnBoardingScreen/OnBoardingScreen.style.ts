import colors from '@utils/colors';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  slideContainer: {
    backgroundColor: colors.primary,
    flex: 1,
    width: width,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  slideContentContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Comfortaa-Bold',
    color: colors.white,
    fontSize: 24,
    textAlign: 'center',
  },
  subTitle: {
    textAlign: 'center',
    fontFamily: 'Comfortaa-SemiBold',
    color: colors.white,
    fontSize: 18,
  },
  slideButtonContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  }

});
