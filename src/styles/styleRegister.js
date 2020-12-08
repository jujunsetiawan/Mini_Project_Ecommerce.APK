import {StyleSheet} from "react-native"
const style = StyleSheet.create({
    container: {
        // flex: 1,
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
        marginLeft: 5,
        marginBottom: 60
    },
    content: {
        // flex: 1,
        justifyContent: "center"
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
        marginHorizontal: 10
    },
    forgot: {
        textAlign: "center",
        color: "dodgerblue",
        marginTop: 10
    }
})

export default style;