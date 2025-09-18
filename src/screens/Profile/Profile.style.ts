import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  plusContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 20,
  },
  email: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16, 
  },
  profileButton: {
    backgroundColor: colors.primary,
    padding: 12,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
  },
  profileButtons: {
    gap: 12,
    marginTop: 4,
  },
  profileButtonText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
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
  }
});
