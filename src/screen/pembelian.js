import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, TouchableNativeFeedback, RefreshControl, Image, Alert, ToastAndroid } from 'react-native'
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import _ from "lodash"

class Pembelian extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            refresh: false,
            loading: false,
            barang: [],
            modalPay: false

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
            .then(() => this.getBeli())
    }
    getBeli() {
        this.setState({ loading: true })
        console.log(this.setState.token);
        fetch("https://app-a-store.herokuapp.com/api/beli", {
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
                        barang: responseJson.data,
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
    deleteBuy(id) {
        this.setState({ loading: true });
        fetch(`https://app-a-store.herokuapp.com/api/hapus/${id}`, {
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
                    this.getBeli()
                } else {
                    ToastAndroid.show("Gagal Menghapus", ToastAndroid.SHORT);
                    this.getBeli()
                }
            })
            .catch((error) => console.log(error))
    }
    alertBuy(id) {
        Alert.alert(
            'Peringatan',
            'Apakah Anda Yakin Ingin Meghapus Riwayat Pembelian ?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                },
                { text: 'Hapus', onPress: () => this.deleteBuy(id) },
            ],
            { cancelable: false },
        );
    }
    componentDidMount() {
        this.getToken();
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    showModalPay(visible) {
        this.setState({ modalPay: visible });
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.replace('Login');
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    {this.state.barang == null ? (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <LottieView
                                source={require("../assets/28608-make-payment.json")} autoPlay loop
                                style={{ height: 250, width: 250 }}
                            />
                            <Text style={{ opacity: 0.6 }}> Tidak Ada Status Pembelian, Chekout Sekarang ! </Text>
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
                                                        this.getBeli()
                                                        this.setState({ refresh: true })
                                                    }}
                                                />
                                            }
                                            scrollEventThrottle={15}
                                            showsVerticalScrollIndicator={false}>
                                            {this.state.barang.map((item, index) => (
                                                <TouchableNativeFeedback key={index} onLongPress={() => item.status == "pembayaran" ? (this.alertBuy(item.id)) : (ToastAndroid.show("Tidak Dapat Menghapus, Transaksi Sedang Berlangsung", ToastAndroid.SHORT))} onPress={() => item.status == "pembayaran" ? (this.props.navigation.navigate("Pembayaran", {produk: item})) : (this.props.navigation.navigate("Konfirmasi Terima Barang", {produk: item}))}>
                                                    <View style={style.cont}>
                                                        <View style={style.container}>
                                                            <Image
                                                                source={{ uri: item.product.thumbnail }}
                                                                style={style.image} />
                                                        </View>
                                                        <View style={style.contText}>
                                                            <Text numberOfLines={1} style={style.text}>{item.product.nm_barang}</Text>
                                                            <Text numberOfLines={1} style={style.text}>Keterangan : {item.keterangan}</Text>
                                                            <Text style={style.text}>jumlah Pesanan : {item.jumlah}</Text>
                                                            <Text style={[style.text]}>Total Harga :<Text style={{color: "dodgerblue"}}> Rp {this.toPrice(item.harga)}</Text></Text>
                                                            <Text style={style.text}>Status : {item.status}</Text>
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

export default Pembelian;

const style = StyleSheet.create({
    contText: {
        marginHorizontal: 10
    },
    text: {
        marginVertical: 2.5,
        fontSize: 12
    },
    cont: {
        marginVertical: 5,
        flexDirection: "row",
        // shadowColor: "#888",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 5,
        marginHorizontal: 7,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    image: {
        height: 110,
        width: 105,
        backgroundColor: "#000",
        borderRadius: 5
    },
    container: {
        flex: 1
    },
    contText: {
        flex: 2,
        padding: 0,
        // marginLeft: 2.5
    },
    containerModal: {
        flex: 1,
        backgroundColor: "#f1f1f1",
    },
    contPay: {
        height: 225,
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    img: {
        height: 45,
        width: 45,
        borderRadius: 22.5,
        marginHorizontal: 5
    }
})