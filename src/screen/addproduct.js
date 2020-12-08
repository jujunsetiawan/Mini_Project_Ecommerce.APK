import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Picker, ScrollView, Image, ToastAndroid } from 'react-native'
import ImagePicker from "react-native-image-picker"
import { PickerItem } from 'react-native/Libraries/Components/Picker/Picker'
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"

class Addproduct extends Component {
    constructor() {
        super()
        this.state = {
            photo: "",
            produkName: "",
            descProduk: "",
            category: "",
            price: "",
            stock: "",
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
            .then(() => this.getKategori());
    }
    addProduk() {
        const { produkName, descProduk, category, price, stock, photo, token } = this.state;
        this.setState({ loading: true })
        if (produkName !== "" && descProduk !== "" && price !== "" && stock !== "" && photo !== "" && category !== "") {
            const produk = {
                nm_barang: produkName,
                deskripsi: descProduk,
                harga: price,
                stok: stock,
                kategori: category,
            };
            fetch('https://app-a-store.herokuapp.com/api/product', {
                method: 'POST',
                body: this.createFormData(photo, produk),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Barang Brhasil Di Tambahkan", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.replace("Home",{screen: "Home"})
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
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
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
                <View style={style.decs}>
                    <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                        <Text style={style.titleName}>Nama Produk</Text>
                        <TextInput
                            placeholder="Masukan Produk"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            onChangeText={(produkName) => this.setState({ produkName })}
                            style={{ borderColor: "#fff", fontSize: 15 }}
                        />
                    </View>
                </View>
                <View style={style.decs}>
                    <View style={{padding: 7}}>
                        <Text style={style.titleName}>Deskripsi Produk</Text>
                        <TextInput
                            placeholder="Masukan Deskripsi Produk"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            multiline={true}
                            onChangeText={(descProduk) => this.setState({ descProduk })}
                            style={{ borderColor: "#fff", fontSize: 15 }}
                        />
                    </View>
                </View>
                <View style={style.conti}>
                    <View style={style.contPick}>
                        <Text>Kategori</Text>
                        <Picker mode="dropdown" selectedValue={this.state.category} onValueChange={(a) => this.setState({ category: a })} style={style.picker}>
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
                            onChangeText={(price) => this.setState({ price })}
                            style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right", marginRight: 15, fontSize: 15 }}
                        />
                    </View>
                    <View style={style.contci}>
                        <Text style={{ padding: 2, }}>Stok</Text>
                        <TextInput
                            placeholder="Stok"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            keyboardType="numeric"
                            onChangeText={(stock) => this.setState({ stock })}
                            style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right", marginRight: 15, fontSize: 15 }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.addProduk()} style={style.button}>
                    {this.state.loading ? (
                        <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                    ) : (
                            <Text style={{ color: "#ff6000" }}>Tambah produk</Text>
                        )}
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default Addproduct;

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
    decs: {
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
    conti: {
        height: 120,
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