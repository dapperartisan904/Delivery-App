import React, { Component } from "react";
import { Text, StyleSheet, ActivityIndicator } from "react-native";
import MainNavigator from "./navigators/MainNavigator";
import * as Font from "expo-font";
import Loading from "./components/Loading";

import { Provider } from 'react-redux';
import configureStore from './store/store/configureStore';
const store = configureStore()

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  // load custom font function
  async componentDidMount() {
    await Font.loadAsync({
      "Italianoo-Italic": require("./assets/fonts/Italianno-Regular.ttf"),
      "Yeon-Sung": require("./assets/fonts/YeonSung-Regular.ttf"),
      "Simonetta-Black": require("./assets/fonts/Simonetta-Black.ttf"),
      "Simonetta-Regular": require("./assets/fonts/Simonetta-Regular.ttf"),
      "ITCBLKAD": require("./assets/fonts/ITCBLKAD.ttf"),
      "GEROGIA": require("./assets/fonts/georgia-italic.ttf"),
    });
    this.setState({
      loading: false,
    });
  }
  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Provider store = { store }>
        <MainNavigator />
        <Loading />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({});
