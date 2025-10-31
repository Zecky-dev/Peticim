import { StyleSheet } from "react-native";
import colors from '@utils/colors'
export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    nameSurname: {
        fontFamily: 'Comfortaa-Bold',
        fontSize: 18,
    },
    topContainer: {
        alignItems: 'center',
        gap: 8,
    },
    listingLength: {
        textAlign: 'center',
        fontFamily: 'Comfortaa-SemiBold',
        color: colors.black_50,
    },
    bioText: {
        fontFamily: 'Comfortaa-SemiBold',
        textAlign: 'center',
        fontSize: 13,
    },
    divider: {
        height: 12,
    },
    backButtonContainer: {
        position: "absolute",
    },
});