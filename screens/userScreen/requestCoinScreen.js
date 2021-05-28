import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import global from "../../global";
import { Button, Icon, Input } from "react-native-elements";
import Contacts from "react-native-unified-contacts";
import { ScrollView } from "react-native-gesture-handler";

export default class requestCoinScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      available: "1",
      amount: "£"
    };
  }
  render() {
    return (
      // background container
      <ScrollView style={styles.bgContainer}>
        <View style={styles.upperContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="material-community"
              size={40}
              iconStyle={styles.icon}
              onPress={() => this.props.navigation.navigate("SendGift")}
            />
          </View>
          <View>
            <Text style={styles.grubText}>Request coin from grub member</Text>
          </View>
          <View style={styles.inputFlexContainer}>
            <View>
              <Input
                placeholder="Enter Number"
                placeholderTextColor="#000"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="number-pad"
                inputStyle={styles.inputText}
              />
            </View>
            <View>
              <Icon
                name="arrow-right"
                type="material-community"
                size={36}
                iconStyle={styles.contactIcon}
                onPress={() =>
                  this.setState({
                    available: this.state.available == "0" ? "1" : "0"
                  })
                }
              />
            </View>
          </View>
          <View>
            <Text style={styles.grubText}>
              {this.state.available == "0"
                ? "This number is not registered in the Grub House app"
                : null}
            </Text>
          </View>
        </View>
        <View style={styles.amountBackContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ amount: "£ 5" })}
            style={styles.amountContainer}
          >
            <Text style={styles.sendAmountText}>£ 5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ amount: "£ 10" })}
            style={styles.amountContainer}
          >
            <Text style={styles.sendAmountText}>£ 10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ amount: "£ 20" })}
            style={styles.amountContainer}
          >
            <Text style={styles.sendAmountText}>£ 20</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ amount: "£ 50" })}
            style={styles.amountContainer}
          >
            <Text style={styles.sendAmountText}>£ 50</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <View>
            <Input
              //   placeholder="Enter Amount"
              //   placeholderTextColor="#000"
              inputContainerStyle={styles.inputFiedContainerAmount}
              keyboardType="number-pad"
              inputStyle={styles.inputTextAmount}
              onChangeText={v => this.setState({ amount: v })}
              value={this.state.amount}
            />
          </View>

          <View style={styles.inputContainer1}>
            <Input
              placeholder="Message"
              placeholderTextColor="#000"
              inputContainerStyle={styles.inputFiedContainer1}
              keyboardType="default"
              inputStyle={styles.inputText}
              multiline={true}
            />
          </View>
          <View>
            <Button
              containerStyle={styles.sendButtonContainer}
              buttonStyle={styles.sendButtonStyle}
              title="REQUEST"
              titleStyle={styles.sendButtonTitle}
              TouchableComponent={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("RequestThankYou")}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  upperContainer: {
    flex: 0.4
    // backgroundColor: "#000"
  },
  bottomContainer: {
    flex: 0.6,
    backgroundColor: "#FFFFFF"
  },

  buttonContainer: {
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16
    // marginTop: 20

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 150
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 18
  },
  buttonFlexContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  giftText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginHorizontal: 20,
    marginVertical: 30,
    color: "#fff"
  },
  grubText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    // marginHorizontal: 20,
    // marginVertical: 30,
    color: "#000",
    marginTop: 26,
    marginBottom: 10
  },
  icon: {
    color: "#000",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    alignSelf: "flex-start",
    marginHorizontal: 10
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    // marginTop: 6,
    marginHorizontal: 10
  },
  inputFiedContainer: {
    // borderWidth: 1,
    // borderColor: "#000",
    width: 200,
    height: 45,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomWidth: 0
  },
  inputFlexContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  contactIcon: {
    color: "#000",
    marginTop: 5
  },
  iconContainer: {
    height: 50,
    width: 50
  },
  coinContainer: {
    // height: 210,
    width: 340,
    backgroundColor: "#000",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 10
  },
  inputTextAmount: {
    // fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    // marginTop: 6,
    marginHorizontal: 20,
    fontFamily: global.FONT.Simonetta_Regular
  },
  inputFiedContainerAmount: {
    // borderWidth: 1,
    // borderColor: "#000",
    width: 150,
    height: 45,
    // borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginVertical: 20
  },
  amoutText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta,
    textAlign: "center",
    alignSelf: "center"
    // marginVertical: 20
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: "#000",
    width: 80,
    borderRadius: 10,
    height: 45
  },
  amountBackContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20
  },
  sendAmountText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginVertical: 10
    // alignSelf: "center"
  },
  sendButtonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 30
    // marginBottom: 16
    // marginTop: 20

    // marginHorizontal: 70
  },
  sendButtonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 200
    // marginTop: 50
  },
  sendButtonTitle: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 20
  },
  inputContainer: {
    // width: 200,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderWidth: 1
  },
  inputFiedContainer1: {
    borderColor: "gray",

    borderBottomWidth: null
  },
  inputContainer1: {
    borderWidth: 1,
    borderColor: "gray",
    // width: 140,
    borderBottomWidth: null,
    marginHorizontal: 10,
    height: 200
  }
});
