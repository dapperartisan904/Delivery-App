import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import {
  TouchableWithoutFeedback,
  ScrollView
} from "react-native-gesture-handler";

export default class help extends Component {
  static navigationOptions = {
    title: "Help",
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
      text:
        "Ea takimata ipsum ea dolores accusam tempor lorem, duo dolores eos takimata consetetur consetetur et et sadipscing lorem, et sanctus stet dolore sea ipsum diam amet. Takimata clita diam ea amet clita et dolor eirmod erat, magna nonumy amet sit ipsum dolore sed dolor, dolore vero nonumy est eirmod et, et diam nonumy sed consetetur aliquyam et dolor dolor, dolor vero sea takimata ut amet sed et est tempor. Accusam dolor vero sea diam amet gubergren labore stet et. Clita ea erat gubergren vero. Dolores vero amet sit stet, eirmod diam et dolores voluptua. Amet accusam vero et dolores, et takimata tempor diam at ipsum no sit takimata, accusam aliquyam diam sea amet amet, labore elitr et invidunt no voluptua amet accusam clita et. Magna lorem duo lorem sea tempor vero tempor clita dolore, accusam invidunt diam eirmod magna consetetur ea lorem. Magna nonumy accusam sit et takimata amet est lorem tempor, et invidunt ipsum et sit no dolores, lorem eirmod lorem labore tempor. Et aliquyam ipsum sanctus amet. Takimata magna rebum sit et sadipscing dolore et diam duo, voluptua dolor voluptua at amet et ipsum dolores nonumy labore. Eos et sanctus eirmod amet sea gubergren, dolor tempor diam sanctus sit. Clita lorem rebum sed clita, erat invidunt ipsum sed sadipscing accusam. Clita no sed labore et. Invidunt tempor ipsum tempor at et ut diam labore justo, eos takimata accusam kasd voluptua justo amet takimata tempor. Kasd sed ipsum voluptua labore est voluptua. Stet diam dolor diam amet tempor dolor consetetur. Accusam dolore rebum eos dolores. Diam kasd clita magna amet voluptua dolor erat. Et stet lorem magna magna dolore dolore, consetetur tempor aliquyam et aliquyam kasd duo et consetetur ipsum. Et elitr et ipsum magna sanctus labore et. Duo sit eos rebum gubergren ipsum, diam sadipscing est dolores gubergren."
    };
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <Text style={styles.dummyText}>{this.state.text}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  dummyText: {
    fontSize: 16,
    margin: 20,
    textAlign: "justify"
  }
});
