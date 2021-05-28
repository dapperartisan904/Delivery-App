import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { Overlay } from "react-native-maps";
import global from "../../global";
import accept from "../assets/accept.png";
import cancel from "../assets/cancel.png";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class confirm extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      overlay: true
    };
  }
  render() {
    return (
      <View style={styles.bgContainer}>
        <Overlay
          isVisible={this.state.overlay}
          windowBackgroundColor="yellow"
          overlayBackgroundColor="red"
          height={600}
          width={400}
        >
          <View>
            <Text style={styles.requestText}>Booking Request</Text>
          </View>
          <View style={styles.leftContainer}>
            <Text style={styles.pickText}>Pick Up :</Text>
            <Text style={styles.addressText}>14 Tottenham Court.</Text>
            <Text style={styles.pickText}>Drop Off :</Text>
            <Text style={styles.addressText}>Londan Enland.</Text>
            <Text style={styles.pickText}>Product Category :</Text>
            <Text style={styles.addressText}>Gift</Text>
            <Text style={styles.pickText}>Product Type :</Text>
            <Text style={styles.addressText}>Light</Text>
            <Text style={styles.pickText}>Added Notes :</Text>
            <Text style={styles.addressText}>Light</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity>
              <Image source={accept} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={cancel} style={styles.image} />
            </TouchableOpacity>
          </View>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  requestText: {
    fontSize: 26,

    textAlign: "center",
    marginTop: global.CONSTANT.STATUSBAR + 20
  },

  pickText: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 10
  },
  addressText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10
  },
  leftContainer: {
    marginTop: 30
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  image: {
    height: 160,
    width: 200,
    resizeMode: "contain"
  }
});
