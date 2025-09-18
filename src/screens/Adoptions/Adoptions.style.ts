import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
    gap: 8,
  },
  separator: {
    height: 12,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  outlineButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '35%',
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  showFavoritesText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
  },
  filterModalContainer: {
    margin: 0,
  },
  filterModalContentContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
  },
  notFoundAnimation: {
    width: '100%',
    height: 180,
  },

  listingsContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  emptyListingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listingsContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 13,
    color: colors.primary,
  },
  filterTitle: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
  },
  resetFiltersText: {
    color: colors.primary,
    alignSelf: 'flex-end',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
  },
  filterCountBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountBadgeText: {
    color: colors.white,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 10,
  }



});
