import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import global from "../../global";
import { Divider } from "react-native-paper";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";

const DATA = {
  preOrder: [
    {
      id: "1",
      name: "Fresca",
      location: "Malviya Nagar",
      amount: "£ 3",
      order: "Paneer Butter Masala, Veg Raita & Laccha Parantha",
      date: "Novembe 19, 1:01 PM"
    },
    {
      id: "2",
      name: "T2 Tandoori Dhaba",
      location: "Pratap Nagar",
      amount: "£ 2",
      order: "Special Combo",
      date: "Novembe 4, 12:6 PM"
    },
    {
      id: "3",
      name: "Elmira Rosticceria",
      location: "London",
      amount: "£ 13,50",
      order: "Basil Lomon Spaghatti",
      date: "Novembe 20, 12:6 PM"
    }
  ]
};

export default class preOrder extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "PAST ORDER",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      data: DATA
    };
  }
  render() {
    //   background container
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={styles.pastContainer}>
          <Text style={styles.pastText}> PAST ORDERS</Text>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.data.preOrder}
          renderItem={({ item: d }) => (
            <View style={styles.flatlist}>
              <Text style={styles.nameText}>{d.name}</Text>
              <Text style={styles.locationText}>{d.location}</Text>
              <Text style={styles.locationText}>{d.amount}</Text>
              <Text style={styles.locationText}>{d.order}</Text>
              <Text style={styles.locationText}>{d.date}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity>
                  <View style={styles.reOrderContainer}>
                    <Text style={styles.reOrderText}>REORDER</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.rateMealContainer}>
                    <Text style={styles.rateMealText}>RATE MEAL</Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#fff"
  },
  myText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 16
    // marginTop: global.CONSTANT.STATUSBAR
  },
  pastText: {
    fontSize: 15,
    margin: 16
  },
  pastContainer: {
    backgroundColor: "#F3F3F3",
    marginTop: 20
  },
  flatlist: {
    marginHorizontal: 20,
    marginTop: 10
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray"
  },
  locationText: {
    fontSize: 16,
    color: "gray",
    marginTop: 6
  },
  reOrderContainer: {
    borderColor: global.COLOR.PRIMARY,
    borderWidth: 2,
    width: 150
  },
  reOrderText: {
    marginVertical: 8,
    textAlign: "center",
    color: global.COLOR.PRIMARY,
    fontSize: 20,
    fontWeight: "bold"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  rateMealContainer: {
    borderWidth: 2,
    width: 150,
    color: "#000"
  },
  rateMealText: {
    marginVertical: 8,
    textAlign: "center",
    color: "#000",
    fontSize: 20,
    fontWeight: "bold"
  },
  divider: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 40
  }
});
