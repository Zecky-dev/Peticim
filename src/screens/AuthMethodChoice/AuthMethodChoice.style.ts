import colors from "@utils/colors";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 12,
        gap: 20,
        backgroundColor: colors.white,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
    chooseLoginMethodText: {
        fontFamily: 'Comfortaa-Bold',
        fontSize: 20,
        color: colors.primary,
        textAlign: 'center',
    },
    buttonsContainer: {
        gap: 12,
    }
});