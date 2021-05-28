import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import global from "../../global";
import { Icon, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default class allergensScreen extends Component {
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
            <Text style={styles.suggestionText}> HELP </Text>
            <Text style={styles.regardText}>
              The FAQs might help. Click the question or arrow to show the
              answer
            </Text>
          </View>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              How to I find information about food allergens ?
            </Text>

            <Icon
              name="chevron-up"
              color="#000"
              type="material-community"
              size={40}
              // iconStyle={styles.icon1}
            />
          </View>
          <View>
            <Text style={styles.answerText}>
              Click <Text style={styles.hereText}>here</Text> to view our
              Alergen Guide, which has a list of common allergens found in our
              menu items.
            </Text>
          </View>
          <Text style={styles.answerText}>
            you may also view the ingredient list for each item by visiting the
            Menu section of our app
          </Text>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              you may also view the ingredient list for each item by visiting
              the Menu section of our app
            </Text>

            <Icon
              name="chevron-up"
              color="#000"
              type="material-community"
              size={40}
              // iconStyle={styles.icon1}
            />
          </View>
          <View>
            <Text style={styles.answerText}>
              you may also view the ingredient list for each item by visiting
              the Menu section of our app
            </Text>
          </View>
          <Text style={styles.answerText}>
            you may also view the ingredient list for each item by visiting the
            Menu section of our app
          </Text>
          <View>
            <Button
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              title="Thanks, this answered my question"
              titleStyle={styles.buttonTitle}
              TouchableComponent={TouchableOpacity}
            />
          </View>
          <View>
            <Button
              containerStyle={styles.buttonContainer1}
              buttonStyle={styles.buttonStyle1}
              title="No, I still need help"
              titleStyle={styles.buttonTitle1}
              TouchableComponent={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("Suggetion")}
            />
          </View>
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
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: 10
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",

    width: 320
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 20,
    marginTop: 16
  },
  answerText: {
    fontSize: 20,
    color: "gray",
    marginHorizontal: 20,
    textAlign: "justify",
    marginTop: 20
  },
  hereText: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "red",
    fontWeight: "bold"
  },
  nutritionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 16
  },
  nutritionText: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 16,
    color: global.COLOR.PRIMARY,
    textAlign: "center"
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 30,
    backgroundColor: global.COLOR.PRIMARY,
    marginTop: 20
    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 60,
    width: 340
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 20
  },
  buttonContainer1: {
    alignSelf: "center",
    borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 0.3
    // marginHorizontal: 70
  },
  buttonStyle1: {
    backgroundColor: "transparent",
    height: 60,
    width: 340
    // marginTop: 50
  },
  buttonTitle1: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 20
  }
});
