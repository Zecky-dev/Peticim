import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  imageSwiperContainer: {
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  showFullScreenImageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 12,
    bottom: 12,
  },
  backButtonContainer: {
    position: 'absolute',
  },
  modalCloseButton: {
    position: 'absolute',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    right: 12,
    top: 12,
  },
  title: {
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
  },
  animalTypeBreed: {
    textAlign: 'center',
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
  },
  infoContainer: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: colors.black,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
  },
  descriptionText: {
    color: colors.black,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
  },
  infoBox: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  infoBoxesContainer: { flexDirection: 'row', gap: 4, marginTop: 12 },
  infoBoxValue: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
  },
  adsOwnerContainer: { alignItems: 'center', gap: 6, flexDirection: 'row', marginBottom:12 },
  adsOwnerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  adsOwnerNameSurname: {
    color: colors.black,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 14,
  },
  sendWhatsappMessageButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 8,
    marginTop: 12,
  },
  sendWhatsappMessageButtonText: {
    color: colors.white,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 14,
  },

  /*
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
  */
});
