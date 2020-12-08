import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import _ from "lodash"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"

class confirmPay extends Component {
    constructor() {
        super();
        this.state = {
            token: ""
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
    confirmPay() {
        const { produk } = this.props.route.params
        const { token } = this.state;
        this.setState({ loading: true })
        const method = {
            _method: "PUT"
        }
        fetch(`https://app-a-store.herokuapp.com/api/confirmpay/${produk.id}`, {
            method: 'POST',
            body: JSON.stringify(method),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) console.log("upload succses", response);
                ToastAndroid.show("Barang Berhasil Di terima", ToastAndroid.SHORT);
                this.setState({ loading: false });
                this.props.navigation.goBack()
            })
            .catch((error) => {
                console.log("upload error", error);
                ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                this.setState({ loading: false });
            })
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    render() {
        const { produk } = this.props.route.params
        return (
            <View style={{ flex: 1 }}>
                <View style={style.contPays}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Barang Yang Di Beli</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ marginVertical: 5 }}>Nama Barang : {produk.product.nm_barang}</Text>
                        <Text style={{ marginVertical: 5 }}>Harga : {this.toPrice(produk.product.harga)}</Text>
                        <Text style={{ marginVertical: 5 }}>Jumlah Pesanan : {produk.jumlah}</Text>
                        <Text style={{ marginVertical: 5 }}>Jasa Pengiriman : {produk.pengiriman}</Text>
                        <Text style={{ marginVertical: 5 }}>Total Pembayaran : {this.toPrice(produk.harga)}</Text>
                        <Text style={{ marginVertical: 5 }}>Status : {produk.status}</Text>
                    </View>
                </View>
                <View style={style.contPay}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Bukti Pembayaran</Text>
                    </View>
                    <Image
                        source={{ uri: produk.bukti_bayar }}
                        style={style.image}
                    />
                </View>
                {produk.status == "sudah dibayar" ? (
                    <TouchableOpacity onPress={() => this.confirmPay()} style={style.button}>
                        {this.state.loading ? (<LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                        ) : (
                                <Text style={{ color: "#ff6000" }}>Confirm</Text>
                            )}
                    </TouchableOpacity>
                ) : (
                        <View style={[style.button, { opacity: 0.4 }]}>
                            <Text style={{ color: "#ff6000" }}>Confirm</Text>
                        </View>
                    )}
            </View>
        )
    }
}

export default confirmPay;

const style = StyleSheet.create({
    contPays: {
        maxHeight: "100%",
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    contPay: {
        height: 230,
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    image: {
        height: 180,
        borderRadius: 5
    },
    button: {
        height: 30,
        width: "60%",
        borderWidth: 1,
        borderColor: "#ff6000",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 5,
        marginTop: 15
    }
})
