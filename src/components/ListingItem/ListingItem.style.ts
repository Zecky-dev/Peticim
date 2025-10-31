import colors from '@utils/colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 4,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 12,
    backgroundColor: 'whitesmoke',
    flexDirection: 'row',
    gap: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageIconContainer: {
    top: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  title: {
    color: colors.primary,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 13,
  },
  age: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 12,
    marginTop: 6,
  },
  animalType: {
    color: colors.black_50,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoValue: {
    color: colors.black,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 11,
  },
  rightContainer: {
    flex: 1,
  },
  rightContainerTop: {
    flexDirection: 'row',
    paddingRight: 4,
    gap:6
  },
  rightContainerTopLeft: {
    flex: 1,
    flexShrink: 1,
  }



  /*
  container: {  
    
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Comfortaa-Bold',
  },
  animalBreed: {
    color: colors.white_50,
    fontSize: 14,
    fontFamily: 'Comfortaa-Bold',
  },
  infoRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoRowValue: {
    color: colors.white,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 12,
  },
  rightContainer: {
    gap: 8,
  },
  favoriteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    borderWidth: 1,
    borderColor: colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
    */


  
  /*
  container: {
    borderRadius: 12,
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
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
    borderWidth: 1,
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
    height: 200,
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
    resizeMode: 'contain',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  viewCountContainer: {
    position: 'absolute',
    top: 16,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  viewCountText: {
    fontFamily: 'Comfortaa-Light',
    fontSize: 12,
    color: colors.black_50,
  },
  */
});
