import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, Image } from "react-native";
import { Avatar, Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

const DATA = [
  {
    id: "1",
    name: "faika560",
    image: "https://placeimg.com/640/480/any"
  },
  {
    id: "1",
    name: "vikash_kumar702",
    image: "https://placeimg.com/640/480/animals"
  },
  {
    id: "1",
    name: "sh1680a",
    image: "https://placeimg.com/640/480/arch"
  },
  {
    id: "1",
    name: "royalnavghan",
    image: "https://placeimg.com/640/480/nature"
  },
  {
    id: "1",
    name: "souravganguly",
    image: "https://placeimg.com/640/480/people"
  },
  {
    id: "1",
    name: "nehasharma",
    image: "https://placeimg.com/640/480/tech"
  },
  {
    id: "1",
    name: "shreyas41",
    image: "https://placeimg.com/640/480/grayscale"
  },
  {
    id: "1",
    name: "dhvanibhanushali",
    image: "https://placeimg.com/640/480/sepia"
  }
];
export default class likeScreen extends Component {
  static navigationOptions = {
    title: "Likes",
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
      data: DATA
    };
  }
  render() {
    return (
      <View style={styles.bgContainer}>
        <View>
          <Input
            placeholder="Search "
            placeholderTextColor="#000"
            inputContainerStyle={styles.inputFiedContainer}
            keyboardType="default"
            inputStyle={styles.inputText}
          />
        </View>
        {/* <View style={{ backgroundColor: "#fff" }}> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item: d }) => (
            <View style={styles.flatlistContainer}>
              <View style={styles.avatarContainer}>
                <Avatar rounded size={60} source={{ uri: d.image }} />
                <Text style={styles.nameText}>{d.name}</Text>
              </View>
              <View style={styles.removeContainer}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("ViewProfile")}
                >
                  <Text style={styles.removeText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginHorizontal: 10,
    marginTop: 10
  },
  nameText: {
    fontSize: 20,
    alignSelf: "center",
    marginHorizontal: 10
  },
  removeText: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 3
  },
  removeContainer: {
    width: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    alignSelf: "center"
  },
  flatlistContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginVertical: 6,
    marginHorizontal: 16
  },
  inputFiedContainer: {
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.03)"
    // marginTop: global.CONSTANT.STATUSBAR + 20
  }
});
