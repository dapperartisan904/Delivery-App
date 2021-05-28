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
  AsyncStorage,
} from "react-native";
// import background from "../assets/background.png";
import { Button, Input, Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import global from "../../global";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";
import { Signup } from "../../utils/Api";
import Loading from "../../components/Loading";

export default class signup extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userName: "boyka",
      currency: [{ value: "cbvuy", label: "India" }],
      email: "xiaorizhang@gmail.com",
      password: "",
      phoneNumber: "123456789",
      date: "",
      confirm_Password: "",
      otp: "",
      account_type: "",
      // secure: true
    };
  }

  // Validate
  handleValidate = () => {
    if (this.state.userName == "") {
      Alert.alert("Signup Alert", "Please enter  userName");
    } else if (this.state.phoneNumber == "") {
      Alert.alert("Signup Alert", "Please enter phone number");
    } else if (this.state.phoneNumber.length !== 10) {
      Alert.alert("Signup Alert", "Number field should equal to 10 characters");
    } else if (this.state.email == "") {
      Alert.alert("Signup Alert", "Please enter e-mail address ");
    } else if (this.state.email !== "") {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(this.state.email) === false) {
        Alert.alert("Signup Alert", "Invalid e-mail address ");
      } else if (this.state.password == "") {
        Alert.alert("Signup Alert", "Please enter password");
      } else if (this.state.password.length < 6) {
        Alert.alert(
          "Signup Alert",
          "Password field should not be less than 6 characters"
        );
      } else if (this.state.confirm_Password == "") {
        Alert.alert("Login Alert", "Please enter confirm password");
      } else if (this.state.password !== this.state.confirm_Password) {
        Alert.alert("Login Alert", "Password does not match");
      } else {
        Signup(this.state).then(d => {
          
        });
      }
    }
    // handleSignup = () => {
    //   this.props.navigation.navigate("UserApp");
    // };
  };
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

            <View style={styles.fromContainer}>
              <Input
                placeholder="User Name"
                placeholderTextColor="#fff"
                textContentType="name"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                inputStyle={styles.inputText}
                onChangeText={(v) => this.setState({ userName: v })}
                value={this.state.userName}
              />
            </View>
            {/* password container */}
            <View style={styles.fromContainer}>
              <Input
                placeholder="E-mail"
                placeholderTextColor="#fff"
                textContentType="email"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="email-address"
                inputStyle={styles.inputText}
                onChangeText={(v) => this.setState({ email: v })}
                value={this.state.email}
              />
            </View>
            {/* password container */}
            <View style={styles.fromContainer}>
              <Input
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                textContentType="password"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                inputStyle={styles.inputText}
                onChangeText={(v) => this.setState({ password: v })}
                value={this.state.password}
                // rightIcon={
                //   <Icon
                //     name="eye-outline"
                //     color="gray"
                //     type="material-community"
                //     size={32}
                //     iconStyle={styles.icon}
                //     Component={TouchableOpacity}
                //     onPress={() =>
                //       this.setState({ secure: !this.state.secure })
                //     }
                //   />
                // }
              />
            </View>
            {/* confirm Password */}
            <View style={styles.fromContainer}>
              <Input
                placeholder="Confirm Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                textContentType="password"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                inputStyle={styles.inputText}
                onChangeText={(v) => this.setState({ confirm_Password: v })}
                value={this.state.confirm_Password}
              />
            </View>
            {/* birthdate container */}
            <View style={styles.datePicker}>
              <DatePicker
                style={styles.buttonContainerRight}
                placeholder={
                  this.state.date == "" ? "Date of Birth" : this.state.date
                }
                showIcon={false}
                mode="date"
                format="YYYY-MM-DD"
                minDate="1980-05-01"
                maxDate="2060-06-01"
                confirmBtnText="Select"
                cancelBtnText="Cancel"
                minuteInterval={10}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: "#fff",
                    marginTop: 38,
                  },
                  placeholderText: styles.buttonTitleRight,
                }}
                onDateChange={(date) => {
                  // console.log(date);
                  this.setState({ date: date });
                }}
              />
            </View>
            {/* phone number container */}
            <View style={styles.fromContainer}>
              <Input
                placeholder="Phone Number"
                placeholderTextColor="#fff"
                textContentType="number"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="number-pad"
                inputStyle={styles.inputText}
                onChangeText={(v) => this.setState({ phoneNumber: v })}
                value={this.state.phoneNumber}
              />
            </View>

            {/* <View style={{ borderBottomWidth: 1, borderBottomColor: "#fff" }}>
              <RNPickerSelect
                onValueChange={(value) =>
                  this.setState({
                    account_type: value,
                  })
                }
                placeholder={{
                  label: "Choose Account Type",
                }}
                placeholderTextColor="#fff"
                style={pickerSelectStyles}
                items={[
                  { label: "Student", value: "Student" },
                  { label: "Family", value: "Family" },
                  { label: "Normal", value: "Normal" },
                ]}
              />
            </View>*/}
          </View> 
          {/* login Button */}
          <View>
            <Button
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              title="SIGN UP"
              titleStyle={styles.buttonTitle}
              TouchableComponent={TouchableOpacity}
              onPress={
                () => this.handleValidate()
                // this.props.navigation.navigate("Code")
              }
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
    width: null,
    // justifyContent: "center",
    // backgroundColor: "#000"
  },

  inputContainer: {
    marginBottom: 50,
    marginHorizontal: 50,
  },
  fromContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginVertical: 16,
    // marginHorizontal: 40
  },

  inputText: {
    fontWeight: "bold",
    fontSize: 18,
    // marginVertical: 10,
    color: "#fff",
    marginLeft: -11,
  },
  inputFiedContainer: {
    borderBottomWidth: 0,
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 10,
    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 60,
    width: 270,
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
  },
  datePicker: {
    height: 74,
  },
  buttonContainerRight: {
    width: 295,
  },
  buttonTitleRight: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 6,
    color: "#fff",
    marginLeft: -194,
  },

  logo: {
    height: 40,
    // width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR,
    // marginBottom: 10
    // marginTop: -36
  },
  grub: {
    height: 40,
    width: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  icon: {
    // marginLeft: -100
    alignSelf: "flex-start",
    marginTop: global.CONSTANT.STATUSBAR,
    marginHorizontal: 20,
    height: 40,
    // width: 60
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    // fontSize: 16,
    marginTop: 40,
    width: "90%",
    // alignSelf: "center",
    // borderRadius: 4,

    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    height: 50,
  },
  inputAndroid: {
    fontSize: 18,
    // width: "80%",
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
    marginLeft: -5,
  },
});
