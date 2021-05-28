import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { ScrollView } from "react-native-gesture-handler";
// import global.ASSETS.BURGER from "../assets/global.ASSETS.BURGER.png";
import ImageOverlay from "react-native-image-overlay";
import global from "../../global";
import { Icon } from "react-native-elements";
import one from "../../assets/one.png";
import noodles from "../../assets/noodles.png";
import pizza from "../../assets/pizza.png";
import two from "../../assets/two.png";
import three from "../../assets/three.png";
import four from "../../assets/four.png";
import five from "../../assets/five.png";

export default class gridScreen extends Component {
  static navigationOptions = {
    title: "FOOD COURT",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
