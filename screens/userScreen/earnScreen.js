import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";

const DATA = [
  {
    id: "1",
    points: "5X",
    points_text: "points",
    food: "Breakfast challange",
    time: "Place an order before 10:00 AM"
  },

  {
    id: "2",
    points: "5X",
    points_text: "points",
    food: "Dinner challange",
    time: "Place an order before 6:00 PM"
  },
  {
    id: "3",
    points: "100",
    points_text: "points",
    food: "Add birthday",
    time: "Set your birthday in your profile"
  },
  {
    id: "4",
    points: "100",
    points_text: "points",
    food: "Add gender",
    time: "Set your gender in your profile"
  },
  {
    id: "5",
    points: "500",
    points_text: "points",
    food: "Creat yoour team",
    time: "Set up a team and invite a teammate to join"
  },
  {
    id: "6",
    points: "500",
    points_text: "points",
    food: "Buddy Up bonus",
    time: "Place your first Buddy Up order and earn bonus points"
  },
  {
    id: "7",
    points: "100",
    points_text: "points",
    food: "Buddy Up with teammates",
    time: "Be the office champ and earn extra points"
  }
];
export default class earnScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: DATA
    };
  }

  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <FlatList
          // horizontal
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item: d }) => (
            <View style={styles.flatlist}>
              <View style={styles.redeemContainer}>
                <View>
                  <Text style={styles.pointsText}>{d.points}</Text>
                  <Text style={styles.bottomText}>{d.points_text}</Text>
                </View>

                <View>
                  <Text style={styles.upperText}>{d.food}</Text>
                  <Text style={styles.bottomRightText}>{d.time}</Text>
                </View>
              </View>
              {/* <Divider style={styles.divider} /> */}
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
    backgroundColor: "#fff"
  },
  redeemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10
  },
  upperText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10
    // marginVertical: 4
  },
  bottomText: {
    fontSize: 16,
    color: "gray",
    marginHorizontal: 10
  },

  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "center"
    // marginTop: 6
    // marginVertical: 4
  },
  flatlist: {
    marginVertical: 20,
    borderBottomColor: "gray",
    borderBottomWidth: 0.2,
    marginTop: 10
  },
  bottomRightText: {
    fontSize: 16,
    color: "gray",
    marginHorizontal: 10,
    width: 320
  }
});
