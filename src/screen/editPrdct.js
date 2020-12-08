import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Picker, ScrollView, Image, ToastAndroid } from 'react-native'
import ImagePicker from "react-native-image-picker"
import { PickerItem } from 'react-native/Libraries/Components/Picker/Picker'
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"

export class EditProduct extends Component {
    constructor() {
        super()
        this.state={
            produk: [],
            loading: false,
            editName: "",
            editDesc: "",
            editHarga: "",
            editPhoto: "",
            editStok: "",
            editKategori: "",
            token: "",
            categori: []
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
            .then(() => this.getProduk())
            .then(() => this.getKategori())
    }
    getKategori() {
        console.log(this.state.token);
        this.setState({ loading: true })
        fetch("https://app-a-store.herokuapp.com/api/kategori", {
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
                    this.setState({ categori: responseJson.data });
                    this.setState({ loading: false })
                } else {
                    this.logOut();
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error);
                ToastAndroid.show(error, ToastAndroid.LONG);
            });
    }
    getProduk() {
        const { a } = this.props.route.params
        console.log(this.state.token);
        this.setState({ loading: true })
        fetch(`https://app-a-store.herokuapp.com/api/product/${a.id}`, {
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
                        produk: responseJson.data.product,
                        editName: responseJson.data.product.nm_barang,
                        editDesc: responseJson.data.product.deskripsi,
                        editHarga: responseJson.data.product.harga,              
                    });
                    this.setState({ loading: false })
                } else {
                    this.logOut();
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error);
                ToastAndroid.show("Network request failed", ToastAndroid.LONG)
            });
    }
    editProduk() {
        const { a } = this.props.route.params
        const { editName, editDesc, editHarga, editPhoto, editStok, token, editKategori } = this.state
        this.setState({ loading: true })
        if (editName !== "" || editDesc !== "" || editStok !== "" || editHarga !== "" || editPhoto !== "" && editKategori !== "") {
            const produk = {
                nm_barang: editName,
                deskripsi: editDesc,
                harga: editHarga,
                stok: editStok,
                kategori: editKategori,
                _method: "PUT"
            };
            const dataToSend = editPhoto.uri ? (this.createFormData(editPhoto, produk)) : (JSON.stringify(produk))
            const headerToSend = editPhoto.uri ? ({
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            }) : ({
                
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            })
            fetch(`https://app-a-store.herokuapp.com/api/product/${a.id}`, {
                method: 'POST',
                body: dataToSend,
                headers: headerToSend
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Edit Succes", ToastAndroid.SHORT);
                    this.props.navigation.replace("Home", {screen: "Home"})
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

        data.append("thumbnail", {
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
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
                <View style={style.contphoto}>
                    <TouchableOpacity onPress={() => this.handleEditPhoto()} style={style.photo}>
                        {this.state.editPhoto ? (
                            <Image
                                source={{ uri: this.state.editPhoto.uri }}
                                style={style.photo}
                            />
                        ) : (
                            <Image
                                source={{ uri: this.state.produk.thumbnail }}
                                style={style.photo}
                            />
                            )}
                    </TouchableOpacity>
                </View>
                <View style={style.contname}>
                    <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                        <Text style={style.titleName}>Nama Produk</Text>
                        <TextInput
                            placeholder="Masukan Produk"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            value={this.state.editName}
                            onChangeText={(editName) => this.setState({ editName })}
                            style={{ borderColor: "#fff", fontSize: 15 }}
                        />
                    </View>
                </View>
                <View style={style.contname}>
                    <View style={{padding: 7}}>
                        <Text style={style.titleName}>Deskripsi Produk</Text>
                        <TextInput
                            placeholder="Masukan Deskripsi Produk"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            multiline={true}
                            value={this.state.editDesc}
                            onChangeText={(editDesc) => this.setState({ editDesc })}
                            style={{ borderColor: "#fff", fontSize: 15 }}
                        />
                    </View>
                </View>
                <View style={style.cont}>
                    <View style={style.contPick}>
                        <Text>Kategori</Text>
                        <Picker mode="dropdown" selectedValue={this.state.editKategori} onValueChange={(a) => this.setState({ editKategori: a })} style={style.picker}>
                            {this.state.categori.map((item, index) => (
                                <Picker.Item key={index} label={item.kategori} value={item.id} />
                            ))}
                        </Picker>
                    </View>
                    <View style={style.contci}>
                        <Text style={{ padding: 2 }}>Harga</Text>
                        <TextInput
                            placeholder="Masukan Harga"
                            keyboardType="number-pad"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            value={this.state.editHarga}
                            onChangeText={(editHarga) => this.setState({ editHarga })}
                            style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right", marginRight: 15, fontSize: 15 }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.editProduk()} style={style.button}>
                    {this.state.loading ? (
                        <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                    ) : (
                            <Text style={{ color: "#ff6000" }}>Edit Produk</Text>
                        )}
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default EditProduct;

const style = StyleSheet.create({
    container: {
        flex: 1
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
    contname: {
        // maxHeight: "100%",
        backgroundColor: "#fff",
        marginVertical: 5,
        marginHorizontal: 5,
    },
    titleName: {
        fontWeight: "bold",
        marginBottom: 15,
        marginLeft: 5
    },
    cont: {
        height: 80,
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: "#fff"
    },
    contci: {
        height: 40,
        justifyContent: "center",
        padding: 7,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 2
    },
    button: {
        marginTop: 10,
        height: 40,
        width: "99%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#ff6000",
        borderRadius: 5,
    },
    picker: {
        height: 30,
        width: 130,
        opacity: 0.5,
    },
    contPick: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 7,
        marginLeft: 3,
        width: "100%"
    },
})