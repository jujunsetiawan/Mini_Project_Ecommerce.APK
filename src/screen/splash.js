import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ActivityIndicator} from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import LottieView from "lottie-react-native"
import Navigation from "../route/navigation"
import AsyncStorage from '@react-native-community/async-storage'

class Splash extends Component {
    constructor() {
        super();
        this.state={
            token: "",
        }
        setTimeout(() => {
            AsyncStorage.getItem("token").then((value) => {
               if(value !== null) {
                this.setState({token: value})
                console.log(this.state.token);
                this.props.navigation.replace("Home",{screen: "Home"})
               } else {
                   this.props.navigation.replace("Intro")
               }
            }) .catch((error) => console.log(error))
        }, 3500);
    }
    render() {
            return (
                <LinearGradient colors={["#037ffc","#2ed5ff"]} style={style.container}>
                    <LottieView source={require("../assets/18168-stay-safe-stay-home.json")} autoPlay loop />
                </LinearGradient>
            )
    }
}

export default Splash

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})
