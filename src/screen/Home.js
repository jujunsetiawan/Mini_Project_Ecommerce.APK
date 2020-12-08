import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, RefreshControl, TouchableWithoutFeedback } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import Swiper from 'react-native-swiper'
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import style from "../styles/styleHome"
import ShopingCartIcon from "../component/shopingCartIcon"
import { NavigationEvents } from "react-navigation"
import { connect } from "react-redux"
import _ from "lodash"

class Home extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            toko: {},
            products: [],
            category: [],
            notif: [],
            loading: true,
            refreshing: false,
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
            .then(() => this.getProducts())
    }
    getProducts() {
        this.setState({ loading: true })
        console.log(this.setState.token);
        fetch("https://app-a-store.herokuapp.com/api/product", {
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
                    this.setState({ products: responseJson.data[0] });
                    this.setState({ category: responseJson.data[1] });
                    this.setState({ notif: responseJson.data[2] });
                    this.setState({ loading: false });
                    console.log(responseJson);
                } else {
                    this.logOut();
                    this.setState({ loading: false });
                }
                this.setState({ refreshing: false })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ refreshing: false })
            });
    }
    componentDidMount() {
        this.getToken();
    }
    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    _onRefresh = () => {
        this.setState({ refreshing: true })
    }
    render() {
        return (
            <View>
                <LinearGradient style={style.header} colors={["#037ffc", "#2ed5ff"]}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require("../assets/logo.png")}
                                style={style.logo1}
                            />
                            <Text style={style.title}>A-Store</Text>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("Search", {a: this.state.notif.cart})}>
                                <View style={style.contsrch}>
                                    <Image
                                        source={require("../assets/search.png")}
                                        style={style.search}
                                    />
                                    <View style={{ marginLeft: 5, borderColor: "#fff", padding: 0, width: "80%" }}>
                                        <Text style={{ opacity: 0.4 }}>Cari Barang</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <TouchableOpacity style={{ marginRight: 7 }} onPress={() => this.props.navigation.navigate("Card")}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                            style={style.logo}
                        />
                    </TouchableOpacity>
                    {this.state.notif.cart == 0 ? (
                        <View></View>
                    ) : (
                            <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "red", position: "absolute", top: 7, right: 7, opacity: 0.8, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 10, color: "#fff" }}>{this.state.notif.cart}</Text>
                            </View>
                        )}
                </LinearGradient>
                {this.state.loading ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../assets/9844-loading-40-paperplane.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this.getProducts()
                                        this._onRefresh()
                                    }}
                                />
                            }
                            scrollEventThrottle={15}
                            showsVerticalScrollIndicator={false}>
                            <View style={style.sliderContainer}>
                                <Swiper autoplay height={100}>
                                    <View style={style.slide}>
                                        <Image
                                            source={require("../assets/product.png")}
                                            resizeMode="cover"
                                            style={style.sliderImage}
                                        />
                                    </View>
                                    <View style={style.slide}>
                                        <Image
                                            source={{ uri: "https://st1.latestly.com/wp-content/uploads/2020/08/1-2020-08-20T182900.717.jpg" }}
                                            resizeMode="cover"
                                            style={style.sliderImage}
                                        />
                                    </View>
                                    <View style={style.slide}>
                                        <Image
                                            source={{ uri: "https://www.roxio.com/static/roxio/images/products/game-capture/hd-pro/rgc-hdpro-capture.png" }}
                                            resizeMode="cover"
                                            style={style.sliderImage}
                                        />
                                    </View>
                                    <View style={style.slide}>
                                        <Image
                                            source={{ uri: "https://c0.wallpaperflare.com/preview/368/960/936/fashion-lifestyle-traveler-travel.jpg" }}
                                            resizeMode="cover"
                                            style={style.sliderImage}
                                        />
                                    </View>
                                    <View style={style.slide}>
                                        <Image
                                            source={{ uri: "https://cdn.shopify.com/s/files/1/1859/8979/articles/best-product-photography-ecommerce-banner-image1_1024x1024.png?v=1519906851" }}
                                            resizeMode="cover"
                                            style={style.sliderImage}
                                        />
                                    </View>
                                </Swiper>
                            </View>
                            <Text style={style.text}>Kategori :</Text>
                            <ScrollView showsHorizontalScrollIndicator={false}>
                                <View style={[style.categoryContainer, { marginTop: 10 }]}>
                                    {this.state.category.map((item, index) => (
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Kategori", { category: item, a : this.state.notif.cart })} key={index} style={style.categoryBtn}>
                                            <View style={style.categoryIcon}>
                                                <Image
                                                    source={{ uri: item.icon }}
                                                    style={{ height: 30, width: 30, }}
                                                />
                                            </View>
                                            <Text style={style.categoryBtnTxt}>{item.kategori}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    {/* <TouchableOpacity style={style.categoryBtn}>
                                    <View style={style.categoryIcon}>
                                        <Image
                                            source={require("../assets/fashion.png")}
                                            style={{ height: 30, width: 30, tintColor: "dodgerblue" }}
                                        />
                                    </View>
                                    <Text style={style.categoryBtnTxt}>Fashion</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.categoryBtn}>
                                    <View style={style.categoryIcon}>
                                        <Image
                                            source={require("../assets/accessory.png")}
                                            style={{ height: 30, width: 30, tintColor: "dodgerblue" }}
                                        />
                                    </View>
                                    <Text style={style.categoryBtnTxt}>accessorise</Text>
                                </TouchableOpacity> */}
                                </View>
                                {/* <View style={style.categoryContainer}>
                                <TouchableOpacity style={style.categoryBtn}>
                                    <View style={style.categoryIcon}>
                                        <Image
                                            source={require("../assets/gamepad.png")}
                                            style={{ height: 30, width: 30, tintColor: "dodgerblue" }}
                                        />
                                    </View>
                                    <Text style={style.categoryBtnTxt}>Gaming</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.categoryBtn}>
                                    <View style={style.categoryIcon}>
                                        <Image
                                            source={require("../assets/cosmetics.png")}
                                            style={{ height: 30, width: 30, tintColor: "dodgerblue" }}
                                        />
                                    </View>
                                    <Text style={style.categoryBtnTxt}>Beauty</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.categoryBtn}>
                                    <View style={style.categoryIcon}>
                                        <Image
                                            source={require("../assets/fast-food.png")}
                                            style={{ height: 30, width: 30, tintColor: "dodgerblue" }}
                                        />
                                    </View>
                                    <Text style={style.categoryBtnTxt}>food</Text>
                                </TouchableOpacity>
                            </View> */}
                            </ScrollView>
                            <Text style={style.text}>Produk Terbaru :</Text>
                            <View style={style.container}>
                                {this.state.products.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Detail", { product: item, a: this.state.notif.cart })} style={style.background}>
                                        <Image
                                            source={{ uri: item.thumbnail }}
                                            style={{ height: 120, width: null, borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
                                        />
                                        <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
                                            <Text numberOfLines={2} style={{ fontSize: 14 }}>{item.nm_barang}</Text>
                                            <Text style={{ color: "dodgerblue", marginTop: 5, fontSize: 14 }}>Rp.{this.toPrice(item.harga)}</Text>
                                            <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                    <TouchableOpacity>
                                                        <Image
                                                            source={require("../assets/star.png")}
                                                            style={{ height: 13, width: 13 }}
                                                        />
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Image
                                                            source={require("../assets/favourites.png")}
                                                            style={{ height: 10, width: 10, marginRight: 5, marginTop: 2 }}
                                                        />
                                                        {item.terjual == null ? (
                                                            <Text style={{ color: "#888", fontSize: 10 }}>Terjual 0</Text>
                                                        ) : (
                                                                <Text style={{ color: "#888", fontSize: 10 }}>Terjual {item.terjual}</Text>
                                                            )}
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View></View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Image
                                                            source={require("../assets/map-placeholder.png")}
                                                            style={{ height: 10, width: 10, marginRight: 3, opacity: 0.5, marginTop: 3 }}
                                                        />
                                                        <Text style={{ textAlign: "right", color: "#777", fontSize: 11 }}>{item.store.kota}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={{ height: 50 }}></View>
                        </ScrollView>
                    )}
            </View>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addItemToCart: product =>
            dispatch({ type: 'ADD_TO_CART', payload: product }),
    };
};
export default connect(null, mapDispatchToProps)(Home);
