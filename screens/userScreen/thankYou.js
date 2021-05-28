import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Input, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";

import global from "../../global";

export default class thankYou extends Component {
  static navigationOptions = {
    title: "Customer Service",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 22
    },
    headerRight: (
      <Image
        source={global.ASSETS.CUSTOMERSUPPORT}
        style={{ height: 40, width: 60, resizeMode: "cover" }}
      />
    )
  };
  render() {
    return (
      <View style={styles.bgContainer}>
        <View>
          <Animatable.View animation="slideInDown">
            <Animatable.Image
              animation="slideInDown"
              source={global.ASSETS.GRUBICON}
              style={styles.logo}
            />

            <Animatable.Image
              animation="slideInLeft"
              source={global.ASSETS.GRUB}
              style={styles.grub}
            />
            <Animatable.Image
              animation="slideInRight"
              source={global.ASSETS.HOUSE}
              style={styles.grub}
            />
          </Animatable.View>
        </View>
        <Text style={styles.thankYouText}> THANK YOU </Text>
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
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  thankYouText: {
    fontSize: 50,
    fontFamily: global.FONT.Simonetta,
    color: "#fff",
    alignSelf: "center",
    marginVertical: 20
  },
  logo: {
    height: 40,
    // width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR + 20,
    marginBottom: 10
    // marginTop: -36
  },
  grub: {
    height: 60,
    width: 120,
    resizeMode: "contain",
    alignSelf: "center"
  },
  logo: {
    height: 60,
    // width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR + 20,
    marginBottom: 10
    // marginTop: -36
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 20
    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 200
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 26,
    marginVertical: -5
  }
});
