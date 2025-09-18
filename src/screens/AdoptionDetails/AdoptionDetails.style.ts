import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  listingTitle: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
    color: colors.black,
  },
  locationText: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
  },
  animalBreed: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 16,
    color: colors.black_50,
  },
  infoContainer: {
    padding: 8,
    gap: 12,
  },
  sendWhatsappMessageButton: {
    flexDirection: 'row',
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
    alignItems: 'center',
  },
  sendWhatsappMessageText: {
    color: colors.white,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
  },

  infoTopSection: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  descriptionText: {
    color: colors.black,
    fontFamily: 'Comfortaa-Medium',
  },
  descriptionTitle: {
    color: colors.black,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray,
  },
  infoSection: {
    padding: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  infoSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoSectionRowLabel: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 14,
  },
  infoSectionRowValue: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 13,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  showFullScreenImageButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 12,
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ownerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  ownerInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },



});
