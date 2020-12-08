import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, RefreshControl, StyleSheet } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import ShopingCartIcon from "../component/shopingCartIcon"
import _ from "lodash"

class Kategori extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            products: [],
            loading: false,
            refresh: false
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
            .then(() => this.getProducts())
    }
    getProducts() {
        const { category } = this.props.route.params
        this.setState({ loading: true })
        console.log(this.setState.token);
        fetch(`https://app-a-store.herokuapp.com/api/product/kategori/${category.id}`, {
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
                    this.setState({ products: responseJson.data });
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
    componentDidMount() {
        this.getToken();
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    _onRefresh = () => {
        this.setState({ refreshing: true })
    }
    render() {
        const { category, a } = this.props.route.params
        return (
            <View>
                <LinearGradient colors={["#037ffc", "#2ed5ff"]} style={{ height: 50, alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginRight: 15, marginLeft: 5 }}>
                            <Image
                                source={require("../assets/back.png")}
                                style={{ height: 25, width: 30, tintColor: "#fff" }}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, color: "#fff" }}>{category.kategori}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Card")}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                                style={style.logo}
                            />
                        </TouchableOpacity>
                        {a == 0 ? (
                            <View></View>
                        ) : (
                                <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "red", position: "absolute", top: 7, right: 9, opacity: 0.8, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 10, color: "#fff" }}>{a}</Text>
                                </View>
                            )}
                    </View>
                </LinearGradient>
                {this.state.loading ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../assets/9844-loading-40-paperplane.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <View>
                            {this.state.products == "" ? (
                                <View style={{ justifyContent: "center", alignItems: "center", marginHorizontal: 10 }}>
                                    <LottieView
                                        source={require("../assets/18037-out-of-stock.json")} autoPlay loop
                                        style={{ height: 250, width: 250 }}
                                    />
                                    <Text style={{ opacity: 0.6, textAlign: "center" }}>Mohon Maaf, Produk Dengan Kategori Ini Sudah Habis</Text>
                                </View>
                            ) : (
                                    <ScrollView
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={() => {
                                                    this.getProducts()
                                                    this._onRefresh()
                                                }}
                                            />
                                        }
                                        scrollEventThrottle={15}
                                        showsVerticalScrollIndicator={false}>
                                        <View style={style.container}>
                                            {this.state.products.map((item, index) => (
                                                <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Detail", { product: item })} style={style.background}>
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
                                                                        style={{ height: 12, width: 12, marginRight: 5, marginTop: 2 }}
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
                                                                    <Text style={{ textAlign: "right", color: "#777", fontSize: 11 }}>{item.store.kota}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <View style={{ height: 110 }}></View>
                                    </ScrollView>
                                )}
                        </View>
                    )}
            </View>
        )
    }
}

export default Kategori;

const style = StyleSheet.create({
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
    logo: {
        height: 23,
        width: 23,
        tintColor: "white",
        marginVertical: 10,
        marginRight: 10
    },
})
