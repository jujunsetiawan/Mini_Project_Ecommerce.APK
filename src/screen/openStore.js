import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ToastAndroid } from 'react-native'
import ImagePicker from "react-native-image-picker"
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"

class OpenStore extends Component {
    constructor() {
        super()
        this.state = {
            token: "",
            namaToko: "",
            alamat: "",
            kota: "",
            kodePos: "",
            telp: "",
            photo: "",
            loading: false
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
    openStore() {
        const { namaToko, alamat, kota, kodePos, telp, photo, token } = this.state;
        this.setState({ loading: true })
        if (namaToko !== "" && alamat !== "" && kota !== "" && kodePos !== "" && telp !== "" && photo !== "") {
            const toko = {
                nama_toko: namaToko,
                alamat: alamat,
                kota: kota,
                kd_pos: kodePos,
                no_telepon: telp,
            };
            fetch('https://app-a-store.herokuapp.com/api/store/create', {
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
                    this.props.navigation.replace("Home", {screen: "Home"})
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                    this.setState({loading: false});
                })
        } else {
            ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
            this.setState({loading: false})
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
                </View>
                <TouchableOpacity onPress={() => this.openStore()} style={style.button}>
                    {this.state.loading ? (<LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                    ) : (
                            <Text style={{ color: "#ff6000" }}>Buka Toko</Text>
                        )}
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default OpenStore;

const style = StyleSheet.create({
    container: {
        flex: 1
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
        height: 120,
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
