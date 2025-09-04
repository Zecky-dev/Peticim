import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  plusContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
    borderWidth: 1,
  },
  nameSurname: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16,
  },
  profileButton: {
    backgroundColor: colors.primary,
    padding: 12,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
  },
  profileButtons: {
    gap: 12,
    marginTop: 4,
  },
  profileButtonText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 12,
    color: colors.white,
  },
  modalContainer: {
    margin: 0,
  },
  modalContent: {
    justifyContent: 'center',
    width: '85%',
    alignSelf: 'center',
    padding: 12,
  },
  modalButtonsContainer: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  modalTitleContainer: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    color: colors.white,
    fontFamily: 'Comfortaa-Bold',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
  },
  pickOptionText: {
    color: colors.black,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 13,
  },
  optionButton: {
    alignItems: 'center',
    padding: 12,
  },
});
