import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import Onboarding from "react-native-onboarding-swiper"
import LottieView from "lottie-react-native"

class Intro extends Component {
    render() {
        return (
            <Onboarding
                skipLabel="Lewati"
                nextLabel="Selanjutnya"
                pages={[
                    {
                        backgroundColor: "dodgerblue",
                        image: <Image source={require("../assets/logo.png")} style={[style.logo, { tintColor: "white" }]} />,
                        title: "Welcome to A-Store",
                        subtitle: "Enjoy the experience",
                    },
                    {
                        backgroundColor: "dodgerblue",
                        image: <LottieView source={require("../assets/22700-online-shopping-mobile-shopping.json")} style={style.logo} autoPlay loop />,
                        title: "Shop Now",
                        subtitle: "Belanja Puas Harga Pas",
                    },
                    {
                        backgroundColor: "dodgerblue",
                        image: <LottieView source={require("../assets/30826-online-shopping.json")} style={style.logo} autoPlay loop />,
                        title: "Hight Quality Product",
                        subtitle: "Barang Original, Kualitas terbaik",
                    },
                    {
                        backgroundColor: "dodgerblue",
                        image: <LottieView source={require("../assets/13893-eco-living.json")} style={style.logo} autoPlay loop />,
                        title: "Hight Quality Service",
                        subtitle: "Pengiriman Cepat, Aman dan Amanah",
                    },
                    {
                        backgroundColor: "dodgerblue",
                        image: <LottieView source={require("../assets/31677-online-shopping.json")} style={style.logo} autoPlay loop />,
                        title: "Big Sale",
                        subtitle: "Ada Promo Di Setiap Bulannya",
                    },
                ]}
                onDone={() => this.props.navigation.replace("Login")}
                onSkip={() => this.props.navigation.replace("Login")}
            />
        )
    }
}

export default Intro;

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        height: 200,
        width: 200
    }
})
