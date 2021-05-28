import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import global from "../../global";
import { Button } from "react-native-elements";
import * as Animatable from "react-native-animatable";

export default class sendGift extends Component {
  static navigationOptions = {
    title: "Send Gift",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      // fontWeight: "bold"
      fontFamily: global.FONT.Simonetta_Regular
    }
  };
  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        <View style={styles.upperContainer}></View>
        <View style={styles.bottomContainer}>
          <View>
            <Image source={global.ASSETS.GIFTGIF} style={styles.image} />
          </View>
          <View>
            <Text style={styles.giftText}>
              A gift for every occasion and with the option to send money to
              anyone on grub house or by simply inviting them through the link
              they can use their gift to order from any restaurant on the grub
              house platform. {"\n"} OH YES Christmas came early.
            </Text>
          </View>
          <View style={styles.buttonFlexContainer}>
            <Animatable.View animation="slideInLeft">
              <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                title="SEND"
                titleStyle={styles.buttonTitle}
                TouchableComponent={TouchableOpacity}
                onPress={() => this.props.navigation.navigate("SendFood")}
              />
            </Animatable.View>
            <Animatable.View animation="slideInRight">
              <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                title="REQUEST"
                titleStyle={styles.buttonTitle}
                TouchableComponent={TouchableOpacity}
                onPress={() => this.props.navigation.navigate("RequestCoin")}
              />
            </Animatable.View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  upperContainer: {
    flex: 0.3,
    backgroundColor: "#fff"
  },
  bottomContainer: {
    flex: 0.7,
    backgroundColor: "#FFFFFF"
  },
  image: {
    height: 200,
    width: 300,
    resizeMode: "cover",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: -100
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "rgba(0,0,0,0.08)"

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 120
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20
  },
  buttonFlexContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  giftText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginHorizontal: 14,
    marginVertical: 20
  }
});
