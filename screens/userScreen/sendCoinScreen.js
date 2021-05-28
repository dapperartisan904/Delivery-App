import React, { Component } from "react";
import { Text, StyleSheet, View, Image, ImageBackground } from "react-native";
import global from "../../global";
import { Input, Button, Icon } from "react-native-elements";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";

export default class sendCoinScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      amount: "£",
    };
  }

  render() {
    return (
      <ImageBackground
        style={styles.bgContainer}
        source={global.ASSETS.SEND_COIN_BG}
      >
        <ScrollView style={styles.bgContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="material-community"
              size={40}
              iconStyle={styles.icon}
              onPress={() => this.props.navigation.navigate("SendFood")}
            />
          </View>

          <View style={{ marginTop: global.CONSTANT.STATUSBAR + 50 }}>
            <View>
              <Text style={styles.coinsText}>Send coins to Linda Okolo</Text>
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
            <View>
              <Input
                //   placeholder="Enter Amount"
                //   placeholderTextColor="#000"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="number-pad"
                inputStyle={styles.inputText}
                onChangeText={(v) => this.setState({ amount: v })}
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
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                title="SEND"
                titleStyle={styles.buttonTitle}
                TouchableComponent={TouchableOpacity}
                //   onPress={() => this.props.navigation.navigate("SendCoin")}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    // backgroundColor: "#fff"
    // justifyContent: "center"
  },

  cardContainer: {
    width: 340,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    borderRadius: 10,
  },
  coinsText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  image: {
    height: 40,
    width: 50,
    resizeMode: "cover",
    margin: 10,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  inputText: {
    // fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    // marginTop: 6,
    marginHorizontal: 20,
    fontFamily: global.FONT.Simonetta_Regular,
  },
  inputFiedContainer: {
    // borderWidth: 1,
    // borderColor: "#000",
    width: 150,
    height: 45,
    // borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginVertical: 20,
  },
  amoutText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta,
    textAlign: "center",
    alignSelf: "center",
    // marginVertical: 20
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: "#000",
    width: 80,
    borderRadius: 10,
    height: 45,
  },
  amountBackContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  sendAmountText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginVertical: 10,
    // alignSelf: "center"
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    // marginTop: 20

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 200,
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
  },
  icon: {
    color: "#000",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  inputContainer: {
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
  },
  inputFiedContainer1: {
    borderColor: "gray",

    borderBottomWidth: null,
  },
  inputContainer1: {
    borderWidth: 1,
    borderColor: "gray",
    // width: 140,
    borderBottomWidth: null,
    marginHorizontal: 10,
    height: 200,
  },
});
