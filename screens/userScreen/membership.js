import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity
} from "react-native";
import global from "../../global";
import { Button } from "react-native-elements";

const DATA = [
  {
    id: "1",
    number: "1",
    time: "Year Grub House Plus",
    amount: "£ 199.00"
  },
  {
    id: "2",
    number: "1",
    time: "Year Grub House Plus",
    amount: "£ 199.00"
  },
  {
    id: "3",
    number: "1",
    time: "Year Grub House Plus",
    amount: "£ 199.00"
  }
];
export default class membership extends Component {
  static navigationOptions = {
    title: "Membership",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
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
        <View style={styles.upperContainer}>
          <ImageBackground
            source={global.ASSETS.BGIMAGE}
            style={styles.image}
          ></ImageBackground>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.offerText}>Special Offer</Text>
          <Text style={styles.grubText}>
            Never Before Offer! Buy Grub House Plus At Special Prices.
          </Text>
          <FlatList
            horizontal
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d }) => (
              <View style={styles.cardContainer}>
                <View style={{ marginHorizontal: 50 }}>
                  <Text style={styles.numberText}>{d.number}</Text>
                  <Text style={styles.timeText}>{d.time}</Text>
                  <Text style={styles.amountText}>{d.amount}</Text>
                  <View>
                    <Button
                      containerStyle={styles.buttonContainer}
                      buttonStyle={styles.buttonStyle}
                      title="BUY"
                      titleStyle={styles.buttonTitle}
                      TouchableComponent={TouchableOpacity}
                      onPress={() => this.props.navigation.navigate("")}
                    />
                  </View>
                </View>
              </View>
            )}
          />
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
    flex: 0.4
    // backgroundColor: "#000"
  },
  bottomContainer: {
    flex: 0.6,
    backgroundColor: "#000"
  },
  image: {
    height: 270
    // width: 400
  },
  offerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#fff"
  },
  grubText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff"
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    // width: 340,
    // justifyContent: "center",
    height: 240,
    marginTop: 10,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10
  },
  numberText: {
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center"
  },
  timeText: {
    // fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 20
    // marginTop: 10

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 120
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 20
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 15
  }
});
