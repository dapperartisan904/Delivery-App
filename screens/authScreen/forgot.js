import React, { Component } from "react";
import DatePicker from "react-native-datepicker";
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
import { forgotPwd } from "../../utils/Api";

export default class forgot extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }
  // Validate
  handleValidate = () => {
    if (this.state.email == "") {
      Alert.alert("Login Alert", "Please enter e-mail address ");
    } else if (this.state.email !== "") {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(this.state.email) === false) {
        Alert.alert("Login Alert", "Invalid e-mail address ");
      } else {
        this.handleForgot();
      }
    }
  };
  handleForgot = () => {
    forgotPwd(this.state.email).then(res=>{
      if(res.code == 1){
        Alert.alert("Login Alert", res.msg);
      } else {
        Alert.alert("Login Alert", res.msg);
      }
    })
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
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Icon
            name="arrow-left"
            color="#fff"
            type="material-community"
            size={40}
            iconStyle={styles.icon}
          />
        </TouchableOpacity>

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

          <View style={styles.fromContainer}>
            <Input
              placeholder="E-mail"
              placeholderTextColor="#fff"
              textContentType="email"
              inputContainerStyle={styles.inputFiedContainer}
              keyboardType="email-address"
              inputStyle={styles.inputText}
              onChangeText={v => this.setState({ email: v })}
              value={this.state.email}
            />
          </View>
        </View>
        {/* login Button */}
        <View>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            title="FORGOT"
            titleStyle={styles.buttonTitle}
            TouchableComponent={TouchableOpacity}
            onPress={this.handleValidate}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    // justifyContent: "center",
    backgroundColor: "#000"
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
    borderRadius: 20
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
  }
});
