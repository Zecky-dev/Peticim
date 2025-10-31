import colors from '@utils/colors';
import { PanResponder, StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  checkboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthStatusText: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 14,
  },
  healthStatusContainer: {
    gap: 6,
  },
  healthStatusCheckboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepButtonsContainer: {
    gap: 12,
    marginTop: 16,
  },
  addImageButton: {
    width: '100%',
    height: 200,
    backgroundColor: colors.black_50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: colors.gray,
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 24,
  },
  pickNewPhotos: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  pickNewPhotosText: {
    color: colors.white,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 12,
  },
  detailedInfoText: {
    color: colors.primary,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  detailedTextSub: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
    textAlign: 'center',
  },
  headingContainer: {
    marginBottom: 12,
    alignItems: 'center',
    gap: 4,
  },
  addressLabel: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
  },
  addressSelectOption: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  selectedAddressText: {
    color: colors.black,
    fontFamily: 'Comfortaa-SemiBold',
  },
  locationModalContainer: {
    margin: 0,
  },
  locationModalContentContainer: {
    backgroundColor: colors.white,
    padding: 12,
    margin: 12,
    borderRadius: 8,
    gap: 8,
  },
  formattedAddressText: {
    fontFamily: 'Comfortaa-Bold',
  },
  errorText: {
    fontFamily: 'Comfortaa-SemiBold',
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
  },
  autoFillContainer: {
    backgroundColor: colors.black_50,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  autoFillTitle: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
    color: colors.black_50,
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  autoFillText: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 12,
    color: colors.black,
  },
});
