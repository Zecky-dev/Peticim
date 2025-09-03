import colors from "@utils/colors";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 92,
        height: 92,
    },
    plusContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameSurname: {

    },
})