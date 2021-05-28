import React, { Component } from "react";
// import DatePicker from "react-native-datepicker";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Image,
  AsyncStorage
} from "react-native";
// import background from "../assets/background.png";
import { Button, Input, Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import global from "../../global";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";

export default class codeSignup extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      otp: ""
      // secure: true
    };
  }

  render() {
    return (
      // image background
      <ImageBackground
        source={global.ASSETS.BACKGROUND}
        style={styles.bgContainer}
      >
        <TouchableOpacity
          style={{ width: 70 }}
          onPress={() => this.props.navigation.navigate("Signup")}
        >
          <Icon
            name="arrow-left"
            color="#fff"
            type="material-community"
            size={40}
            iconStyle={styles.icon}
          />
        </TouchableOpacity>

        <KeyboardAwareScrollView
          // style={styles.container}
          enableOnAndroid
          extraScrollHeight={30}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={styles.bgContainer}
        >
          <Animatable.View animation="slideInDown">
            <Animatable.Image
              // animation="slideInDown"
              source={global.ASSETS.GRUBICON}
              style={styles.logo}
            />

            <Animatable.Image
              // animation="slideInDown"
              source={global.ASSETS.GRUB}
              style={styles.grub}
            />
            <Animatable.Image
              // animation="slideInDown"
              source={global.ASSETS.HOUSE}
              style={styles.grub}
            />
          </Animatable.View>

          <View style={styles.inputContainer}>
            {/* email container */}

            {/* phone number container */}
            <View style={styles.fromContainer}>
              <Input
                placeholder="Code"
                placeholderTextColor="#fff"
                textContentType="number"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="number-pad"
                inputStyle={styles.inputText}
                onChangeText={v => this.setState({ otp: v })}
                value={this.state.otp}
              />
            </View>
          </View>
          {/* login Button */}
          <View>
            <Button
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              title="SIGN UP"
              titleStyle={styles.buttonTitle}
              TouchableComponent={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("Login")}
            />
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
    // justifyContent: "center",
    // backgroundColor: "#000"
  },

  inputContainer: {
    marginBottom: 50,
    marginHorizontal: 50
  },
  fromContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginVertical: 20
    // marginHorizontal: 40
  },

  inputText: {
    fontWeight: "bold",
    fontSize: 18,
    // marginVertical: 10,
    color: "#fff",
    marginLeft: -11
  },
  inputFiedContainer: {
    borderBottomWidth: 0
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 10
    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 60,
    width: 270
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26
  },
  datePicker: {
    height: 74
  },
  buttonContainerRight: {
    width: 295
  },
  buttonTitleRight: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 6,
    color: "#fff",
    marginLeft: -194
  },
  logo: {
    height: 40,
    // width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    marginBottom: 10
    // marginTop: -36
  },
  grub: {
    height: 40,
    width: 100,
    resizeMode: "contain",
    alignSelf: "center"
  },
  icon: {
    // marginLeft: -100
    alignSelf: "flex-start",
    marginTop: global.CONSTANT.STATUSBAR,
    marginHorizontal: 20,
    height: 40
    // width: 60
  }
});
