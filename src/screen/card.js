import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, TouchableNativeFeedback, StyleSheet, ScrollView, RefreshControl, Alert, ToastAndroid } from 'react-native'
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import LinearGradient from "react-native-linear-gradient"
import _ from "lodash"

class Card extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            cart: [],
            modal: false,
            refresh: false,
            loading: false,
            angka: 1,
            ket: ""
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
            .then(() => this.getProduct())
    }
    getProduct() {
        this.setState({ loading: true })
        console.log(this.setState.token);
        fetch("https://app-a-store.herokuapp.com/api/cart", {
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
                    this.setState({
                        cart: responseJson.data,
                    });
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
    deleteCart(id) {
        this.setState({ loading: true });
        fetch(`https://app-a-store.herokuapp.com/api/cart/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.token}`,
            },
        })

            .then((response) => response.json())
            .then((json) => {
                const { status } = json;
                console.log(json);
                if (status == "success") {
                    ToastAndroid.show("Berhasil Menghapus", ToastAndroid.SHORT);
                    this.getProduct()
                } else {
                    alert("gagal menghapus")
                }
            })
            .catch((error) => console.log(error))
    }
    alertCart(id) {
        Alert.alert(
            'Peringatan',
            'Apakah Anda Yakin Ingin Meghapus Produk Ini Dari Keranjang ?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                },
                { text: 'Hapus', onPress: () => this.deleteCart(id) },
            ],
            { cancelable: false },
        );
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    componentDidMount() {
        this.getToken();
    }
    showModal(visible) {
        this.setState({ modal: visible });
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    render() {
        return (
            <View>
                <LinearGradient style={style.header} colors={["#037ffc", "#2ed5ff"]}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image
                                    source={require("../assets/back.png")}
                                    style={{ height: 25, width: 30, tintColor: "#fff", marginLeft: 5}}
                                />
                            </TouchableOpacity>
                            <Text style={style.title}>Keranjang Saya</Text>
                        </View>
                    </View>
                </LinearGradient>
                <View>
                    {this.state.cart == null ? (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <LottieView
                                source={require("../assets/30214-cash-back-reward-daapapp.json")} autoPlay loop
                                style={{ height: 250, width: 250 }}
                            />
                            <Text style={{ opacity: 0.6 }}> Keranjang Anda Kosong, Ayo Belanja Sekarang ! </Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Home", { screen: "Home" })} style={style.tombol}>
                                <Text style={{ color: "dodgerblue" }}>Belanja Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View>
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
                                                        this.getProduct()
                                                        this.setState({ refresh: true })
                                                    }}
                                                />
                                            }
                                            scrollEventThrottle={15}
                                            showsVerticalScrollIndicator={false}>
                                            {this.state.cart.map((item, index) => (
                                                <TouchableNativeFeedback
                                                    onLongPress={() => this.alertCart(item.id)}
                                                    onPress={() => this.props.navigation.navigate("Detol", { produk: item })} key={index}>
                                                    <View style={style.cont}>
                                                        <View style={style.container}>
                                                            <Image
                                                                source={{ uri: item.product.thumbnail }}
                                                                style={style.image} />
                                                        </View>
                                                        <View style={style.contText}>
                                                            <Text numberOfLines={1} style={style.text}>{item.product.nm_barang}</Text>
                                                            <Text numberOfLines={1} style={style.text}>Keterangan : {item.keterangan}</Text>
                                                            <Text style={[style.text, { color: "dodgerblue" }]}>Rp {this.toPrice(item.harga)}</Text>
                                                            <Text style={style.text}>jumlah Pesanan : {item.jumlah}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            ))}
                                        </ScrollView>
                                    )}
                            </View>
                        )}
                </View>
            </View>
        )
    }
}

export default Card

const style = StyleSheet.create({
    header: {
        height: 45,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 2.5
    },
    title: {
        fontSize: 22,
        color: "white",
        marginLeft: 10
    },
    cont: {
        marginVertical: 3,
        flexDirection: "row",
        // shadowColor: "#999",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 5,
        marginHorizontal: 7,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    image: {
        height: 110,
        width: 110,
        backgroundColor: "#000",
        borderRadius: 5
    },
    container: {
        flex: 1
    },
    contText: {
        flex: 2,
        padding: 5,
    },
    text: {
        marginVertical: 2.5
    },
    contKet: {
        marginVertical: 5,
        height: 25,
        backgroundColor: "#fff",
        justifyContent: "center",
        borderRadius: 3,
    },
    modalbtn: {
        height: "60%",
        backgroundColor: "#222",
        opacity: 0.2
    },
    modal: {
        height: "40%",
        width: "100%",
        backgroundColor: "#f5f5f5"
    },
    gambar: {
        height: 100,
        width: 100,
        borderRadius: 5
    },
    button: {
        height: 30,
        width: 30,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        borderWidth: 1,
        height: 30,
        width: 50,
        textAlign: "center",
        padding: 0
    },
    tmb: {
        height: 35,
        width: "67%",
        backgroundColor: "dodgerblue",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginRight: 7
    },
    textInput: {
        padding: 0,
        marginLeft: 5
    },
    contInput: {
        height: 27,
        width: 108,
        backgroundColor: "#fff",
        borderRadius: 3,
        marginTop: 5
    },
    tombol: {
        height: 35,
        width: "60%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "dodgerblue",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15
    }
})
