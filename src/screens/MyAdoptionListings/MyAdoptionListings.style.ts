import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundAnimation: {
    width: '100%',
    height: 180,
  },
  emptyListingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listingsContainer: {
    padding: 12,
  },
  separator: {
    height: 12,
  }
});
