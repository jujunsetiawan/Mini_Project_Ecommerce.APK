import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import style from "../styles/styleForgotPass"

class Forgot extends Component {
    render() {
        return (
            <View style={style.container}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Image
                        source={require("../assets/back.png")}
                        style={style.logo}
                    />
                </TouchableOpacity>
                <Text style={style.login}>Forgot Your Password ?</Text>
                <View style={style.content}>
                <Image
                    source={require("../assets/gembok.png")}
                    style={{height: 100, width: 100, alignSelf: "center", tintColor: "dodgerblue", marginBottom: 30}}
                />
                    <Text style={{ textAlign: "center", color: "dodgerblue", marginBottom: 20 }}>We just need your registered email address to send you password reset.</Text>
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
                            />
                        </View>
                    </View>
                    <TouchableOpacity>
                        <LinearGradient style={style.button} colors={["#037ffc", "#2ed5ff"]}>
                            <Text style={{ color: "white" }}>Verify</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Forgot;