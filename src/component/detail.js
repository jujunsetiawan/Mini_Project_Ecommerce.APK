import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Modal, TouchableWithoutFeedback, ToastAndroid, Picker, TouchableNativeFeedback } from 'react-native'
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
    addCard() {
        const { product } = this.props.route.params
        const { angka, ket, token } = this.state
        this.setState({ loading: true })
        if (angka || ket !== "") {
            const card = {
                jumlah: angka,
                keterangan: ket,
            }
            console.log(this.state.token)
            fetch(`https://app-a-store.herokuapp.com/api/cart/create/${product.id}`, {
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
                    ToastAndroid.show("Berhasil Ditambahkan Ke Keranjang", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.showModal(false)
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Terjadi Kesalahan Silahkan Coba Lagi Nanti", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Terjadi Kesalahan Silahkan Coba Lagi Nanti", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }
    showModal(visible) {
        this.setState({ modal: visible });
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    render() {
        const { product, a } = this.props.route.params
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
                                source={{ uri: product.thumbnail }}
                                style={style.gambar}
                            />
                            <View style={{ marginLeft: 10, padding: 0, maxWidth: "96%" }}>
                                <Text numberOfLines={4} style={{ fontSize: 16, marginRight: 90 }}>{product.nm_barang}</Text>
                                <Text numberOfLines={1} style={{ color: "dodgerblue", marginVertical: 5 }}>Rp {this.toPrice(product.harga)}</Text>
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
                                source={{ uri: product.store.thumbnail }}
                                style={{ height: 40, width: 50, borderRadius: 20, marginLeft: 10 }}
                            />
                            {this.state.angka <= product.stok && this.state.angka >= 1 ? (
                                <TouchableOpacity onPress={() => this.addCard()} style={style.tmb}>
                                    {this.state.loading ? (
                                        <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                                    ) : (
                                            <Text style={{ color: "#fff" }}>Masukan Ke Keranjang</Text>
                                        )}
                                </TouchableOpacity>
                            ) : (
                                    <View onPress={() => this.addCard()} style={style.tmb1}>
                                        {this.state.loading ? (
                                            <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                                        ) : (
                                                <Text style={{ color: "#fff" }}>Stok Tidak Mencukupi</Text>
                                            )}
                                    </View>
                                )}
                        </View>
                        <View style={{ height: 30, width: 85 }}>
                            <Text style={{ marginTop: 5, textAlign: "center", fontSize: 12 }}>{product.store.nm_toko}</Text>
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
                        <Image source={{ uri: product.thumbnail }} style={style.image} />
                    )}
                >
                    <TriggeringView style={style.section}>
                        <View style={{ marginVertical: 5, marginHorizontal: 5, }}>
                            <Text style={style.title}>{product.nm_barang}</Text>
                            <Text style={{ marginVertical: 10, fontSize: 15, color: "dodgerblue" }}>Rp {this.toPrice(product.harga)}</Text>
                            {product.stok !== 0 ? (
                            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                <Image
                                    source={require("../assets/favourites.png")}
                                    style={{ height: 16, width: 16, marginRight: 5 }}
                                />
                                {product.terjual == null ? (
                                    <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual 0  ||  Stok  : {product.stok}</Text>
                                ) : (
                                        <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual {product.terjual}  ||  Stok  : {product.stok}</Text>
                                    )}
                            </View>
                            ) : (
                                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                <Image
                                    source={require("../assets/favourites.png")}
                                    style={{ height: 16, width: 16, marginRight: 5 }}
                                />
                                {product.terjual == null ? (
                                    <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual 0  ||  Stok  : Sudah Habis</Text>
                                ) : (
                                        <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual {product.terjual}  ||  Stok  : Sudah Habis</Text>
                                    )}
                            </View>
                            )}
                        </View>
                    </TriggeringView>
                    <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("DetailStore",{id: product, notif: a})}>
                        <View style={[style.section, { flexDirection: "row", alignItems: "center" }]}>
                            <Image
                                source={{ uri: product.store.thumbnail }}
                                style={{ height: 50, width: 60, borderRadius: 30, borderWidth: 1, borderColor: "#f8f8f8" }}
                            />
                            <View style={{ marginLeft: 5, width: "83%" }}>
                                <Text numberOfLines={1} style={style.sectionContent}>{product.store.nm_toko}</Text>
                                <Text numberOfLines={1} style={{ opacity: 0.5, marginVertical: 5, fontSize: 12 }}>{product.store.alamat}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={[style.section, style.sectionLarge]}>
                        <Text style={style.sectionContent}>Deskripsi Produk : </Text>
                        <Text style={{ marginVertical: 10 }}>{product.deskripsi}</Text>
                        <View style={{ height: 23 }}></View>
                    </View>
                </HeaderImageScrollView>
                <View style={style.contTmbl}>
                    <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("Chet", { kontak: product.store.user })} >
                        <View style={style.tombol}>
                            <Image
                                source={require("../assets/chat.png")}
                                style={style.logo1}
                            />
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.showModal()}>
                        <View style={style.tombol}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                                style={style.logo}
                            />
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.showModal()}>
                        <View style={style.btn}>
                            <Text style={{ color: "#fff", fontSize: 15 }}>beli Sekarang</Text>
                        </View>
                    </TouchableNativeFeedback>
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
        textAlign: "justify"
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
        height: 23,
        width: 23,
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
    }
})
