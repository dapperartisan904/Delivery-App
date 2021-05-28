import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import global from "../../global";
import { Icon, Input, Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DATA = [
  {
    id: "1",
    time: "Birthday"
  },
  {
    id: "2",
    time: "Anniversary"
  },
  {
    id: "3",
    time: "Date"
  },
  {
    id: "4",
    time: "Business Meal"
  },
  {
    id: "5",
    time: "Special Occasion"
  }
];

export default class tableReservation extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      data: DATA
    };
  }
  render() {
    return (
      <View style={styles.bgContainer}>
        <ImageBackground
          source={global.ASSETS.RESTO}
          style={styles.upperContainer}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="material-community"
              size={40}
              iconStyle={styles.backIcon}
              onPress={() => this.props.navigation.navigate("Dinning")}
            />
            <Text style={styles.modifyText}>Modify Reservation</Text>
          </View>
        </ImageBackground>
        <View style={styles.bottomContainer}>
          <View style={{ flex: 0.9 }}>
            <View style={styles.cardContainer}>
              <View style={styles.restaurantContainer}>
                <View style={{ alignSelf: "center" }}>
                  <Text style={styles.dayText}>MAR</Text>
                  <Text style={styles.dateText}>5</Text>
                  <Text style={styles.dayText}>Thursday</Text>
                </View>
                <View>
                  <Text style={styles.nameText}>Plateau Bar & Grill</Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Icon
                      name="account"
                      type="material-community"
                      size={20}
                      iconStyle={styles.icon}
                    />
                    <Text style={styles.dayText}>Table for 2 people</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Icon
                      name="clock-outline"
                      type="material-community"
                      size={20}
                      iconStyle={styles.icon}
                    />
                    <Text style={styles.dayText}>5:00 PM</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.tableText}>What's the occasion?</Text>
            </View>
            <View style={styles.flatList}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.data}
                renderItem={({ item: d }) => (
                  <TouchableOpacity>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>{d.time}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <KeyboardAwareScrollView
              // style={styles.container}
              enableOnAndroid
              extraScrollHeight={30}
              showsVerticalScrollIndicator={false}
              // contentContainerStyle={styles.bgContainer}
            >
              <View>
                <Input
                  placeholder="Special Requests (optional)"
                  placeholderTextColor="gray"
                  inputContainerStyle={styles.inputFiedContainer}
                  keyboardType="default"
                  inputStyle={styles.inputText}
                />
              </View>
              <View>
                <Input
                  placeholder="Phone Number"
                  placeholderTextColor="gray"
                  inputContainerStyle={styles.inputNumberContainer}
                  keyboardType="number-pad"
                  inputStyle={styles.inputNumberText}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>

          <View style={{ flex: 0.1 }}>
            <View>
              <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                title="RESERVE"
                titleStyle={styles.buttonTitle}
                TouchableComponent={TouchableOpacity}
                //   onPress={() => this.props.navigation.navigate("SendCoin")}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  upperContainer: {
    flex: 0.3,
    backgroundColor: global.COLOR.PRIMARY
  },
  bottomContainer: {
    flex: 0.7
    // backgroundColor: "#000"
  },
  backIcon: {
    alignSelf: "flex-start",
    color: "#fff",
    marginHorizontal: 10
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: global.CONSTANT.STATUSBAR
  },
  modifyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center"
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: -60
  },
  dayText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    alignSelf: "center"
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: 200
  },
  restaurantContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20
  },
  icon: {
    color: "gray",
    marginRight: 8
  },

  tableText: {
    fontSize: 20,
    // alignSelf: "center",
    marginHorizontal: 10,
    marginTop: 20
    // color: "gray"
  },
  timeContainer: {
    backgroundColor: "#000",
    borderRadius: 3,
    height: 36,
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 20
  },
  timeText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 10
  },
  flatList: {
    height: 100
  },
  inputText: {
    // fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    // marginTop: 6,
    marginHorizontal: 20,
    fontFamily: global.FONT.Simonetta_Regular
  },
  inputFiedContainer: {
    // borderWidth: 1,
    // borderColor: "#000",
    // width: 130,
    height: 45,
    borderRadius: 10,
    // backgroundColor: "#fff",
    alignSelf: "center"
  },
  inputNumberText: {
    // fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    // marginTop: 6,
    marginHorizontal: 20,
    fontFamily: global.FONT.Simonetta_Regular
  },
  inputNumberContainer: {
    // borderWidth: 1,
    // borderColor: "#000",
    height: 45,
    borderRadius: 10,
    // backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 20
  },
  buttonContainer: {
    alignSelf: "center",

    // borderRadius: 20,
    marginBottom: 16
    // marginTop: 20

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "#000",
    height: 54,
    width: 400
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 20
  }
});
