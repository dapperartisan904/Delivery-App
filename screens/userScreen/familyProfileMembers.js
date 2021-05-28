import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-elements";
import global from "../../global";
import { FlatGrid } from "react-native-super-grid";
const DATA = {
  children: [
    {
      id: "Asd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
    {
      id: "Aefssadd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
    {
      id: "Asasewdd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
    {
      id: "Aaefsdsd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
    {
      id: "Aassdwedsd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
    {
      id: "Asasadsdd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
    {
      id: "Asasdd",
      name: "Derek",
      img: "https://loremflickr.com/g/320/240/paris,girl/all",
    },
  ],
};

export default class familyProfileMembers extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Family Members",
    headerStyle: {
      backgroundColor: "#fff",
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      data: DATA,
      childrenVisible: true,
      coParentVisible: false,
      siblingsVisible: false,
    };
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.avatarConatiner}>
          <Avatar
            size="xlarge"
            rounded
            showEditButton
            source={global.ASSETS.PROFILE}
          />
          <Text style={styles.avatarText}>Linda's Family</Text>
        </View>
        {/* Family Members */}
        <View>
          <TouchableOpacity
            style={styles.tabContainer}
            onPress={() => {
              this.setState({ childrenVisible: !this.state.childrenVisible });
            }}
          >
            <Text style={styles.tabText}>Family Members</Text>
          </TouchableOpacity>
          {this.state.childrenVisible && (
            <View>
              <FlatGrid
                itemDimension={global.CONSTANT.WIDTH / 6}
                items={this.state.data.children}
                style={styles.gridView}
                renderItem={({ item: d }) => (
                  <View style={styles.gridAvatar}>
                    <Avatar
                      size="medium"
                      rounded
                      // showEditButton
                      source={{ uri: d.img }}
                    />
                    <Text style={styles.gridAvatarText}>{d.name}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
        {/* Friends*/}
        <View>
          <TouchableOpacity
            style={styles.tabContainer}
            onPress={() => {
              this.setState({ coParentVisible: !this.state.coParentVisible });
            }}
          >
            <Text style={styles.tabText}>{"Friends"}</Text>
          </TouchableOpacity>
          {this.state.coParentVisible && (
            <View>
              <FlatGrid
                itemDimension={global.CONSTANT.WIDTH / 6}
                items={this.state.data.children}
                style={styles.gridView}
                renderItem={({ item: d }) => (
                  <View style={styles.gridAvatar}>
                    <Avatar
                      size="medium"
                      rounded
                      // showEditButton
                      source={{ uri: d.img }}
                    />
                    <Text style={styles.gridAvatarText}>{d.name}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
        {/* Family Plan */}
        <View>
          <TouchableOpacity
            style={styles.tabContainer}
            onPress={() => {
              this.setState({ siblingsVisible: !this.state.siblingsVisible });
            }}
          >
            <Text style={styles.tabText}>Family Plan</Text>
          </TouchableOpacity>
          {this.state.siblingsVisible && (
            <View>
              <FlatGrid
                itemDimension={global.CONSTANT.WIDTH / 6}
                items={this.state.data.children}
                style={styles.gridView}
                renderItem={({ item: d }) => (
                  <View style={styles.gridAvatar}>
                    <Avatar
                      size="medium"
                      rounded
                      // showEditButton
                      source={{ uri: d.img }}
                    />
                    <Text style={styles.gridAvatarText}>{d.name}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  avatarConatiner: {
    alignSelf: "center",
    marginVertical: 20,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },
  tabText: {
    marginVertical: 8,
    fontSize: 20,
    marginHorizontal: 10,
  },
  gridView: {
    backgroundColor: "#fff",
    marginVertical: 15,
    borderRadius: 10,
  },
  gridAvatar: {
    //   fontSize: 28,
    alignSelf: "center",
  },
  gridAvatarText: {
    //   fontSize: 28,
    // color:"",
    alignSelf: "center",
  },
});
