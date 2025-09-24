import colors from "@utils/colors";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        borderColor: colors.primary,
        borderWidth: 1,
        padding: 4,
        alignSelf: 'flex-start',
        borderRadius: 24,
        paddingHorizontal: 10,
    },
    text: {
        color: colors.primary,
        fontFamily: 'Comfortaa-Regular',
        fontSize: 12,
    },
    selectedContainer: {
        backgroundColor: colors.primary,
    },
    selectedText: {
        color: colors.white,
    }
});