import React, { Component } from 'react';
import { Text, View, Image, Modal, ImageBackground, TextInput, TouchableOpacity, Animated, ScrollView, StyleSheet, ActivityIndicator, Platform, Alert, RefreshControl } from 'react-native';
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import Pusher from "pusher-js/react-native"
import _ from "lodash"

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: "",
            chatMessage: [],
            token: "",
            wait: false,
            dari: {}
        }
    }
    componentDidMount() {
        this.getToken()
        Pusher.logToConsole = true;

        var pusher = new Pusher("181fcc3c876309e9f9d4", {
            cluster: "ap1"
        })
        var channel = pusher.subscribe("my-channel");
        channel.bind("my-event", (data) => {
            this.setState({ loading: true })
            this.setState({ wait: true })
            this.getMessage()
            this.setState({ wait: false })
            this.setState({ message: "" })
        })
    }
    getToken() {
        AsyncStorage.getItem("token")
            .then((token) => {
                if (token !== null) {
                    this.setState({ token: token })
                    this.getMessage()
                } else {
                    this.logOut();
                }
            })
    }
    getMessage() {
        const { kontak } = this.props.route.params
        this.setState({ wait: true })
        console.log(this.state.token);
        fetch(`https://app-a-store.herokuapp.com/api/pesan/${kontak.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${this.state.token}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                const { status } = responseJson;
                if (status) {
                    this.logOut();
                } else {
                    this.setState({ chatMessage: responseJson.pesan.sort((a, b) => a.id - b.id) });
                    this.setState({ dari: responseJson.pesan[0] });
                    this.setState({ loading: false })
                    this.setState({ wait: false })
                }
            })
            .catch((error) => {
                console.error(error);
                alert("error")
            });
    }
    sendMessage() {
        const { kontak } = this.props.route.params
        const { message, token } = this.state;
        if (message !== "") {
            const kirim = {
                pesan: message,
            };
            fetch(`https://app-a-store.herokuapp.com/api/pesan/kirim/${kontak.id}`, {
                method: 'POST',
                body: JSON.stringify(kirim),
                headers: {
                    // Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                })
                .catch((error) => {
                    console.log("upload error", error);
                })
        }
    }
    newJam() {
        var tanggal = new Date();
        return tanggal.getHours();
    }

    newMenit() {
        var tanggal = new Date();
        return tanggal.getMinutes();
    }
    render() {
        const { kontak } = this.props.route.params
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient style={style.header} colors={["#009387", "#25f53a"]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image
                                source={require("../assets/back.png")}
                                style={style.logo}
                            />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: kontak.avatar }}
                            style={{ height: 50, width: 50, borderRadius: 25 }}
                        />
                        <View style={{ marginTop: 5, marginLeft: 10, width: "70%" }}>
                            <Text numberOfLines={1} style={style.title}>{kontak.name}</Text>
                            {this.state.loading && this.state.dari.to !== kontak.id ? (
                                <Text style={{ fontSize: 13, color: "#fff", marginVertical: 3 }}>Mengetik...</Text>
                            ) : (
                                    <Text style={{ fontSize: 13, color: "#fff", marginVertical: 3 }}>Online</Text>
                                )}
                        </View>
                    </View>
                </LinearGradient>
                {this.state.wait ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../assets/36546-live-chating.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                ref={(ref) => {
                                    this.scrollView = ref;
                                }}
                                onContentSizeChange={() => {
                                    this.scrollView.scrollToEnd({ animated: false })
                                }}
                                showsVerticalScrollIndicator={false}
                                style={{ flex: 1 }}>
                                {this.state.chatMessage.map((item, index) => (
                                    <View key={index}>
                                        {item.to == kontak.id ? (
                                            <View>
                                                <Text style={{ textAlign: "right", fontSize: 12, opacity: 0.4, marginRight: 10, marginTop: 5 }}>{item.created_at}</Text>
                                                <View style={style.containermessage}>
                                                    <Text style={{ color: "white", marginRight: 25 }}>{item.message}</Text>
                                                    {item.is_read == 0 ? (
                                                        <Image
                                                            source={require("../assets/check-symbol.png")}
                                                            style={{ height: 10, width: 10, tintColor: "white", alignSelf: "flex-end" }}
                                                        />
                                                    ) : (
                                                            <Image
                                                                source={require("../assets/doublecheklist.png")}
                                                                style={{ height: 15, width: 15, tintColor: "white", alignSelf: "flex-end" }}
                                                            />
                                                        )}
                                                </View>
                                            </View>
                                        ) : (
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontSize: 12, opacity: 0.4, marginTop: 5 }}>{item.created_at}</Text>
                                                    <View style={style.containermessages}>
                                                        <Text style={{ marginRight: 25 }}>{item.message}</Text>
                                                        <Text style={{ alignSelf: "flex-end", fontSize: 10, opacity: 0.5 }}>{this.newJam()} : {this.newMenit()}</Text>
                                                    </View>
                                                </View>
                                            )}
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ marginBottom: 10 }}>
                                <View style={style.massage}>
                                    <TouchableOpacity style={{ marginBottom: 15, alignSelf: "flex-end" }}>
                                        <Image
                                            source={require("../assets/emoticon.png")}
                                            style={style.logo1}
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        autoCorrect={false}
                                        onSubmitEditing={() => this.sendMessage()}
                                        value={this.state.message}
                                        onChangeText={(message) => this.setState({ message })}
                                        returnKeyType="send"
                                        multiline={true}
                                        placeholder="Ketikan Pesan"
                                        style={style.textinput} />
                                    <TouchableOpacity style={{ marginBottom: 15, alignSelf: "flex-end" }}>
                                        <Image
                                            source={require("../assets/attachmen.png")}
                                            style={style.logo1} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginBottom: 15, alignSelf: "flex-end" }}>
                                        <Image
                                            source={require("../assets/voice.png")}
                                            style={style.logo1}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => this.sendMessage()} style={style.send}>
                                    <Image
                                        source={require("../assets/sendbutton.png")}
                                        style={style.logo2}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
            </View>
        )
    }
}

export default Chat;

const style = StyleSheet.create({
    header: {
        height: 60,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 2.5
    },
    logo: {
        height: 25,
        width: 35,
        tintColor: "white",
        marginHorizontal: 5
    },
    title: {
        fontSize: 16,
        color: "white",
    },
    logo1: {
        height: 20,
        width: 20,
        tintColor: "grey",
        marginLeft: 10,
        marginTop: 15
    },
    logo2: {
        height: 20,
        width: 20,
        tintColor: "dodgerblue",
        marginLeft: 5
    },
    massage: {
        // height: 40,
        maxHeight: 150,
        width: "80.5%",
        backgroundColor: "white",
        bottom: 0,
        left: 10,
        borderRadius: 10,
        flexDirection: "row",
        // alignItems: "center",
    },
    textinput: {
        marginLeft: 10,
        fontSize: 16,
        width: "65%",
        padding: 0,
        borderColor: "#fff"
        // height: 40
    },
    send: {
        position: "absolute",
        bottom: 0,
        right: 5,
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    containermessage: {
        padding: 5,
        maxWidth: "70%",
        alignSelf: "flex-end",
        backgroundColor: "#009387",
        borderRadius: 5,
        marginVertical: 5,
        marginRight: 10,
    },
    containermessages: {
        padding: 5,
        maxWidth: "70%",
        alignSelf: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        marginLeft: 10
    }
})