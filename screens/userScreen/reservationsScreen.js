import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { Icon } from "react-native-elements";

const DATA = [
  {
    id: "1",
    image: "https://placeimg.com/640/480/any",
    name: "Michael Mina - San Francisco"
  }
];
export default class reservationsScreen extends Component {
  static navigationOptions = {
    title: "Reservations",
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
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item: d }) => (
            <View styles={styles.flatlistContainer}>
              <View>
                <Image source={{ uri: d.image }} style={styles.image} />
              </View>
              <View>
                <View>
                  <Text style={styles.nameText}>Plateau Bar & Grill</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Icon
                    name="account"
                    type="material-community"
                    size={20}
                    iconStyle={styles.icon}
                  />
                  <Text style={styles.dayText}>Table for 2 people</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Icon
                    name="clock-outline"
                    type="material-community"
                    size={20}
                    iconStyle={styles.icon}
                  />
                  <Text style={styles.dayText}>5:00 PM</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  image: {
    height: 130,
    width: 120,
    resizeMode: "cover",
    borderRadius: 5
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: 200
  },
  dayText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    alignSelf: "center"
  },
  icon: {
    color: "gray",
    marginRight: 8
  },
  flatlistContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
