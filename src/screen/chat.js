import React, { Component } from 'react';
import { Text, View, Image, Modal, ImageBackground, TextInput, TouchableOpacity, Animated, ScrollView, StyleSheet, ActivityIndicator, Platform, Alert, RefreshControl } from 'react-native';
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import ShopingCartIcon from "../component/shopingCartIcon"

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            loading: false,
            refresh: false,
            kontak: [],
            notiv: []
        }
    }
    getToken() {
        AsyncStorage.getItem("token")
            .then((token) => {
                if (token !== null) {
                    this.setState({ token: token })
                } else {
                    this.logOut();
                }
            })
            .then(() => this.getKontak());
    }
    getKontak() {
        console.log(this.state.token);
        this.setState({ loading: true })
        fetch("https://app-a-store.herokuapp.com/api/pesan", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${this.state.token}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.data)
                const { status } = responseJson;
                if (status) {
                    this.setState({ kontak: responseJson.data.user });
                    this.setState({ notiv: responseJson.data.notif });
                    this.setState({ loading: false })
                } else {
                    this.logOut();
                }
            })
            .catch((error) => {
                console.error(error);
                alert("error")
            });
    }
    componentDidMount() {
        this.getToken()
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.replace('Login');
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
        return (
            <View>
                <LinearGradient style={style.header} colors={["#009387", "#25f53a"]}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require("../assets/logo.png")}
                                style={style.logo1}
                            />
                            <Text style={style.title}>A-Store</Text>
                        </View>
                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("Card")}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                                style={style.logo}
                            />
                        </TouchableOpacity> */}
                    </View>
                </LinearGradient>
                {this.state.loading ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../assets/9844-loading-40-paperplane.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <View>
                            {this.state.kontak == "" ? (
                                <View style={{ justifyContent: "center", alignItems: "center", marginHorizontal: 10 }}>
                                    <LottieView
                                        source={require("../assets/36546-live-chating.json")} autoPlay loop
                                        style={{ height: 250, width: 250 }}
                                    />
                                    <Text style={{ opacity: 0.6, textAlign: "center" }}>Kontak Kosong</Text>
                                </View>
                            ) : (
                                    <ScrollView
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={() => {
                                                    this.getKontak()
                                                    this.setState({ refresh: true })
                                                }}
                                            />
                                        }
                                        showsVerticalScrollIndicator={false}>
                                        {this.state.kontak.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Chet", { kontak: item })} style={style.cont}>
                                                <Image
                                                    source={{ uri: item.avatar }}
                                                    style={style.avatar}
                                                />
                                                <View style={{ height: 70, width: "60%", borderBottomColor: "#f0f0f0", justifyContent: "center", borderBottomWidth: 1 }}>
                                                    <View style={{ marginBottom: 10 }}>
                                                        <Text numberOfLines={1} style={{ fontSize: 17, marginVertical: 3 }}>{item.name}</Text>
                                                        <Text numberOfLines={1} style={{ fontSize: 13, opacity: 0.4 }}>{item.email}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ height: 70, width: "20%", borderBottomWidth: 1, borderBottomColor: "#f0f0f0", alignItems: "center" }}>
                                                    <Text style={{ opacity: 0.4, marginTop: 15, fontSize: 13 }}>{this.newJam()} : {this.newMenit()}</Text>
                                                    {this.state.notiv.map((value, index) => (
                                                        <View key={index}>
                                                            {value.id == item.id ? (
                                                                <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: "#009387", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                                                                    <Text style={{ color: "#fff", fontSize: 12 }}>{value.unread}</Text>
                                                                </View>
                                                            ) : (
                                                                    <View></View>
                                                                )}
                                                        </View>
                                                    ))}
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                        </View>
                    )}
            </View>
        )
    }
}

export default Chat;

const style = StyleSheet.create({
    header: {
        height: 45,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    logo1: {
        height: 40,
        width: 40,
        tintColor: "white",
        marginLeft: 5
    },
    title: {
        fontSize: 22,
        color: "white",
        marginLeft: 10
    },
    avatar: {
        height: 55,
        width: "15.5%",
        borderRadius: 30,
        marginHorizontal: 10
    },
    cont: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    logo: {
        height: 23,
        width: 23,
        tintColor: "white",
        marginVertical: 10,
        marginRight: 7
    },
})
