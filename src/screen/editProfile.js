import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, ToastAndroid } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from "react-native-image-picker"
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"

class editProfile extends Component {
    constructor() {
        super();
        this.state = {
            profile: {},
            loading: false,
            editName: "",
            editEmail: "",
            editAlamat: "",
            editPhoto: "",
            editTelp: "",
            token: "",
            Id: 0
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
            .then(() => this.getProfile());
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
                    this.setState({ editName: responseJson.data.name })
                    this.setState({ editEmail: responseJson.data.email })
                    this.setState({ editAlamat: responseJson.data.alamat })
                    this.setState({ editTelp: responseJson.data.no_telepon })
                    this.setState({ loading: false })
                } else {
                    this.logOut();
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error);
                alert("error")
            });
    }
    editProfile() {
        const { Id, editName, editEmail, editAlamat, editPhoto, editTelp, token } = this.state;
        this.setState({ loading: true })
        if (editName !== "" || editEmail !== "" || editAlamat !== "" || editTelp !== "" || editPhoto !== "") {
            const profile = {
                name: editName,
                alamat: editAlamat,
                email: editEmail,
                no_telepon: editTelp,
                _method: "PUT"
            };
            const dataToSend = editPhoto.uri ? (this.createFormData(editPhoto, profile)) : (JSON.stringify(profile))
            const headerToSend = editPhoto.uri ? ({
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            }) : ({
                
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            })
            fetch(`https://app-a-store.herokuapp.com/api/user/${this.state.profile.id}`, {
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

        data.append('avatar', {
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

    componentDidMount() {
        this.getToken();
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    render() {
        return (
            <View style={style.container}>
                <LinearGradient colors={["#ff5000", "#ff6000", "#ff9000"]} style={style.linear}>
                    <TouchableOpacity onPress={() => this.handleEditPhoto()} style={style.photo}>
                        {this.state.editPhoto ? (
                            <Image
                                source={{ uri: this.state.editPhoto.uri }}
                                style={style.photo}
                            />
                        ) : (
                                <Image
                                    source={{ uri: this.state.profile.avatar }}
                                    style={style.photo}
                                />
                            )}
                    </TouchableOpacity>
                </LinearGradient>
                <View style={style.cont}>
                    <View style={style.contci}>
                        <Text style={{ padding: 2 }}>Nama</Text>
                        <TextInput
                            placeholder="Your Name"
                            keyboardType="default"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            value={this.state.editName}
                            onChangeText={(editName) => this.setState({ editName })}
                            style={{ width: "85%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                        />
                    </View>
                    <View style={style.contci}>
                        <Text style={{ padding: 2 }}>Email</Text>
                        <TextInput
                            placeholder="Input Your Email"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            value={this.state.editEmail}
                            onChangeText={(editEmail) => this.setState({ editEmail })}
                            style={{ width: "80%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                        />
                    </View>
                    <View style={style.contci}>
                        <Text style={{ padding: 2 }}>Alamat</Text>
                        <TextInput
                            placeholder="Your Address"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            value={this.state.editAlamat}
                            onChangeText={(editAlamat) => this.setState({ editAlamat })}
                            style={{ width: "80%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                        />
                    </View>
                    <View style={style.contci}>
                        <Text style={{ padding: 2 }}>No.Telphone</Text>
                        <TextInput
                            placeholder=" Minimum !0 Character"
                            selectionColor="dodgerblue"
                            color="dodgerblue"
                            keyboardType="numeric"
                            value={this.state.editTelp}
                            onChangeText={(editTelp) => this.setState({ editTelp })}
                            style={{ width: "75%", padding: 0, borderColor: "#fff", textAlign: "right" }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.editProfile()} style={style.button}>
                    {this.state.loading ? (
                        <LottieView source={require("../assets/890-loading-animation.json")} style={{ height: 70, width: 50, marginTop: 2 }} autoPlay loop />
                    ) : (
                            <Text style={{ color: "#ff6000" }}>Edit</Text>
                        )}
                </TouchableOpacity>
            </View>
        )
    }
}

export default editProfile;

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    linear: {
        height: 130,
        alignItems: "center",
        justifyContent: "center"
    },
    photo: {
        height: 95,
        width: 95,
        borderWidth: 1,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 47.5
    },
    cont: {
        height: 160,
        marginVertical: 10,
        marginHorizontal: 5,
        backgroundColor: "#fff",
    },
    contci: {
        height: 40,
        justifyContent: "center",
        padding: 7,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        height: 40,
        width: "99%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#ff6000",
        borderRadius: 5,
    },
})