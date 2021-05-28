import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import global from "../../global";

export default class customerSupport extends Component {
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
        <View>
          <Text style={styles.suggestionText}> HELP </Text>
          <Text style={styles.regardText}>
            What is your inquiry regardings?
          </Text>
        </View>
      
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Allergens")}
          style={styles.nutritionContainer}
        >
          <Text style={styles.nutritionText}>Allergens</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Allergens")}
          style={styles.nutritionContainer}
        >
          <Text style={styles.nutritionText}>Current menu items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Allergens")}
          style={styles.nutritionContainer}
        >
          <Text style={styles.nutritionText}>Packaging</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Allergens")}
          style={styles.nutritionContainer}
        >
          <Text style={styles.nutritionText}>
            How do I use a feature on Grub House
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Allergens")}
          style={styles.nutritionContainer}
        >
          <Text style={styles.nutritionText}>
            Not happy with your last order?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Allergens")}
          style={styles.nutritionContainer}
        >
          <Text style={styles.nutritionText}>
            There is a problem with my current order
          </Text>
        </TouchableOpacity>
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
    fontSize: 30,
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
    marginBottom: 30
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
    width: 300,
    textAlign: "center"
  }
});
