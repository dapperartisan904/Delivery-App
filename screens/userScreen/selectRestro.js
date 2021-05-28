import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Input, Icon } from "react-native-elements";
import global from "../../global";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import Restaurant from "../../screens/userScreen/restaurantScreen";
import Dish from "../../screens/userScreen/dishScreen";

export default class selectRestro extends Component {
  static navigationOptions = {
    title: "Select Restaurant",
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
      // background containe
      <View style={styles.bgContainer}>
        {/* scrollable tab view container */}
        <ScrollableTabView
          style={styles.tabContainer}
          // tabBarBackgroundColor="green"
          tabBarActiveTextColor="#000"
          tabBarInactiveTextColor="gray"
          tabBarTextStyle={{ fontSize: 22, fontWeight: "bold" }}
          tabBarUnderlineStyle={{ backgroundColor: "FFF" }}
          initialPage={0}
          // locked={true}
        >
          <Restaurant
            tabLabel="Restaurants"
            navigation={this.props.navigation}
          />
          {/* <Dish tabLabel="Dishes" navigation={this.props.navigation} /> */}
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "gray",
    marginHorizontal: 6
    // margin: 6
  },
  inputFiedContainer: {
    borderWidth: 1,
    borderColor: "gray",
    marginTop: global.CONSTANT.STATUSBAR,
    borderRadius: 20
    // marginLeft: 30
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  tabContainer: {
    // marginTop: 20
  },
  addressText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  bottomText: {
    fontSize: 16,
    color: global.COLOR.PRIMARY,
    width: 200,
    alignSelf: "center",
    marginHorizontal: 5
  }
});
