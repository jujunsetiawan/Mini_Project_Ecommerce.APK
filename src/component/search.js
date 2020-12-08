import React, { Component } from 'react'
import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import ShopingCartIcon from "../component/shopingCartIcon"
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import _ from "lodash"

class Search extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            loading: false,
            refresh: false,
            search: "",
            products: []
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
    }
    Search() {
        const { search, token } = this.state
        this.setState({ loading: true })
        if (search !== "") {
            const card = {
                cari: search,
            }
            console.log(this.state.token)
            fetch(`https://app-a-store.herokuapp.com/api/product/search`, {
                method: 'POST',
                body: JSON.stringify(card),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    this.setState({ products: response.data })
                    this.setState({ loading: false });
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Terjadi Kesalahan Silahkan Coba Lagi Nanti", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            this.setState({ loading: false })
        }
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
        const {a} = this.props.route.params
        return (
            <View>
                <View style={{ height: 50, backgroundColor: "#fff", alignItems: "center", flexDirection: "row", marginBottom: 3 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginRight: 15, marginLeft: 5 }}>
                        <Image
                            source={require("../assets/back.png")}
                            style={{ height: 25, width: 30 }}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Cari Barang"
                        selectionColor="dodgerblue"
                        keyboardType="web-search"
                        onSubmitEditing={() => this.Search()}
                        onChangeText={(search) => this.setState({ search })}
                        autoFocus={true}
                        returnKeyType="search"
                        style={{ marginLeft: 5, borderColor: "#fff", padding: 0, width: "76%", fontSize: 15 }}
                    />
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Card")}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                            style={{ height: 23, width: 23, opacity: 0.5 }}
                        />
                    </TouchableOpacity>
                    {a == 0 ? (
                        <View></View>
                    ) : (
                            <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "red", position: "absolute", top: 9.5, right: 9, opacity: 0.8, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 10, color: "#fff" }}>{a}</Text>
                            </View>
                        )}
                </View>
                {this.state.loading ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../assets/38287-scanning-searching-for-data.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Sedang Mencari ...</Text>
                    </View>
                ) : (
                        <View>
                            <ScrollView
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
                        </View>
                    )}
            </View>
        )
    }
}

export default Search;

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
})
