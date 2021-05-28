import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, Image } from "react-native";
import { Avatar, Input, Icon } from "react-native-elements";
import global from "../../global";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
const DATA = [
  {
    id: "1",
    name: "Group 1",
    image: "https://placeimg.com/640/480/any"
  },
  {
    id: "1",
    name: "Group 2",
    image: "https://placeimg.com/640/480/animals"
  },
  {
    id: "1",
    name: "Group 3",
    image: "https://placeimg.com/640/480/arch"
  }
];
export default class previousGroup extends Component {
  static navigationOptions = {
    title: "Previous Grub Group",
    headerStyle: {
      backgroundColor: "#fff"
    },
    headerRight: (
      <Icon
        name="account-group-outline"
        color="gray"
        type="material-community"
        size={35}
        iconStyle={{ marginHorizontal: 10 }}
        // Component={TouchableOpacity}
      />
    ),

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  constructor(props) {
    super(props);

    this.state = {
      data: DATA
    };
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={{ marginTop: 20 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d }) => (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("GroupDetails")}
                style={styles.avatarContainer}
              >
                <View style={{ margin: 10 }}>
                  <Avatar rounded size={50} source={{ uri: d.image }} />
                </View>
                <Text style={styles.youText}>{d.name}</Text>
              </TouchableOpacity>
            )}
          />
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
  youText: {
    // margin: 10,
    // fontWeight: "bold",
    fontSize: 26,
    alignSelf: "center",
    marginHorizontal: 10
    // marginVertical: 20
    // fontFamily: global.FONT.Simonetta_Regular
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginHorizontal: 10,
    marginTop: 10,
    marginHorizontal: 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20
  }
});
