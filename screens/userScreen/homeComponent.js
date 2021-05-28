import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import { Icon } from "react-native-elements";
import Home from "./home";
import Cuisins from "../screens/cuisins";
import FacebookTabBar from "./FacebookTabBar";
import FoodCourt from "../screens/foddCourt";
import RestaurantDetails from "./restaurantDetails";
import AfterOriginals from "../screens/afterOriginals";
import NearbyRestorants from "../screens/nearbyRestorants";
import nearbyRestorants from "./nearbyRestorants";
import global from "../../global";

export default class homeComponent extends Component {
  static navigationOptions = {
    title: "Deliver to Atlanta",
    headerStyle: {
      backgroundColor: global.COLOR.PRIMARY
    },
    headerRight: (
      <Icon
        name="dots-vertical"
        color="#fff"
        type="material-community"
        size={30}
        iconStyle={{ marginHorizontal: 10 }}
        Component={TouchableOpacity}
      />
    ),

    headerTintColor: "#fff",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  render() {
    return (
      <ScrollableTabView
        style={styles.tabBar}
        initialPage={0}
        renderTabBar={() => <FacebookTabBar />}
        tabBarBackgroundColor={global.COLOR.PRIMARY}
      >
        <Home tabLabel="ios-home" />
        <Cuisins tabLabel="ios-search" />
        <FoodCourt tabLabel="ios-list-box" />
        <RestaurantDetails tabLabel="ios-heart-empty" />
        <AfterOriginals tabLabel="ios-person" />
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    marginTop: 40
  }
});
