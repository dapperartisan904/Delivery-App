import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import global from "./global";
import { Button } from "react-native-elements";

export default class emptyBasket extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <ImageBackground
        source={global.ASSETS.SEND_COIN_BG}
        style={{ flex: 1, width: null, backgroundColor: "#fff" }}
      >
        <View style={{ flex: 0.7 }}>
          <Image source={global.ASSETS.EMPTY_BASKET} style={styles.image} />
        </View>

        {/* <View style={{ flex: 0.1 }}></View> */}
        <Text style={styles.title}>{"your basket is empty"}</Text>
        <Text style={styles.text}>
          {"Let's solve that by visiting the closest restaurant to us"}
        </Text>

        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.buttonStyle}
          title="Nearby Restaurants"
          titleStyle={styles.buttonTitle}
          TouchableComponent={TouchableOpacity}
          activeOpacity={0.6}
          onPress={() => this.props.navigation.navigate("Nearby")}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    textTransform: "capitalize",
    // marginTop: 30
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 10,
    color: "#000",
  },
  image: {
    height: 250,
    width: 250,
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR + 60,
    resizeMode: "contain",
  },
  buttonContainer: {
    alignSelf: "center",
    // backgroundColor: "#0",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 2,

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "rgba(0,0,0,0.2)",
    height: 50,
    width: 200,
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    // marginTop: -6,
  },
});
