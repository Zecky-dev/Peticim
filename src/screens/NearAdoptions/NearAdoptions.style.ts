import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  locationPermissionText: {
    fontFamily: 'Comfortaa-Medium',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 18,
  },
  nearbyListingsTextContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    position: "absolute",
    left: 16,
    right: 16,
    top: 16,
    padding: 8,
    borderRadius: 12,
  },
  nearbyListingsText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 13,
    textAlign: 'center',
  },
  calloutContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  calloutImage: {
    width: 100,
    height: 100,
  },
  calloutTitle: {
    color: colors.black,
    fontFamily: 'Comfortaa-Bold',
    textAlign: 'center',
    fontSize: 14
  },
  calloutSubtitle: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Medium',
    textAlign: 'center',
    fontSize: 12,
  },
  calloutButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  calloutButtonText: {
    color: colors.white,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
  },
  calloutContentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  }


});
