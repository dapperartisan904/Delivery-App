
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";

export default class Lights extends Component {
    state = {
    loading: true,
    data: [],
  };
  setAllLights = async () => {
    const { data } = await axios.get(
      "http://737helper.com/api/light/get_all"
    );
    // console.log(typeof data)
    var temp = data
    temp = JSON.parse(temp)
    // console.log(temp)
    this.setState({
      temp,
      loading: false,
    });
  };

  componentDidMount() {
    this.setAllLights();
  }
  renderLights = ({ item, index }) => {

    let amber, green, white = false;

    if(item.light_color == 'amber'){
      amber = true;
    } else if(item.light_color == 'white'){
      white = true;
    } else if(item.light_color == 'green'){
      green = true;
    }
    // console.log(item, "asdfsdf")
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("LightDetail", {
            lightid: item.light_id,
          })
        }
        style={[styles.svLight, amber && styles.svLightAmber, white && styles.svLightWhite, green && styles.svLightGreen]}
      >
        <Text style={[amber && styles.textColorAmber, white && styles.textColorWhite, green && styles.textColorGreen]}>{item.light_name}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.LightsWrapper}>
        <View style={styles.main}>
          <View style={styles.svInformation}>
            <Text style={{ color: "#efefef" }}>
              All lights sorted by alphabetical
            </Text>
          </View>
          <FlatList
            contentContainerStyle={styles.sv}
            renderItem={this.renderLights}
            numColumns={2}
            keyExtractor={({item, index}) => "_" + Math.random().toString(36).substring(2,9)}
            //keyExtractor={keyGenerator}
            data={this.state.data}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  LightsWrapper: {
    flex:1,
  },
  sv: {
    flex:1,
  },
  main: {
    flex: 1,
    backgroundColor: "#1b263b",
  },
  svInformation: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "brown",
    paddingVertical: 5,
    marginBottom: 5,
  },
  svRow: {
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  svLight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 2,
    borderRadius: 3,
    marginBottom: 2,
    margin: 5,
  },

  svLightAmber: {
    borderColor: "#ffca3a",
  },

  svLightGreen: {
    borderColor:'green',
  },

  svLightWhite: {
    borderColor:'#fff',
  },

  textColorAmber: {
    color:'#ffca3a',
    fontWeight: 'bold',
  },

  textColorGreen: {
    color:'green',
    fontWeight: 'bold',
  },

  textColorWhite: {
    color:'#fff',
    fontWeight: 'bold',
  }
});
