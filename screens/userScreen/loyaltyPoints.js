import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import Redeem from "../userScreen/redeemScreen";
import Earn from "../userScreen/earnScreen";
import History from "../userScreen/historyScreen";
import global from "../../global";

export default class loyaltyPoints extends Component {
  static navigationOptions = {
    title: "Loyalty Points",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  render() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#000"
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#fff"
        tabBarUnderlineStyle={{ backgroundColor: "#fff" }}
        initialPage={0}
        style={styles.tabBar}

        // locked={true}
      >
        <Redeem tabLabel="REDEEM" navigation={this.props.navigation} />
        <Earn tabLabel="EARN" navigation={this.props.navigation} />
        <History tabLabel="HISTORY" navigation={this.props.navigation} />
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    // marginTop: global.CONSTANT.STATUSBAR + 10
  }
});
