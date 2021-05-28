import React, { Component } from "react";
import { Text, StyleSheet, View, Image, ImageBackground } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import * as Animatable from "react-native-animatable";
import global from "../../global";

const slides = [
  {
    key: "somethun",
    title: "ORDER TOGETHER",
    text:
      "Order as group or with your colleagues, each selecting what they prefer in the restaurant choosen.",
    image: require("../../assets/grubIntro6.png"),
    backgroundColor: "#fff",
  },
  {
    key: "somethun-dos",
    title: "SPLIT THE BILL",
    text:
      "Invite your friends to your new Grub-Group via links in the ‘new grub group’ section. split the bill inside the app. To avoid any confusion between parties.",
    image: require("../../assets/grubIntro2.png"),
    backgroundColor: "#fff",
  },
  {
    key: "somethun1",
    title: "COLLECTION OR DELIVERY?",
    text:
      "Decide whether someone would like to collect the items or if you would want it delivered",
    image: require("../../assets/grubIntro3.png"),
    backgroundColor: "#fff",
  },

];

export default class GroupIntroScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
    };
  }
  _renderItem = ({ item }) => {
    return (
      // <View style={{ flex: 1, backgroundColor: item.backgroundColor }}>
      <ImageBackground
        // source={global.ASSETS.GROUP_INTRO_BG}
        style={{ flex: 1, width: null, backgroundColor: "#fff" }}
      >
        <View style={{ flex: 0.7 }}>
          <Image
            // animation="slideInDown"
            // direction="alternate"
            // duration={2200}
            // iterationCount="infinite"
            source={item.image}
            style={styles.image}
          />
        </View>

        <View style={{ flex: 0.1 }}></View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </ImageBackground>
      // </View>
    );
  };
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.props.navigation.navigate("NewGrub");
    this.setState({ showRealApp: true });
  };
  render() {
    if (this.state.showRealApp) {
      return <GroupIntroScreen />;
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          slides={slides}
          onDone={this._onDone}
          buttonTextStyle={styles.button}
          onSkip={this._onDone}
          showSkipButton
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    width: null,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",

    // marginTop: 30
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 10,
    color: "#000",
  },
  image: {
    height: 360,
    width: "100%",
    alignSelf: "center",
    // marginTop: global.CONSTANT.STATUSBAR + 60,
    resizeMode: "cover",

  },
  button: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
