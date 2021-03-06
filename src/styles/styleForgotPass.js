import {StyleSheet} from "react-native"
const style = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10

    },
    logo: {
        height: 20,
        width: 35,
        opacity: 0.5,
        marginTop: 15,
    },
    login: {
        fontSize: 25,
        fontWeight: "bold",
        color: "dodgerblue",
        marginTop: 15,
        marginLeft: 5
    },
    content: {
        justifyContent: "center",
        marginTop: 60
    },
    textinput: {
        height: 35,
        borderBottomColor: "dodgerblue",
        borderBottomWidth: 1,
        marginTop: 10,
        fontSize: 15,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: {
        height: 35,
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 25
    },
})

export default style;