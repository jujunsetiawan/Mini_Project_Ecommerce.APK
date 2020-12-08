import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, ToastAndroid, TextInput } from 'react-native'
import LottieView from "lottie-react-native"
import ImagePicker from "react-native-image-picker"
import AsyncStorage from "@react-native-community/async-storage"
import _ from "lodash"

class Sending extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            loading: false,
            noResi: ""
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
    uploadResi() {
        const { produk } = this.props.route.params
        const { noResi, token } = this.state;
        this.setState({ loading: true })
        if (noResi !== "") {
            const method = {
                kode_resi: noResi,
                _method: "PUT"
            }
            fetch(`https://app-a-store.herokuapp.com/api/sending/${produk.id}`, {
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
                    ToastAndroid.show("Upload Succes", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.goBack()
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Pastikan Form Sudah Terisi", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    render() {
        const { produk } = this.props.route.params
        return (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={style.contPays}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Barang Yang Di Pesan</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ marginVertical: 7 }}>Nama Barang : {produk.product.nm_barang}</Text>
                        <Text style={{ marginVertical: 7 }}>Harga : {this.toPrice(produk.product.harga)}</Text>
                        <Text style={{ marginVertical: 7 }}>Jumlah Pesanan : {produk.jumlah}</Text>
                        <Text style={{ marginVertical: 7 }}>Jasa Pengiriman : {produk.pengiriman}</Text>
                        <Text style={{ marginVertical: 7 }}>Total Harga : {this.toPrice(produk.harga)}</Text>
                        <Text style={{ marginVertical: 7 }}>Status : {produk.status}</Text>
                    </View>
                </View>
                <View style={style.contPay}>
                    <View style={{ height: 60, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Image
                            source={{ uri: produk.user.avatar }}
                            style={style.img}
                        />
                        <View style={{ marginLeft: 5, marginTop: 2, width: "80%" }}>
                            <Text style={{ fontSize: 16 }}>{produk.user.name}</Text>
                            <Text style={{ opacity: 0.5, marginVertical: 5, fontSize: 12 }}>{produk.user.email}</Text>
                        </View>
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text numberOfLines={1} style={{ marginVertical: 8 }}>Nama Pembeli : {produk.user.name}</Text>
                        <View style={{flexDirection: "row", width: "80%"}}>
                            <Text style={{marginTop: 8}}>Alamat : </Text>
                            <Text numberOfLines={6} style={{ marginVertical: 8 }}>{produk.user.alamat}</Text>
                        </View>
                        <Text numberOfLines={1} style={{ marginVertical: 8 }}>Nomor Telephone : {produk.user.no_telepon}</Text>
                    </View>
                </View>
                <View style={style.contPays}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Upload Nomor Resi</Text>
                    </View>
                    <Text style={{ marginLeft: 12, marginVertical: 7 }}>Nomor Resi :</Text>
                    <View style={style.input}>
                        <TextInput
                            selectionColor="#000"
                            placeholder="Masukan Nomor Resi"
                            keyboardType="number-pad"
                            onChangeText={(noResi) => this.setState({ noResi })}
                            style={{ fontSize: 15, marginLeft: 5 }}
                        />
                    </View>
                    {produk.status == "packing" ? (
                        <TouchableOpacity onPress={() => this.uploadResi()} style={style.button}>
                            {this.state.loading ? (<LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                            ) : (
                                    <Text style={{ color: "#ff6000" }}>Upload</Text>
                                )}
                        </TouchableOpacity>
                    ) : (
                            <View style={[style.button, { opacity: 0.4 }]}>
                                <Text style={{ color: "#ff6000" }}>Transaksi Selesai</Text>
                            </View>
                        )}
                </View>
            </ScrollView>
        )
    }
}

export default Sending;

const style = StyleSheet.create({
    contPays: {
        maxHeight: "100%",
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    contPay: {
        // height: 150,
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: 0,
        maxHeight: "100%"
    },
    image: {
        height: 180,
        borderRadius: 5
    },
    input: {
        height: 35,
        width: "70%",
        borderRadius: 5,
        backgroundColor: "#f5f5f5",
        marginLeft: 10
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
        marginTop: 30
    },
    img: {
        height: 45,
        width: 45,
        borderRadius: 22.5,
        marginHorizontal: 5
    },
})
