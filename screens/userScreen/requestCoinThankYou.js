import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Icon, Button } from "react-native-elements";
import global from "../../global";

export default class requestCoinThankYou extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.bgContainer}>
        {/* <View style={styles.iconContainer}>
          <Icon
            name="arrow-left"
            type="material-community"
            size={40}
            iconStyle={styles.icon}
            onPress={() => this.props.navigation.navigate("RequestCoin")}
          />
        </View> */}
        <View style={{ alignSelf: "center" }}>
          <Image source={global.ASSETS.JARCOIN} style={styles.image} />
        </View>
        <View>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            title="HOME"
            titleStyle={styles.buttonTitle}
            TouchableComponent={TouchableOpacity}
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    justifyContent: "center"
  },
  iconContainer: {
    height: 50,
    width: 50
  },
  icon: {
    color: "#000",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    alignSelf: "flex-start",
    marginHorizontal: 10
  },
  image: {
    height: 300,
    width: 300
  },
  buttonContainer: {
    alignSelf: "flex-end",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 20,
    marginTop: 30,
    marginHorizontal: 10
    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 160
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 26,
    marginVertical: -5
  }
});
