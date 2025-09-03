import colors from "@utils/colors";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 6,
    },
    checkboxButton: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderColor: colors.primary,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontFamily: 'Comfortaa-Bold',
        bottom: 2,
    }
});