import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import global from "../../global";

export default class technicalCustomerSupport extends Component {
  static navigationOptions = {
    title: "Customer Service",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 22
    },
    headerRight: (
      <Image
        source={global.ASSETS.CUSTOMERSUPPORT}
        style={{ height: 40, width: 60, resizeMode: "cover" }}
      />
    )
  };
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={{ marginVertical: 16 }}>
          <View>
            <Text style={styles.suggestionText}> Were here to help </Text>
            <Text style={styles.regardText}>
              We're listening. How can we help you today ?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Information")}
            style={styles.cardContainer}
          >
            <Image source={global.ASSETS.FOOD} style={styles.image}></Image>
            <Text style={styles.orderText}>
              Order & Restaurant Experience Feedback
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Information")}
            style={styles.cardContainer}
          >
            <Image
              source={global.ASSETS.INFORMATION}
              style={styles.image}
            ></Image>
            <Text style={styles.orderText}>Menu Information & Suggestions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Information")}
            style={styles.cardContainer}
          >
            <Image
              source={global.ASSETS.INQUIRIES}
              style={styles.image}
            ></Image>
            <Text style={styles.orderText}>General & Marketing Inquiries</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Information")}
            style={styles.cardContainer}
          >
            <Image source={global.ASSETS.SUPPORT} style={styles.image}></Image>
            <Text style={styles.orderText}>Technical & Account Support</Text>
          </TouchableOpacity>
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
  suggestionText: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 20,
    color: "#8D8C92",
    textAlign: "center"
  },
  regardText: {
    fontSize: 20,
    color: "gray",
    alignSelf: "center",
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: 10
  },
  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    // borderRadius: 40,
    alignSelf: "center",
    marginTop: 15
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 40,
    marginHorizontal: 20,
    marginTop: 20,

    borderColor: "gray",
    borderWidth: 0.3
    // width: 100
  },
  orderText: {
    fontSize: 20,
    // color: global.COLOR.PRIMARY,
    marginHorizontal: 10,
    textAlign: "center",
    marginVertical: 10
  }
});
