import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  pickerButtonContainer: {
    gap: 2,
  },
  pickerLabel: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
  },
  pickerContainer: {
    gap: 2,
  },
  pickerButtonText: {
    fontFamily: 'Comfortaa-Bold',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.gray,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pickerModalContainer: {
    margin: 0,
  },
  pickerContentContainer: {
    backgroundColor: 'white',
    margin: 32,
    borderRadius: 8,
    maxHeight: '35%',
  },
  pickerModalItem: {
    padding: 12,
    alignItems: 'center',
  },
  pickerModalItemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    paddingVertical: 12,
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.black_50,
    marginVertical: 10,
    fontSize: 14,
  },
});
