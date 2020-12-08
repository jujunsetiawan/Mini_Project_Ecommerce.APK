import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Provider } from "react-redux"
import store from "./src/store"
import Navigation from './src/route/navigation'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    )
  }
}

export default App
