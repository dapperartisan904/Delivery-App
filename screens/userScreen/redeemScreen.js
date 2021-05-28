import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import global from "../../global";
import { Divider } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

const DATA = [
  {
    id: "1",
    amount: "2",
    points: "Redeem 3500 points for £2",
    more_pounts: "3450 more points until £2",
  },
  {
    id: "2",
    amount: "5",
    points: "Redeem 6000 points for £5",
    more_pounts: "5950 more points until £5",
  },
  {
    id: "3",
    amount: "10",
    points: "Redeem 10000 points for £10",
    more_pounts: "9950 more points until £10",
  },
  {
    id: "4",
    amount: "15",
    points: "Redeem 15000 points for £15",
    more_pounts: "14950 more points until £15",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
  {
    id: "5",
    amount: "20",
    points: "Redeem 20000 points for £20",
    more_pounts: "19950 more points until £20",
  },
];
export default class redeemScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: DATA,
    };
  }

  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={{ backgroundColor: "#EAEAEA" }}>
          <Image source={global.ASSETS.REDEEM} style={styles.image} />
        </View>

        <FlatList
          // horizontal
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item: d }) => (
            <View>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.redeemContainer}
              >
                <Text style={styles.upperText}>£ {d.amount}</Text>

                <View>
                  <Text style={styles.upperRightText}>{d.points}</Text>
                  <Text style={styles.bottomText}>{d.more_pounts}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </View>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
  },
  image: {
    height: 220,
    width: 370,
    alignSelf: "center",
    resizeMode: "contain",
    borderRadius: 5,
  },
  redeemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  upperText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
    width: 60,
    color: "red",
  },
  bottomText: {
    fontSize: 18,
    color: "gray",
    marginHorizontal: 10,
    width: 300,
  },
  divider: {
    marginVertical: 10,
    height: 0.3,
  },
  upperRightText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
    width: 300,
  },
});
