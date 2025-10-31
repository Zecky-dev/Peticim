import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  adsOwnerContainer: {
    alignItems: 'center',
    gap: 6,
    flexDirection: 'row',
    marginBottom: 12,
  },
  adsOwnerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
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
  reportModalContainer: {
    margin: 0,
  },
  reportModalContentContainer: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 8,
  },
  reasonSelectText: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 15,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
});
