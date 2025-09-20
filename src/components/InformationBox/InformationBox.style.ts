import { StyleSheet } from 'react-native';
import colors from '@utils/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.info,
    padding: 12,
    borderRadius: 8,    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.white,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Comfortaa-Bold'    
  },
  closeButton: {
    marginLeft: 'auto',
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Comfortaa-Light'
  },
});
