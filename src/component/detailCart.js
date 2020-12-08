import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Modal, TouchableWithoutFeedback, ToastAndroid, Alert, Picker } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import HeaderImageScrollView, { TriggeringView } from "react-native-image-header-scroll-view"
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import _ from "lodash"

class Detail extends Component {
    constructor() {
        super()
        this.state = {
            modal: false,
            angka: 1,
            ket: "",
            loading: false,
            token: "",
            kategori: "JNE"
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
    editCart() {
        const { produk } = this.props.route.params
        const { angka, ket, token } = this.state
        this.setState({ loading: true })
        if (angka && ket !== "") {
            const card = {
                jumlah: angka,
                keterangan: ket,
                _method: 'PUT'
            }
            fetch(`https://app-a-store.herokuapp.com/api/cart/update/${produk.id}`, {
                method: 'POST',
                body: JSON.stringify(card),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Edit Succses", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.goBack()
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Pastikan Keterangan Sudah Terisi", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }
    deleteCart(id) {
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
                    this.props.navigation.goBack()
                } else {
                    ToastAndroid.show("Gagal Menghapus", ToastAndroid.SHORT);
                }
            })
            .catch((error) => console.log(error))
    }
    chekOut() {
        const { produk } = this.props.route.params
        const { token, kategori } = this.state
        this.setState({ loading: true })
        if (kategori !== "") {
            const check = {
                pengiriman: kategori
            }
            fetch(`https://app-a-store.herokuapp.com/api/chekout/${produk.id}`, {
                method: 'POST',
                body: JSON.stringify(check),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Ckeckout succes", ToastAndroid.SHORT);
                    this.props.navigation.navigate("Home", { screen: "Profile" })
                    this.setState({ loading: false });
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Terjadi Kesalahan Silahkan Coba Lagi Nanti", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Silahkan Pilih Jasa pengiriman", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
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
    showModal(visible) {
        this.setState({ modal: visible });
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    render() {
        const { produk } = this.props.route.params
        return (
            <View style={style.container}>
                <Modal
                    style={{ flex: 1 }}
                    visible={this.state.modal}
                    transparent={true}
                    animationType="fade">
                    <TouchableWithoutFeedback onPress={() => this.showModal(false)}>
                        <View style={style.modalbtn}></View>
                    </TouchableWithoutFeedback>
                    <View style={style.modal}>
                        <View style={{ flexDirection: "row", marginVertical: 5, marginHorizontal: 5 }}>
                            <Image
                                source={{ uri: produk.product.thumbnail }}
                                style={style.gambar}
                            />
                            <View style={{ marginLeft: 10, padding: 0 }}>
                                <Text numberOfLines={4} style={{ fontSize: 16, marginRight: 90 }}>{produk.product.nm_barang}</Text>
                                <Text numberOfLines={1} style={{ color: "dodgerblue", marginVertical: 5 }}>Rp {this.toPrice(produk.product.harga)}</Text>
                                <View style={{ flexDirection: "row", marginVertical: 5 }}>
                                    <TouchableOpacity onPress={() => this.setState({ angka: this.state.angka <= 1 ? this.state.angka : this.state.angka - 1 })} style={[style.button, { borderTopLeftRadius: 2, borderBottomLeftRadius: 3, borderRightWidth: 0 }]}>
                                        <Text style={{ fontSize: 15 }}>-</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        keyboardType="number-pad"
                                        selectionColor="#000000"
                                        placeholder="1"
                                        onChangeText={(angka) => this.setState({ angka: _.toInteger(angka) })}
                                        style={style.input}
                                    >{this.state.angka}</TextInput>
                                    <TouchableOpacity onPress={() => this.setState({ angka: this.state.angka + 1 })} style={[style.button, { borderTopRightRadius: 2, borderBottomRightRadius: 3, borderLeftWidth: 0 }]}>
                                        <Text style={{ fontSize: 15 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 13, }}>Keterangan : </Text>
                                    <View style={style.contInput}>
                                        <TextInput
                                            placeholder="warna, ukuran, dll"
                                            selectionColor="dodgerblue"
                                            onChangeText={(ket) => this.setState({ ket })}
                                            style={style.textInput}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 5 }}>
                            <Image
                                source={{ uri: produk.store.thumbnail }}
                                style={{ height: 40, width: 50, borderRadius: 20, marginLeft: 10 }}
                            />
                            {this.state.angka <= `${produk.product.stok}` && this.state.angka >= 1 ? (
                                <TouchableOpacity onPress={() => this.editCart()} style={style.tmb}>
                                    {this.state.loading ? (
                                        <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                                    ) : (
                                            <Text style={{ color: "#fff" }}>Edit Keranjang</Text>
                                        )}
                                </TouchableOpacity>
                            ) : (
                                    <View style={style.tmb1}>
                                        <Text style={{ color: "#fff" }}>Stok Tidak Mencukupi</Text>
                                    </View>
                                )}
                        </View>
                        <View style={{ height: 30, width: 85 }}>
                            <Text style={{ marginTop: 5, textAlign: "center", fontSize: 12 }}>{produk.store.nm_toko}</Text>
                        </View>
                    </View>
                </Modal>
                <StatusBar barStyle="light-content" />
                <HeaderImageScrollView
                    showsVerticalScrollIndicator={false}
                    maxHeight={MAX_HEIGHT}
                    minHeight={MIN_HEIGHT}
                    maxOverlayOpacity={0.6}
                    minOverlayOpacity={0.3}
                    renderHeader={() => (
                        <Image source={{ uri: produk.product.thumbnail }} style={style.image} />
                    )}
                >
                    <TriggeringView style={style.section}>
                        <View style={{ marginVertical: 5, marginHorizontal: 5, }}>
                            <Text style={style.title}>{produk.product.nm_barang}</Text>
                            <Text style={{ marginVertical: 10, fontSize: 15, color: "dodgerblue" }}>Total Pesanan ({produk.jumlah} Produk) : Rp {this.toPrice(produk.harga)}</Text>
                            <Text style={{ color: "#888", marginHorizontal: 2 }}>Keterangan : {produk.keterangan}</Text>
                        </View>
                    </TriggeringView>
                    <View style={[style.section, style.sectionLarge]}>
                        <Text style={style.sectionContent}>Alamat Penerimaan : </Text>
                        <Text style={{ marginVertical: 10 }}>Nama : {produk.user.name}</Text>
                        <View style={{ flexDirection: "row", width: "88%" }}>
                            <Text style={{ marginTop: 8 }}>Alamat : </Text>
                            <Text style={{ marginVertical: 8 }}>{produk.user.alamat}</Text>
                        </View>
                        <Text style={{ marginVertical: 10 }}>No.Telephone : {produk.user.no_telepon}</Text>
                        <Text style={{ marginVertical: 10 }}>Ongkir : Gratis Di Seluruh Jagat Raya</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ marginVertical: 10 }}>Pilih Jasa Pengiriman : </Text>
                            <View style={{ width: 150, borderRadius: 3 }}>
                                <Picker mode="dropdown" selectedValue={this.state.kategori} onValueChange={(kategori) => this.setState({ kategori })} style={{
                                    height: 25, fontSize: 14, width: 160
                                }}>
                                    <Picker.Item label="JNE" value="JNE" />
                                    <Picker.Item label="J&T" value="J&T" />
                                    <Picker.Item label="Go Send" value="Go Send" />
                                    <Picker.Item label="Pos Indonesia" value="Pos Indonesia" />
                                </Picker>
                            </View>
                        </View>
                        <View style={{ height: 23 }}></View>
                    </View>
                </HeaderImageScrollView>
                <View style={style.contTmbl}>
                    <TouchableOpacity onPress={() => this.chekOut()} style={style.btn}>
                        {this.state.loading ? (
                            <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                        ) : (
                                <Text style={{ color: "#fff", fontSize: 15 }}>Buat Pesanan</Text>
                            )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.showModal()} style={style.tombol}>
                        <Text style={{ color: "#fff" }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.alertCart(produk.id)} style={style.tombol}>
                        <Image
                            source={require("../assets/trash.png")}
                            style={style.logo}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const MIN_HEIGHT = Platform.os === "ios" ? 90 : 55;
const MAX_HEIGHT = 250;
export default Detail

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: MAX_HEIGHT,
        width: Dimensions.get("window").width,
        alignSelf: "stretch",
        resizeMode: "cover"
    },
    title: {
        fontSize: 17
    },
    name: {
        fontWeight: "bold"
    },
    section: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
        backgroundColor: "white"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    sectionContent: {
        fontSize: 16,
        textAlign: "justify",
        marginBottom: 5
    },
    categories: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },
    categoryContainer: {
        flexDirection: "row",
        backgroundColor: "dodgerblue",
        borderRadius: 20,
        margin: 10,
        padding: 10,
        paddingHorizontal: 15
    },
    category: {
        fontSize: 14,
        color: "#fff",
        marginLeft: 10
    },
    titleContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center"
    },
    imageTitle: {
        color: "white",
        backgroundColor: "transparent",
        fontSize: 24
    },
    navTitleView: {
        height: MAX_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 40 : 5
    },
    navTitle: {
        color: "white",
        fontSize: 18,
        backgroundColor: "transparent"
    },
    sectionLarge: {
        minHeight: 250,
    },
    tombol: {
        height: 35,
        width: "18%",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        backgroundColor: "dodgerblue",
        borderRadius: 5
    },
    btn: {
        height: 35,
        width: "64%",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        backgroundColor: "dodgerblue",
        borderRadius: 5
    },
    contTmbl: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0
    },
    logo: {
        height: 20,
        width: 20,
        tintColor: "white",
    },
    logo1: {
        height: 18,
        width: 19,
        tintColor: "white",
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
        marginLeft: 5,
        borderColor: "#fff",
        marginTop: 5
    },
    contInput: {
        height: 27,
        width: 108,
        // backgroundColor: "#fff",
        borderRadius: 3,
    },
    tmb1: {
        height: 35,
        width: "67%",
        backgroundColor: "dodgerblue",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginRight: 7,
        opacity: 0.5
    },
})
