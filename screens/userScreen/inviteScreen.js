import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image
} from "react-native";
// import background from "../assets/background.png";
import { Icon } from "react-native-elements";
import { Linking } from "expo";
import global from "../../global";
import { ScrollView } from "react-native-gesture-handler";

export default class inviteScreen extends Component {
  static navigationOptions = {
    title: "Invite Friends",
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
      <ScrollView style={styles.bgContainer}>
        {/* <View style={styles.textContainer}> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20
          }}
        >
          <TouchableOpacity onPress={() => Linking.openURL("sms:+17602843361")}>
            <Image source={global.ASSETS.MESSAGE} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto: info@phontinent.com")}
          >
            <Image source={global.ASSETS.MAIL} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20
          }}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL("https://wa.me/+17602843361")}
          >
            <Image source={global.ASSETS.WHATSAPP} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("http://m.me/PhontinentTechnologies")
            }
          >
            <Image source={global.ASSETS.MESSANGER} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20
          }}
        >
          <TouchableOpacity
          // onPress={() => Linking.openURL("https://wa.me/+17602843361")}
          >
            <Image source={global.ASSETS.INSTA} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
          // onPress={() =>
          //   Linking.openURL("http://m.me/PhontinentTechnologies")
          // }
          >
            <Image source={global.ASSETS.SNAP} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.text}>
            Invite your friends or family from a number of social networks
          </Text>
        </View>
      </ScrollView>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  textContainer: {
    justifyContent: "center",
    borderRadius: 10,
    height: "97%",
    margin: 10,
    backgroundColor: "#fff"
  },
  text: {
    fontSize: 20,
    marginHorizontal: 4,
    fontWeight: "normal",
    // textAlign: "justify",
    // marginHorizontal: 20,
    color: "#fff"
  },
  iconContainer: {
    flexDirection: "row",
    marginTop: 20
    // justifyContent: "flex-end"
  },
  label: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 10,
    alignSelf: "center"
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: "cover",
    alignSelf: "center",
    margin: 5
    // width: 400
  },
  leftIcon: {
    marginHorizontal: 10
  },
  imageContainer: {
    height: 340,
    width: null,
    marginVertical: 20
  },
  text: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginHorizontal: 14,
    marginVertical: 20
  }
});
