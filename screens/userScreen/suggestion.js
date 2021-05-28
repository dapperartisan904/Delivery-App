import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import global from "../../global";
import { Icon, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default class suggestion extends Component {
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
        <View style={{ marginVertical: 20 }}>
          <View>
            <Text style={styles.suggestionText}>
              Menu Information & {"\n"} Suggestions
            </Text>
            <Text style={styles.regardText}>
              First, have you contacted us before about this inquiry ?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("TechnicalSupport")}
            style={styles.nutritionContainer}
          >
            <Text style={styles.nutritionText}>
              No, this is my first time sharing.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("TechnicalSupport")}
            style={styles.nutritionContainer}
          >
            <Text style={styles.nutritionText}>
              Yes, I spoke with someone at the Restaurant.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("TechnicalSupport")}
            style={styles.nutritionContainer}
          >
            <Text style={styles.nutritionText}>
              Yes, I contacted a grub house customer service advisor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("TechnicalSupport")}
            style={styles.nutritionContainer}
          >
            <Text style={styles.nutritionText}>
              Yes, I filled out this web form
            </Text>
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
  nutritionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 16,
    borderColor: "gray",
    borderWidth: 0.3
  },
  nutritionText: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 16,
    // color: global.COLOR.PRIMARY,
    textAlign: "center"
  }
});
