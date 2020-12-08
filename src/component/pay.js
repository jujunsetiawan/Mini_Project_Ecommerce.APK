import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import LottieView from "lottie-react-native"
import ImagePicker from "react-native-image-picker"
import AsyncStorage from "@react-native-community/async-storage"
import _ from "lodash"

class Pay extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            loading: false,
            photo: ""
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
    uploadPay() {
        const { produk } = this.props.route.params
        const { photo, token } = this.state;
        this.setState({ loading: true })
        if (photo !== "") {
            const method = {
                _method: "PUT"
            }
            fetch(`https://app-a-store.herokuapp.com/api/bayar/${produk.id}`, {
                method: 'POST',
                body: this.createFormData(photo, method),
                headers: {
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
            ToastAndroid.show("Pastikan Form Foto Sudah Terisi", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.uri) {
                this.setState({ photo: response })
            }
        });
    };

    createFormData = (photo, body) => {
        const data = new FormData();

        data.append("bukti", {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "andriod"
                    ? photo.uri
                    : photo.uri.replace("file: //", "")
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key])
        });
        return data;
    };
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    render() {
        const { produk } = this.props.route.params
        return (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={style.contPays}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Barang Yang Di Beli</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text numberOfLines={1} style={{ marginVertical: 7 }}>Nama Barang : {produk.product.nm_barang}</Text>
                        <Text style={{ marginVertical: 7 }}>Harga : {this.toPrice(produk.product.harga)}</Text>
                        <Text style={{ marginVertical: 7 }}>Jumlah Pesanan : {produk.jumlah}</Text>
                        <Text style={{ marginVertical: 7 }}>Jasa Pengiriman : {produk.pengiriman}</Text>
                    </View>
                </View>
                <View style={style.contPay}>
                    <View style={{ height: 60, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Image
                            source={{ uri: produk.store.thumbnail }}
                            style={style.img}
                        />
                        <View style={{ marginLeft: 5, marginTop: 2, width: "80%" }}>
                            <Text numberOfLines={1} style={{ fontSize: 16 }}>{produk.store.nm_toko}</Text>
                            <Text numberOfLines={1} style={{ opacity: 0.5, marginVertical: 5, fontSize: 12 }}>{produk.store.alamat}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text numberOfLines={1} style={{ marginVertical: 7 }}>Pemilik Rekening : {produk.store.pemilik_rekening}</Text>
                        <Text style={{ marginVertical: 7 }}>Nomor Rekening : {produk.store.no_rekening}</Text>
                        <Text style={{ marginVertical: 7 }}>Bank : {produk.store.bank}</Text>
                        <Text style={{ marginVertical: 7 }}>Nomor Telephone : {produk.store.no_telepon}</Text>
                        <Text style={{ marginVertical: 7 }}>Kode Pos : {produk.store.kd_pos}</Text>
                        <Text style={{ marginVertical: 7 }}>Total Pembayaran : {this.toPrice(produk.harga)}</Text>
                    </View>
                </View>
                <View style={style.contPaya}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: "#9e9e9e", alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Kirim Bukti Pembayaran</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.handleChoosePhoto()} style={style.image}>
                        {this.state.photo ? (
                            <Image
                                source={{ uri: this.state.photo.uri }}
                                style={style.image}
                            />
                        ) : (
                                <Text style={{ opacity: 0.5 }}>+ Upload Image</Text>
                            )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.uploadPay()} style={style.button}>
                        {this.state.loading ? (<LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                        ) : (
                                <Text style={{ color: "#ff6000" }}>Upload</Text>
                            )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

export default Pay;

const style = StyleSheet.create({
    contPay: {
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    contPays: {
        marginHorizontal: 7,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    contPaya: {
        height: 210,
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
    },
    image: {
        height: 100,
        width: 150,
        backgroundColor: "#f1f1f1",
        alignSelf: "center",
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "center"
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
        marginTop: 5
    }
})
