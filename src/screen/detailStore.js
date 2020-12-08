import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import _ from "lodash"

class detailStore extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            produk: [],
            store: {},
            loading: false,
            refresh: false
        }
    }
    componentDidMount() {
        AsyncStorage.getItem("token")
            .then((token) => {
                if (token !== null) {
                    this.setState({ token: token })
                } else {
                    this.logOut();
                }
            })
            .then(() => this.getProduk())
    }
    getProduk() {
        const { id } = this.props.route.params
        this.setState({ loading: true })
        console.log(this.setState.token);
        fetch(`https://app-a-store.herokuapp.com/api/store/${id.store_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${this.state.token}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson))
                const { status } = responseJson;
                if (status) {
                    this.setState({ produk: responseJson.data[1], store: responseJson.data[0] });
                    this.setState({ loading: false });
                    console.log(responseJson);
                } else {
                    this.logOut();
                    this.setState({ loading: false });
                }
                this.setState({ refreshing: false })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ refreshing: false })
            });
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    _onRefresh = () => {
        this.setState({ refreshing: true })
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    render() {
        const { id, notif } = this.props.route.params
        return (
            <View>
                <LinearGradient style={style.header} colors={["#037ffc", "#2ed5ff"]}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image
                                    source={require("../assets/back.png")}
                                    style={style.logo1}
                                />
                            </TouchableOpacity>
                            <Text style={style.title}>Detail Toko</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Card")}>
                                <Image
                                    source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                                    style={style.logo}
                                />
                            </TouchableOpacity>
                            {notif == 0 ? (
                                <View></View>
                            ) : (
                                    <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "red", position: "absolute", top: 7, right: 7, opacity: 0.8, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ fontSize: 10, color: "#fff" }}>{notif}</Text>
                                    </View>
                                )}
                        </View>
                    </View>
                </LinearGradient>
                <View style={style.container}>
                    <Image
                        source={{ uri: id.store.thumbnail }}
                        style={style.image}
                    />
                    <Text style={style.toko}>{id.store.nm_toko}</Text>
                    <Text style={{ fontSize: 12, opacity: 0.4, marginTop: 3, textAlign: "center", marginBottom: 13 }}>{id.store.alamat}</Text>
                </View>
                <View style={style.cont}>
                    <Text numberOfLines={1} style={{ marginVertical: 6, marginLeft: 10 }}>Pemilik Toko : {id.store.pemilik_rekening}</Text>
                    <Text style={{ marginVertical: 6, marginLeft: 10 }}>Nomer Telephone : {id.store.no_telepon}</Text>
                    <Text style={{ marginVertical: 6, marginLeft: 10 }}>Kode Pos : {id.store.kd_pos}</Text>
                    <Text style={{ marginVertical: 6, marginLeft: 10 }}>Kota : {id.store.kota}</Text>
                </View>
                {this.state.loading ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../assets/9844-loading-40-paperplane.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this.getProduk()
                                        this._onRefresh()
                                    }}
                                />
                            }
                            scrollEventThrottle={15}
                            showsVerticalScrollIndicator={false}>
                            <View style={style.container1}>
                                {this.state.produk.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Detil", { product: item, store: this.state.store })} style={style.background}>
                                        <Image
                                            source={{ uri: item.thumbnail }}
                                            style={{ height: 120, width: null, borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
                                        />
                                        <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
                                            <Text numberOfLines={2} style={{ fontSize: 14 }}>{item.nm_barang}</Text>
                                            <Text style={{ color: "dodgerblue", marginTop: 5, fontSize: 14 }}>Rp.{this.toPrice(item.harga)}</Text>
                                            <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                    <TouchableOpacity>
                                                        <Image
                                                            source={require("../assets/star.png")}
                                                            style={{ height: 13, width: 13 }}
                                                        />
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Image
                                                            source={require("../assets/favourites.png")}
                                                            style={{ height: 10, width: 10, marginRight: 5, marginTop: 2 }}
                                                        />
                                                        {item.terjual == null ? (
                                                            <Text style={{ color: "#888", fontSize: 10 }}>Terjual 0</Text>
                                                        ) : (
                                                                <Text style={{ color: "#888", fontSize: 10 }}>Terjual {item.terjual}</Text>
                                                            )}
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View></View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Image
                                                            source={require("../assets/map-placeholder.png")}
                                                            style={{ height: 10, width: 10, marginRight: 3, opacity: 0.5, marginTop: 3 }}
                                                        />
                                                        <Text style={{ textAlign: "right", color: "#777", fontSize: 11 }}>{id.store.kota}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={{ height: 360 }}></View>
                        </ScrollView>
                    )}
            </View>
        )
    }
}

export default detailStore;

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
        marginVertical: 10,
        marginRight: 7
    },
    logo1: {
        height: 25,
        width: 35,
        tintColor: "white",
        marginLeft: 5
    },
    title: {
        fontSize: 20,
        color: "white",
        marginLeft: 10
    },
    image: {
        height: 70,
        width: 80,
        borderColor: "#f0f0f0",
        borderWidth: 1,
        borderRadius: 40,
        marginVertical: 10

    },
    container: {
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomWidth: 0.3,
        borderColor: "#9e9e9e"

    },
    toko: {
        fontSize: 20,
    },
    cont: {
        backgroundColor: "#fff",
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 0.2,
        borderColor: "#9e9e9e"
    },
    container1: {
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
})
