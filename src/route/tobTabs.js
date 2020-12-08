import React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import Pembelian from "../screen/pembelian"
import Toko from "../screen/toko"

const Tabs = createMaterialTopTabNavigator();

const Top = () => {
    return (
        <Tabs.Navigator>
            <Tabs.Screen name="Pembelian" component={Pembelian} />
            <Tabs.Screen name="Toko" component={Toko} />
        </Tabs.Navigator>
    )
}

export default Top;