import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import LottieView from "lottie-react-native"
import style from "../styles/styleRegister"

class Register extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            cekPassword: true,
            confirmCekPassword: true,
            mata: true,
            eye: true,
            loading: false
        }
    }
    register() {
        const { username, email, password, confirmPassword } = this.state;
        this.setState({ loading: true })

        var dataToSend = {
            username: username,
            email: email,
            password: password,
            password_confirmation: confirmPassword
        };

        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch("https://app-a-store.herokuapp.com/api/register", {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            }
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(responseJSON);
                const { token } = responseJSON;
                if (token) {
                    ToastAndroid.show("Register Success", ToastAndroid.SHORT);
                    this.props.navigation.goBack();
                    this.setState({ loading: false })
                } else {
                    ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
                this.setState({loading: false})
            });
    }
    ubahMata = () => {
        const eye = !this.state.mata
        this.setState({ mata: eye })
    }
    ubahEye = () => {
        const mata = !this.state.eye
        this.setState({ eye: mata })
    }
    render() {
        return (
            <View style={style.container}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Image
                        source={require("../assets/back.png")}
                        style={style.logo}
                    />
                </TouchableOpacity>
                <Text style={style.login}>Sign Up</Text>
                <View style={style.content}>
                    <Text style={{ marginLeft: 2, opacity: 0.6 }}>Name :</Text>
                    <View style={style.textinput}>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={require("../assets/orang.png")}
                                style={{ height: 20, width: 20, tintColor: "dodgerblue", marginLeft: 2 }}
                            />
                            <TextInput
                                placeholder="Username"
                                selectionColor="dodgerblue"
                                color="dodgerblue"
                                style={{ borderColor: "white", marginLeft: 5, width: "100%" }}
                                onChangeText={(username) => this.setState({ username })}
                            />
                        </View>
                    </View>
                    <Text style={{ marginLeft: 2, marginTop: 15, opacity: 0.6 }}>Email :</Text>
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
                    <Text style={{ marginLeft: 4, marginTop: 15, opacity: 0.6 }}>Confirm Password :</Text>
                    <View style={style.textinput}>
                        <View style={{ justifyContent: "center", flexDirection: "row" }}>
                            <Image
                                source={require("../assets/gembok.png")}
                                style={{ height: 20, width: 20, tintColor: "dodgerblue", marginLeft: 2 }}
                            />
                            <TextInput
                                secureTextEntry={this.state.eye}
                                placeholder="Input your Password"
                                selectionColor="dodgerblue"
                                color="dodgerblue"
                                style={{ borderColor: "white", marginLeft: 5 }}
                                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.ubahEye()}>
                            <Image
                                source={this.state.eye ? require("../assets/eyeClosed.png") : require("../assets/eyeOpened.png")}
                                style={{ height: 15, width: 23, tintColor: "dodgerblue", marginTop: 7 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.register()}>
                        <LinearGradient style={style.button} colors={["#037ffc", "#2ed5ff"]}>
                            {this.state.loading ? (
                                <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                            ) : (
                                    <Text style={{ color: "white" }}>Register</Text>
                                )}
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                        <Text style={style.forgot}>You have account ? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Register
