import { StyleSheet } from "react-native"
const style = StyleSheet.create({
    header: {
        height: 45,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    logo: {
        height: 23,
        width: 23,
        tintColor: "white",
    },
    logo1: {
        height: 40,
        width: 40,
        tintColor: "white",
        marginLeft: 5
    },
    logo2: {
        height: 24,
        width: 24,
        tintColor: "white",
        marginRight: 10
    },
    search: {
        height: 20,
        width: 20,
        opacity: 0.6,
        marginLeft: 5
    },
    title: {
        fontSize: 22,
        color: "white",
        marginLeft: 5
    },
    sliderContainer: {
        height: 200,
        width: "100%",
        // marginVertical: 10,
        justifyContent: "center",
        alignSelf: "center",
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    sliderImage: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
    },
    categoryContainer: {
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        marginTop: 25,
        marginBottom: 10
    },
    categoryIcon: {
        borderWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        height: 70,
        width: 70,
        backgroundColor: "#d7effc",
        borderRadius: 50
    },
    categoryBtn: {
        flex: 1,
        width: "30%",
        marginHorizontal: 0,
        alignSelf: "center"
    },
    categoryBtnTxt: {
        alignSelf: "center",
        marginTop: 5,
        color: "#037ffc"
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    background: {
        height: 240,
        width: "47.2%",
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 5,
        borderWidth: 0.2,
        borderColor: "#9e9e9e"
    },
    text: {
        // alignSelf: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 5,
        marginLeft: 10,
        marginTop: 20
    },
    contsrch: {
        height: 30,
        width: "59%",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginLeft: 10,
        alignItems: "center",
        flexDirection: "row"
    }
})

export default style;