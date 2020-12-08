import React from "react"
import { View, Image } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import Icon from "react-native-vector-icons/Ionicons"
import Intro from "../screen/intro"
import Home from "../screen/Home"
import Profile from "../screen/profile"
import Chat from "../screen/chat"
import Add from "../screen/addproduct"
import Open from "../screen/openStore"
import Splash from "../screen/splash"
import Card from "../screen/card"
import editProfile from "../screen/editProfile"
import editProduct from "../screen/editPrdct"
import Transaksi from "../screen/transaksi"
import Kategori from "../screen/kategori"
import DetailStore from "../screen/detailStore"
import Login from "../auth/login"
import Register from "../auth/register"
import Forgot from "../auth/forgotpassword"
import Detail from "../component/detail"
import Detel from "../component/detailMyPrdct"
import DetailCart from "../component/detailCart"
import Pay from "../component/pay"
import Confirm from "../component/confirm"
import confirmPay from "../component/confirmPay"
import Sending from "../component/sending"
import Chet from "../component/Chat"
import Search from "../component/search"
import Detil from "../component/detailProduct"

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const Bottom = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#fff"
            backBehavior={"initialRoute"}
            shifting={true}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: "Home",
                    tabBarColor: "dodgerblue",
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={Chat}
                options={{
                    tabBarLabel: "Chat",
                    tabBarColor: "#009387",
                    tabBarIcon: ({ color }) => (
                        <Icon name="chatbox" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: "Profile",
                    tabBarColor: "tomato",
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-person" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Forgot" component={Forgot} options={{ headerShown: false }} />
                <Stack.Screen name="Card" component={Card} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Bottom} options={{ headerShown: false }} />
                <Stack.Screen name="Transaksi" component={Transaksi} options={{ headerShown: false }} />
                <Stack.Screen name="Chet" component={Chet} options={{ headerShown: false }} />
                <Stack.Screen name="Kategori" component={Kategori} options={{ headerShown: false }} />
                <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
                <Stack.Screen name="DetailStore" component={DetailStore} options={{ headerShown: false }} />
                <Stack.Screen name="Konfirmasi Pembayaran" component={confirmPay} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Pengiriman" component={Sending} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Tambah Produk" component={Add} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Buka Toko" component={Open} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Edit Profile" component={editProfile} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Edit Produk" component={editProduct} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Pembayaran" component={Pay} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Konfirmasi Terima Barang" component={Confirm} options={{ headerTitleStyle: true }} />
                <Stack.Screen name="Detail" component={Detail} options={{ headerBackTitleVisible: false, headerTitle: false, headerTransparent: true, headerTintColor: "#fff" }} />
                <Stack.Screen name="Detel" component={Detel} options={{ headerBackTitleVisible: false, headerTitle: false, headerTransparent: true, headerTintColor: "#fff" }} />
                <Stack.Screen name="Detil" component={Detil} options={{ headerBackTitleVisible: false, headerTitle: false, headerTransparent: true, headerTintColor: "#fff" }} />
                <Stack.Screen name="Detol" component={DetailCart} options={{ headerBackTitleVisible: false, headerTitle: false, headerTransparent: true, headerTintColor: "#fff" }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;