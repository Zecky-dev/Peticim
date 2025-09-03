import colors from "@utils/colors";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    inputContainer: {
        flex: 1,
        gap: 4,
    },
    registerText: {
        color: colors.primary,
        fontFamily: 'Comfortaa-Bold',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 24,
    },
    backButtonContainer: {
        position: "absolute",
        top: 32,
        left: 24,
    },
    form: {
        gap: 8,
    }

});