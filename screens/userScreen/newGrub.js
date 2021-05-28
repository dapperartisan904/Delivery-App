import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { Icon, Button } from "react-native-elements";
import global from "../../global";

export default class newGrub extends Component {
  static navigationOptions = {
    title: "New Grub Group",
    headerStyle: {
      backgroundColor: "#fff"
    },
    headerRight: (
      <Icon
        name="account-group-outline"
        color="gray"
        type="material-community"
        size={35}
        iconStyle={{ marginHorizontal: 10 }}
        // Component={TouchableOpacity}
      />
    ),

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  render() {
    return (
      <ImageBackground source={global.ASSETS.FOOD1} style={styles.bgContainer}>
        {/* <View>
          <Image source={global.ASSETS.FOOD1} style={styles.image} />
        </View> */}
        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.buttonStyle}
          title="NEW GROUP"
          titleStyle={styles.buttonTitle}
          TouchableComponent={TouchableOpacity}
          onPress={() => this.props.navigation.navigate("NewProof")}
        />
        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.buttonStyle}
          title="VIEW PREVIOUS GROUP"
          titleStyle={styles.buttonTitle}
          TouchableComponent={TouchableOpacity}
          onPress={() => this.props.navigation.navigate("Previous")}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    // backgroundColor: "#fff"
    justifyContent: "center"

    // resizeMode: "cover"
  },
  buttonContainer: {
    alignSelf: "center",
    // backgroundColor: "#0",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 2

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "rgba(0,0,0,0.4)",
    height: 80,
    width: 300
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center"
    // marginTop: -6,
  },
  image: {
    height: 300,
    width: 400,
    resizeMode: "cover",
    alignSelf: "center"
  }
});
