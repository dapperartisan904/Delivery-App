import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import * as Animatable from "react-native-animatable";
import global from "../../global";

const slides = [
  {
    key: "somethun",
    title: "Pick the Meal",
    logo: require("../../assets/logo_black.png"),
    text:
      "Easily find the best type of food your \n craving through our innovative app.",
    image: require("../../assets/intro10.png"),
    backgroundColor: "#fff"
  },
  {
    key: "somethun1",
    logo: require("../../assets/logo_black.png"),

    title: "Food Court",
    text: "See what delicious meals people\n  around you are indulging in.",
    image: require("../../assets/foodCourt.png"),
    backgroundColor: "#fff"
  },
  {
    key: "somethun1",
    logo: require("../../assets/logo_black.png"),

    title: "Send Gift",
    text:
      "Send that special someone something you know they \n would just love, or if you don’t know what they like,\n we are here for you with our ‘’Send coin’’ option.",
    image: require("../../assets/sendGift.png"),
    backgroundColor: "#fff"
  },

  {
    key: "somethun1",
    logo: require("../../assets/logo_black.png"),

    title: "Student Discount",
    text:
      "We have got you students!! With our app students\n automatically get 10% off everything every time!!! ",
    image: require("../../assets/intro4.png"),
    backgroundColor: "#fff"
  },
  {
    key: "somethun-dos",
    title: "Track your Meal",
    logo: require("../../assets/logo_black.png"),

    text:
      "Always keep updated on the status of your meal with our\n traffic  light process you will know what is going on at each \n stage  of your meal& see where your driver is at all times.",
    image: require("../../assets/intro2.png"),
    backgroundColor: "#fff"
  }
];

export default class Introduction extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false
    };
  }
  _renderItem = ({ item, index: i }) => {
    return (
      <View style={{ flex: 1, backgroundColor: item.backgroundColor }}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ flex: 0.6 }}>
            <Image source={i == 0 && item.logo} style={styles.logo} />
            <Text style={styles.title}>{item.title}</Text>
            <Animatable.Image
              animation="fadeInUpBig"
              duration={3000}
              source={item.image}
              style={styles.image}
            />
          </View>

          <View style={{ flex: 0.2 }}></View>

          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.props.navigation.navigate("Auth");
    this.setState({ showRealApp: true });
  };
  render() {
    if (this.state.showRealApp) {
      return <Introduction />;
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          slides={slides}
          buttonTextStyle={styles.button}
          onDone={this._onDone}
          onSkip={this._onDone}
          // skipLabel="Skip"
          showSkipButton
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    width: null
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"

    // marginTop: 30
  },
  text: {
    fontSize: 14,
    textAlign: "center"
  },
  image: {
    height: 300,
    width: 320,
    alignSelf: "center",
    // marginTop: global.CONSTANT.STATUSBAR,
    resizeMode: "contain"
  },
  button: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold"
  },
  logo: {
    height: 200,
    width: 200,
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR,
    resizeMode: "contain"
  }
});
