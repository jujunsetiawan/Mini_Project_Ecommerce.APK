import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Alert, ToastAndroid, Modal, TouchableWithoutFeedback, TextInput, TouchableNativeFeedback, TouchableNativeFeedbackComponent, TouchableNativeFeedbackBase } from 'react-native'
import HeaderImageScrollView, { TriggeringView } from "react-native-image-header-scroll-view"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import _ from "lodash"

class Detail extends Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            token: "",
            angka: 1,
            modal: false
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
    tambahStok() {
        const { product } = this.props.route.params
        const { angka, token } = this.state
        this.setState({ loading: true })
        if (angka !== "") {
            const stock = {
                stok: angka,
            }
            fetch(`https://app-a-store.herokuapp.com/api/product/tambah/${product.id}`, {
                method: 'POST',
                body: JSON.stringify(stock),
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
            ToastAndroid.show("Terjadi Kesalahan Silahkan Coba Lagi Nanti", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }
    kurangStok() {
        const { product } = this.props.route.params
        const { angka, token } = this.state
        this.setState({ loading: true })
        if (angka !== "") {
            const stock = {
                stok: angka,
            }
            fetch(`https://app-a-store.herokuapp.com/api/product/kurang/${product.id}`, {
                method: 'POST',
                body: JSON.stringify(stock),
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
            ToastAndroid.show("Terjadi Kesalahan Silahkan Coba Lagi Nanti", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }
    deleteProduk(id) {
        this.setState({ loading: true });
        fetch(`https://app-a-store.herokuapp.com/api/product/${id}`, {
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
                    this.props.navigation.goBack()
                    ToastAndroid.show("Berhasil Menghapus", ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                }
            })
            .catch((error) => console.log(error))
    }
    alertDelete(id) {
        Alert.alert(
            'Peringatan',
            'Apakah Anda Yakin Ingin Meghapus Produk Ini ?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                },
                { text: 'Hapus', onPress: () => this.deleteProduk(id) },
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
        const { product, store } = this.props.route.params
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
                            <View style={{ marginLeft: 10, padding: 0 }}>
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
                                        onChangeText={(angka) => this.setState({ angka })}
                                        style={style.input}
                                    >{this.state.angka}</TextInput>
                                    <TouchableOpacity onPress={() => this.setState({ angka: this.state.angka + 1 })} style={[style.button, { borderTopRightRadius: 2, borderBottomRightRadius: 3, borderLeftWidth: 0 }]}>
                                        <Text style={{ fontSize: 15 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                {this.state.loading ? (
                                    <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50 }} autoPlay loop />
                                ) : (
                                        <View style={{ flexDirection: "row" }}>
                                            <TouchableOpacity onPress={() => this.tambahStok()} style={style.btn}>
                                                <Text style={{ color: "#ff6000" }}>Tambah stok</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.kurangStok()} style={[style.btn, { marginLeft: 10 }]}>
                                                <Text style={{ color: "#ff6000" }}>Kurang stok</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                            </View>
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
                                        <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual 0 || Stok : {product.stok}</Text>
                                    ) : (
                                            <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual {product.terjual} || Stok : {product.stok}</Text>
                                        )}
                                </View>
                            ) : (
                                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                        <Image
                                            source={require("../assets/favourites.png")}
                                            style={{ height: 16, width: 16, marginRight: 5 }}
                                        />
                                        {product.terjual == null ? (
                                            <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual 0 || Stok : Sudah Habis</Text>
                                        ) : (
                                                <Text style={{ color: "#888", marginHorizontal: 2 }}>Terjual {product.terjual} || Stok : Sudah Habis</Text>
                                            )}
                                    </View>
                                )}
                        </View>
                    </TriggeringView>
                    <View style={[style.section, style.sectionLarge]}>
                        <Text style={style.sectionContent}>Deskripsi Produk : </Text>
                        <Text style={{ marginVertical: 10 }}>{product.deskripsi}</Text>
                        <View style={{ height: 23 }}></View>
                    </View>
                </HeaderImageScrollView>
                <View style={style.contTmbl}>
                    <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("Edit Produk", { a: product })}>
                        <View style={style.tombol}>
                            <Text style={{ color: "#fff", fontSize: 15 }}>Edit Barang</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.showModal()}>
                        <View style={style.tombol}>
                            <Text style={{ color: "#fff", fontSize: 15 }}>Edit Stok</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.alertDelete(product.id)}>
                        <View style={style.tombol}>
                            <Text style={{ color: "#fff", fontSize: 15 }}>Hapus Barang</Text>
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
        textAlign: "justify",
        marginTop: 5
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
        width: "33.3%",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        backgroundColor: "#ff7000",
        borderRadius: 5
    },
    contTmbl: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0
    },
    modalbtn: {
        height: "70%",
        backgroundColor: "#222",
        opacity: 0.2
    },
    modal: {
        height: "30%",
        width: "100%",
        backgroundColor: "#fff"
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
        backgroundColor: "#9e9e9e",
        borderRadius: 3,
        marginTop: 5
    },
    btn: {
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        width: "40%",
        borderColor: "#ff6000",
        borderRadius: 5
    }
})
