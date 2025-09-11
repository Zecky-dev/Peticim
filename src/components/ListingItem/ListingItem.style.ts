import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    color: colors.white,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16,
    flex: 1,
  },
  breed: {
    color: colors.white_50,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
  },
  favoriteButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.error,
  },
  infoContainer: {
    backgroundColor: colors.primary,
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flex: 1,
  },
  infoTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoRowContainer: {
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  infoRowLabel: {
    fontFamily: 'Comfortaa-SemiBold',
    color: colors.white,
    fontSize: 13,
  },
  infoRowsContainer: { gap: 4, justifyContent: 'center' },
  imageContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fullScreenModalContainer: {
    
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
});
