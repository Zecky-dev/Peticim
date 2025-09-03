import { StyleSheet } from "react-native";
import colors from '@utils/colors';
export default StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        margin: 0,
    },
    modalContentContainer: {
        alignItems: 'center',
    },
    loadingText: {
        color: colors.white,
        fontFamily: 'Comfortaa-SemiBold',
        fontSize: 20,
        marginTop: 24,
    },
    loadingIndicator: {
        transform: [{ scale: 1.5 }]
    }
});