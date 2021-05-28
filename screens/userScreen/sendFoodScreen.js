import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import global from "../../global";
import { Button, Icon, Input } from "react-native-elements";
import Contacts from "react-native-unified-contacts";
import { ScrollView } from "react-native-gesture-handler";

export default class sendFoodScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      available: "1",
      number: "",
    };
  }
  render() {
    return (
      // background container
      <ScrollView style={styles.bgContainer}>
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
          <Text style={styles.grubText}>Send gift to grub member</Text>
        </View>
        <View style={styles.inputFlexContainer}>
          <View>
            <Input
              placeholder="Enter Number"
              placeholderTextColor="#fff"
              inputContainerStyle={styles.inputFiedContainer}
              keyboardType="number-pad"
              inputStyle={styles.inputText}
              onChangeText={(v) => this.setState({ number: v })}
              value={this.state.number}
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
                  available: this.state.available == "0" ? "1" : "0",
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
        {this.state.number.length <= 7 && (
          <View>
            <Image source={global.ASSETS.SUSHI} style={styles.image} />
          </View>
        )}
        <View>
          {this.state.available == "0" && this.state.number.length >= 7 && (
            <View style={styles.coinContainer}>
              <View>
                <Text style={styles.giftText}>
                  A gift card for every occassion you can use it on almost every
                  store by using gift card code and buy eat play whatever you
                  like.
                </Text>
              </View>

              <View>
                <Button
                  containerStyle={styles.buttonContainer}
                  buttonStyle={styles.buttonStyle}
                  title="INVITE"
                  titleStyle={styles.buttonTitle}
                  TouchableComponent={TouchableOpacity}
                  // onPress={() => this.props.navigation.navigate("SendFood")}
                />
              </View>
            </View>
          )}
          {this.state.available == "1" && this.state.number.length > 7 && (
            <View>
              <View style={styles.coinContainer}>
                <View>
                  <Text style={styles.giftText}>
                  A gift for any occasion, you can use on all stores on the Grub house app. Enjoy your meal!
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Image
                    source={global.ASSETS.COINS}
                    style={{ height: 50, width: 50, resizeMode: "contain" }}
                  />
                  <Button
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                    title="SEND COIN"
                    titleStyle={styles.buttonTitle}
                    TouchableComponent={TouchableOpacity}
                    onPress={() => this.props.navigation.navigate("SendCoin")}
                  />
                  <Image
                    source={global.ASSETS.COINS}
                    style={{ height: 50, width: 50, resizeMode: "contain" }}
                  />
                </View>
              </View>
              <View style={styles.foodContainer}>
                <View>
                  <Text style={styles.giftText}>
                  Everyone loves a good surprise when they open their front door. Surprise a friend now by sending them something they didn’t expect
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Image
                    source={global.ASSETS.FOOD_GIFT}
                    style={{ height: 50, width: 50, resizeMode: "contain" }}
                  />

                  <Button
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                    title="SEND FOOD"
                    titleStyle={styles.buttonTitle}
                    TouchableComponent={TouchableOpacity}
                    onPress={() =>
                      this.props.navigation.navigate("DatePicker")
                    }
                  />
                  <Image
                    source={global.ASSETS.FOOD_GIFT}
                    style={{ height: 50, width: 50, resizeMode: "contain" }}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },

  buttonContainer: {
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
    // marginTop: 20

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 120,
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 18,
  },
  buttonFlexContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  giftText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginHorizontal: 20,
    marginVertical: 30,
    color: "#fff",
  },
  grubText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    // marginHorizontal: 20,
    // marginVertical: 30,
    color: "#000",
    marginTop: 26,
    marginBottom: 10,
  },
  icon: {
    color: "#000",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    // marginTop: 6,
    marginHorizontal: 10,
  },
  inputFiedContainer: {
    // borderWidth: 1,
    // borderColor: "#000",
    width: 200,
    height: 45,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomWidth: 0,
  },
  inputFlexContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  contactIcon: {
    color: "#000",
    marginTop: 5,
  },
  iconContainer: {
    height: 50,
    width: 50,
  },
  coinContainer: {
    // height: 210,
    width: 340,
    backgroundColor: "#000",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  foodContainer: {
    // height: 210,
    width: 340,
    backgroundColor: "gray",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "cover",
    alignSelf: "center",
  },
});
