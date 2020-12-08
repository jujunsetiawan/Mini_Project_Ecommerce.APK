import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ToastAndroid, ScrollView } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import style from "../styles/styleLogin"

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            token: "",
            mata: true,
            loading: false,
        };
    }

    login() {
        const {email, password} = this.state;
        this.setState({loading: true})
        var dataToSend = {
            email: email,
            password: password
        };
        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch("https://app-a-store.herokuapp.com/api/login", {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            const {token} = responseJson;
            if (token) {
                AsyncStorage.setItem("token", token).then((value) => {
                    this.setState({token: value})
                    this.props.navigation.replace("Home")
                });
                ToastAndroid.show("Login Success", ToastAndroid.SHORT);
                this.setState({loading: false})
            } else {
                ToastAndroid.show("Email Atau Password Anda Salah", ToastAndroid.LONG);
                this.setState({loading: false})
            }
        })
        .catch((error) => {
            ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
            console.error(error);
            this.setState({loading: false})
        });
    }
    ubahMata = () => {
        const eye = !this.state.mata
        this.setState({ mata: eye })
    }
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
                <Text style={style.login}>Sign In</Text>
                <Image
                    source={require("../assets/logo.png")}
                    style={{height: 140, width: 140 , alignSelf: "center",marginVertical: 20, tintColor: "dodgerblue"}}
                />
                <View style={style.content}>
                    <Text style={{ marginLeft: 2, opacity: 0.6 }}>Email :</Text>
                    <View style={style.textinput}>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={require("../assets/email.png")}
                                style={{ height: 15, width: 22, tintColor: "dodgerblue", marginLeft: 2, marginTop: 5 }}
                            />
                            <TextInput
                                placeholder="Input your email"
                                selectionColor="dodgerblue"
                                color="dodgerblue"
                                keyboardType="email-address"
                                style={{ borderColor: "white", marginLeft: 5, width: "100%" }}
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </View>
                    </View>
                    <Text style={{ marginLeft: 4, marginTop: 15, opacity: 0.6 }}>Password :</Text>
                    <View style={style.textinput}>
                        <View style={{ justifyContent: "center", flexDirection: "row" }}>
                            <Image
                                source={require("../assets/gembok.png")}
                                style={{ height: 20, width: 20, tintColor: "dodgerblue", marginLeft: 2 }}
                            />
                            <TextInput
                                secureTextEntry={this.state.mata}
                                placeholder="Input your Password"
                                selectionColor="dodgerblue"
                                color="dodgerblue"
                                style={{ borderColor: "white", marginLeft: 5 }}
                                onChangeText={(password) => this.setState({ password })}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.ubahMata()}>
                            <Image
                                source={this.state.mata ? require("../assets/eyeClosed.png") : require("../assets/eyeOpened.png")}
                                style={{ height: 15, width: 23, tintColor: "dodgerblue", marginTop: 7 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.login()}>
                        <LinearGradient style={style.button} colors={["#037ffc", "#2ed5ff"]}>
                        {this.state.loading ? (
                            <LottieView source={require("../assets/890-loading-animation.json")} style={{height: 70, width: 50, marginTop: 2}} autoPlay loop/>
                        ) : (<Text style={{ color: "white" }}>Login</Text>)}            
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Forgot")} style={{ alignItems: "flex-end", marginRight: 10, marginBottom: 115 }}>
                        <Text style={{ color: "dodgerblue" }}>Forgot Your Password ?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")} style={{ alignSelf: "center" }}>
                        <Text style={{ color: "dodgerblue" }}>Don't have a account ? REGISTER NOW</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        )
    }
}

export default Login
