import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Icon, Avatar, Divider } from "react-native-elements";
import global from "../../global";
// import profileBake from "../assets/profileBake.png";
import { ScrollView } from "react-native-gesture-handler";
export default class initBasket extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
  }
});
