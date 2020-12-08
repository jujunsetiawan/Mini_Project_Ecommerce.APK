import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ToastAndroid, Image, Modal, TextInput, Alert } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import LottieView from "lottie-react-native"
import ImagePicker from "react-native-image-picker"
import AsyncStorage from "@react-native-community/async-storage"
import _ from "lodash"

class Toko extends Component {
    constructor() {
        super();
        this.state = {
            profile: {},
            produk: [],
            toko: {},
            refreshing: false,
            loading: false,
            modalEditStore: false,
            modalOpenStore: false,
            editName: "",
            editAlamat: "",
            editKodePos: "",
            editPhoto: "",
            editTelp: "",
            editKota: "",
            editNoRek: "",
            editPemilik: "",
            editBank: "",
            namaToko: "",
            alamat: "",
            kota: "",
            kodePos: "",
            telp: "",
            photo: "",
            noRek: "",
            pemilik: "",
            bank: "",
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
            .then(() => this.getProfile())
            .then(() => this.getProduk())
    }
    openStore() {
        const { namaToko, alamat, kota, kodePos, telp, photo, token, pemilik, bank, noRek } = this.state;
        this.setState({ loading: true })
        if (namaToko !== "" && alamat !== "" && kota !== "" && kodePos !== "" && telp !== "" && photo !== "", bank !== "" && noRek !== "" && pemilik !== "") {
            const toko = {
                nama_toko: namaToko,
                alamat: alamat,
                kota: kota,
                kd_pos: kodePos,
                no_telepon: telp,
                no_rekening: noRek,
                pemilik_rekening: pemilik,
                bank: bank,
            };
            fetch('https://app-a-store.herokuapp.com/api/store', {
                method: 'POST',
                body: this.createFormData(photo, toko),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Open Store Succes", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.showModalOpenStore(false)
                    this.getProfile()
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }
    getProfile() {
        console.log(this.state.token);
        this.setState({ loading: true })
        fetch("https://app-a-store.herokuapp.com/api/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${this.state.token}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                const { status } = responseJson;
                if (status) {
                    this.setState({ profile: responseJson.data });
                    this.setState({ loading: false })
                } else {
                    this.logOut();
                    this.setState({ loading: false })
                }
                this.setState({ refreshing: false })
            })
            .catch((error) => {
                console.error(error);
                alert("error")
                this.setState({ refreshing: false })
            });
    }
    getProduk() {
        console.log(this.state.token);
        this.setState({ loading: true })
        fetch("https://app-a-store.herokuapp.com/api/product/store", {
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
                    this.logOut();
                    this.setState({ loading: false })
                } else {
                    this.setState({ produk: responseJson.data });
                    this.setState({
                        toko: responseJson.store,
                        editName: responseJson.store.nm_toko,
                        editAlamat: responseJson.store.alamat,
                        editKota: responseJson.store.kota,
                        editKodePos: responseJson.store.kd_pos,
                        editTelp: responseJson.store.no_telepon,
                        editNoRek: responseJson.store.no_rekening,
                        editPemilik: responseJson.store.pemilik_rekening,
                        editBank: responseJson.store.bank
                    });
                    this.setState({ loading: false })
                }
                this.setState({ refreshing: false })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ refreshing: false })
            });
    }
    editStore() {
        const { Id, editName, editKodePos, editKota, editAlamat, editPhoto, editTelp, token, editNoRek, editPemilik, editBank, bank } = this.state;
        this.setState({ loading: true })
        if (editName !== "" || editKota !== "" || editAlamat !== "" || editTelp !== "" || editPhoto !== "" || editKodePos !== "" || editNoRek !== "" || editBank !== "" || editPemilik !== "") {
            const store = {
                nama_toko: editName,
                alamat: editAlamat,
                kota: editKota,
                no_telepon: editTelp,
                kd_pos: editKodePos,
                no_rekening: editNoRek,
                bank: editBank,
                pemilik_rekening: editPemilik,
                _method: "PUT"
            };
            const dataToSend = editPhoto.uri ? (this.createFormData(editPhoto, store)) : (JSON.stringify(store))
            const headerToSend = editPhoto.uri ? ({
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            }) : ({

                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            })
            fetch(`https://app-a-store.herokuapp.com/api/store/${this.state.toko.id}`, {
                method: 'POST',
                body: dataToSend,
                headers: headerToSend
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Edit Succes", ToastAndroid.SHORT);
                    this.showModalEditStore(false)
                    this.getProduk()
                    this.setState({ loading: false });
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
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
                    ToastAndroid.show("Berhasil Menghapus", ToastAndroid.SHORT);
                    this.getProduk()
                } else {
                    ToastAndroid.show("Tidak Dapat Menghapus Produk Ini, Transaksi Sedang Berlangsung", ToastAndroid.SHORT);
                }
            })
            .catch((error) => console.log(error))
    }
    handleEditPhoto = () => {
        const options = {
            noData: true,

        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.uri) {
                this.setState({ editPhoto: response });
                console.log(JSON.stringify(response) + 'tes image');
            }
        });
    };
    createFormData = (photo, body) => {
        const data = new FormData();

        data.append('thumbnail', {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === 'android'
                    ? photo.uri
                    : photo.uri.replace('file://', ''),
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };
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

        data.append("thumbnail", {
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
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    componentDidMount() {
        this.getToken();
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    _onRefresh = () => {
        this.setState({ refreshing: true })
    }
    showModalEditStore(visible) {
        this.setState({ modalEditStore: visible });
    }
    showModalOpenStore(visible) {
        this.setState({ modalOpenStore: visible });
    }
    render() {
        return (
            <View style={{ flex: 1, }}>
                <Modal
                    style={{ flex: 1 }}
                    visible={this.state.modalEditStore}
                    transparent={true}
                    animationType="fade">
                    <View style={{ height: 50, backgroundColor: "#fff", alignItems: "center", flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => this.showModalEditStore(false)} style={{ marginRight: 15, marginLeft: 5 }}>
                            <Image
                                source={require("../assets/back.png")}
                                style={{ height: 25, width: 30 }}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, }}>Edit Toko</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={style.containerModal}>
                        <View style={style.contphoto}>
                            <TouchableOpacity onPress={() => this.handleEditPhoto()} style={style.photo}>
                                {this.state.editPhoto ? (
                                    <Image
                                        source={{ uri: this.state.editPhoto.uri }}
                                        style={style.photo}
                                    />
                                ) : (
                                        <Image
                                            source={{ uri: this.state.toko.thumbnail }}
                                            style={style.photo}
                                        />
                                    )}
                            </TouchableOpacity>
                        </View>
                        <View style={style.contname}>
                            <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                                <Text style={style.titleName}>Nama Toko</Text>
                                <TextInput
                                    placeholder="Masukan Nama Toko"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    value={this.state.editName}
                                    onChangeText={(editName) => this.setState({ editName })}
                                    style={{ borderColor: "#fff" }}
                                />
                            </View>
                        </View>
                        <View style={style.contname}>
                            <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                                <Text style={style.titleName}>Alamat Toko</Text>
                                <TextInput
                                    placeholder="Masukan Alamat Toko"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    value={this.state.editAlamat}
                                    onChangeText={(editAlamat) => this.setState({ editAlamat })}
                                    style={{ borderColor: "#fff" }}
                                />
                            </View>
                        </View>
                        <View style={style.cont}>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Kota </Text>
                                <TextInput
                                    placeholder="Masukan Kota"
                                    keyboardType="default"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    value={this.state.editKota}
                                    onChangeText={(editKota) => this.setState({ editKota })}
                                    style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Kode Pos</Text>
                                <TextInput
                                    placeholder="Minimum 6 Character"
                                    keyboardType="number-pad"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    value={`${this.state.editKodePos}`}
                                    onChangeText={(editKodePos) => this.setState({ editKodePos })}
                                    style={{ width: "80%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>No.Telphone</Text>
                                <TextInput
                                    placeholder="Minimum 10 Character"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    keyboardType="numeric"
                                    value={this.state.editTelp}
                                    onChangeText={(editTelp) => this.setState({ editTelp })}
                                    style={{ width: "75%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>No.Rekening</Text>
                                <TextInput
                                    placeholder="Minimum 13 Character"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    keyboardType="numeric"
                                    value={this.state.editNoRek}
                                    onChangeText={(editNoRek) => this.setState({ editNoRek })}
                                    style={{ width: "75%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Pemilik Rekening</Text>
                                <TextInput
                                    placeholder="Pemilik Rekening"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    keyboardType="default"
                                    value={this.state.editPemilik}
                                    onChangeText={(editPemilik) => this.setState({ editPemilik })}
                                    style={{ width: "65%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Bank </Text>
                                <TextInput
                                    placeholder="Bank"
                                    keyboardType="default"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    value={this.state.editBank}
                                    onChangeText={(editBank) => this.setState({ editBank })}
                                    style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.editStore()} style={style.button}>
                            {this.state.loading ? (<LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                            ) : (
                                    <Text style={{ color: "#ff6000" }}>Edit Toko</Text>
                                )}
                        </TouchableOpacity>
                    </ScrollView>
                </Modal>
                <Modal
                    style={{ flex: 1 }}
                    visible={this.state.modalOpenStore}
                    transparent={true}
                    animationType="fade">
                    <View style={{ height: 50, backgroundColor: "#fff", alignItems: "center", flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => this.showModalOpenStore(false)} style={{ marginRight: 15, marginLeft: 5 }}>
                            <Image
                                source={require("../assets/back.png")}
                                style={{ height: 25, width: 30 }}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, }}>Buka Toko</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={style.containerModal}>
                        <View style={style.contphoto}>
                            <TouchableOpacity onPress={() => this.handleChoosePhoto()} style={style.photo}>
                                {this.state.photo ? (
                                    <Image
                                        source={{ uri: this.state.photo.uri }}
                                        style={style.photo}
                                    />
                                ) : (
                                        <Text style={{ color: "dodgerblue", fontSize: 12 }}>+ Tambah Foto</Text>
                                    )}
                            </TouchableOpacity>
                        </View>
                        <View style={style.contname}>
                            <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                                <Text style={style.titleName}>Nama Toko</Text>
                                <TextInput
                                    placeholder="Masukan Nama Toko"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    onChangeText={(namaToko) => this.setState({ namaToko })}
                                    style={{ borderColor: "#fff" }}
                                />
                            </View>
                        </View>
                        <View style={style.contname}>
                            <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                                <Text style={style.titleName}>Alamat Toko</Text>
                                <TextInput
                                    placeholder="Masukan Alamat Toko"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    onChangeText={(alamat) => this.setState({ alamat })}
                                    style={{ borderColor: "#fff" }}
                                />
                            </View>
                        </View>
                        <View style={style.cont}>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Kota </Text>
                                <TextInput
                                    placeholder="Masukan Kota"
                                    keyboardType="default"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    onChangeText={(kota) => this.setState({ kota })}
                                    style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Kode Pos</Text>
                                <TextInput
                                    placeholder="Minimum 6 Character"
                                    keyboardType="number-pad"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    onChangeText={(kodePos) => this.setState({ kodePos })}
                                    style={{ width: "80%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>No.Telphone</Text>
                                <TextInput
                                    placeholder="Minimum 10 Character"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    keyboardType="numeric"
                                    onChangeText={(telp) => this.setState({ telp })}
                                    style={{ width: "75%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>No.Rekening</Text>
                                <TextInput
                                    placeholder="Minimum 13 Character"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    keyboardType="numeric"
                                    onChangeText={(noRek) => this.setState({ noRek })}
                                    style={{ width: "75%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Pemilik Rekening</Text>
                                <TextInput
                                    placeholder="Pemilik Rekening"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    keyboardType="default"
                                    onChangeText={(pemilik) => this.setState({ pemilik })}
                                    style={{ width: "65%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                            <View style={style.contci}>
                                <Text style={{ padding: 2 }}>Bank </Text>
                                <TextInput
                                    placeholder="Bank"
                                    keyboardType="default"
                                    selectionColor="dodgerblue"
                                    color="dodgerblue"
                                    onChangeText={(bank) => this.setState({ bank })}
                                    style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.openStore()} style={style.button}>
                            {this.state.loading ? (<LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                            ) : (
                                    <Text style={{ color: "#ff6000" }}>Buka Toko</Text>
                                )}
                        </TouchableOpacity>
                    </ScrollView>
                </Modal>
                {this.state.produk == "" ? (
                    <View>
                        {this.state.profile.role !== "pedagang" ? (
                            <View>
                                <LottieView source={require("../assets/9704-ecommerce.json")} style={{ height: 200, alignSelf: "center" }} autoPlay loop />
                                <Text style={{ textAlign: "center", marginBottom: 20, opacity: 0.6 }}>Anda Belum Punya Toko, Buat Toko Sekarang !</Text>
                                <TouchableOpacity onPress={() => this.showModalOpenStore()}>
                                    <LinearGradient style={style.button} colors={["#ff6000", "#ff9000"]}>
                                        <Text style={{ color: "white" }}>Buka Toko</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        ) : (
                                <View>
                                    <LottieView source={require("../assets/18037-out-of-stock.json")} style={{ height: 200, alignSelf: "center" }} autoPlay loop />
                                    <Text style={{ textAlign: "center", marginBottom: 20, opacity: 0.6 }}>Anda Belum Punya Produk, Tambah Produk Sekarang !</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Tambah Produk")}>
                                        <LinearGradient style={style.button} colors={["#ff6000", "#ff9000"]}>
                                            <Text style={{ color: "white" }}>Tambah Produk</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )}
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
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={() => {
                                                    this.getProduk()
                                                    this._onRefresh()
                                                }}
                                            />
                                        }>
                                        <TouchableOpacity onPress={() => this.showModalEditStore()} style={style.contstr}>
                                            <Image
                                                source={{ uri: this.state.toko.thumbnail }}
                                                style={{ height: 60, width: 60, borderRadius: 30, borderWidth: 1, marginRight: 10 }}
                                            />
                                            <View style={{ justifyContent: "center", width: "53%" }}>
                                                <Text numberOfLines={1} style={{ fontSize: 17, marginBottom: 5 }}>{this.state.toko.nm_toko}</Text>
                                                <Text numberOfLines={1} style={{ fontSize: 13, opacity: 0.5 }}>{this.state.toko.alamat}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Transaksi")} style={style.contTr}>
                                                <Image
                                                    source={require("../assets/list.png")}
                                                    style={{ height: 30, width: 30 }}
                                                />
                                                <Text style={{ marginLeft: 5 }}>Transaksi</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                        <View style={style.container}>
                                            {this.state.produk.map((item, index) => (
                                                <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Detel", { product: item, store: this.state.toko })} onLongPress={() => this.alertDelete(item.id)} style={style.background}>
                                                    <Image
                                                        source={{ uri: item.thumbnail }}
                                                        style={{ height: 120, width: null, borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
                                                    />
                                                    <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
                                                        <Text numberOfLines={2} style={{ fontSize: 14 }}>{item.nm_barang}</Text>
                                                        <Text style={{ color: "dodgerblue", marginTop: 5, fontSize: 14 }}>Rp {this.toPrice(item.harga)}</Text>
                                                        <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
                                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                                <TouchableOpacity>
                                                                    <Image
                                                                        source={require("../assets/star.png")}
                                                                        style={{ height: 12, width: 12 }}
                                                                    />
                                                                </TouchableOpacity>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Image
                                                                        source={require("../assets/favourites.png")}
                                                                        style={{ height: 10, width: 10, marginRight: 5, marginTop: 3 }}
                                                                    />
                                                                    {item.terjual == null ? (
                                                                        <Text style={{ color: "#888", fontSize: 10 }}>Terjual 0</Text>
                                                                    ) : (
                                                                            <Text style={{ color: "#888", fontSize: 10 }}>Terjual {item.terjual}</Text>
                                                                        )}
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 2 }}>
                                                                <View></View>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Image
                                                                        source={require("../assets/map-placeholder.png")}
                                                                        style={{ height: 10, width: 10, marginRight: 3, opacity: 0.5, marginTop: 3 }}
                                                                    />
                                                                    <Text style={{ textAlign: "right", color: "#777", fontSize: 11 }}>{this.state.toko.kota}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <View style={{ height: 40 }}></View>
                                        <TouchableOpacity style={[style.button, { position: "absolute", bottom: 5 }]} onPress={() => this.props.navigation.navigate("Tambah Produk")}>
                                            <Text style={{ color: "#ff6000" }}>Tambah Produk</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                )}
                        </View>
                    )}
            </View>
        )
    }
}

export default Toko;

const style = StyleSheet.create({
    button: {
        height: 40,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 100,
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
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    containerModal: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    contstr: {
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        // justifyContent: "space-between"
    },
    contTr: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 0,
        flexDirection: "row",
        height: 50,
        alignItems: "center"
    },
    contname: {
        height: 75,
        backgroundColor: "#fff",
        marginVertical: 5,
        marginHorizontal: 5,
    },
    titleName: {
        fontWeight: "bold",
        marginBottom: 15,
        marginLeft: 5,
    },
    cont: {
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: "#fff",
    },
    contci: {
        height: 40,
        justifyContent: "center",
        padding: 7,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        height: 35,
        width: "99%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ff6000"
    },
    contphoto: {
        height: 115,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: "#fff",
        justifyContent: "center"
    },
    photo: {
        height: 95,
        width: 95,
        borderWidth: 1,
        borderColor: "dodgerblue",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10
    },
})