import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import global from "../../global";
const DATA = {
  pending: [
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "credit",
    },
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
  ],
  success: [
    {
      id: "sadas",
      name: "Garry",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "Garry",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "Garry",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "Garry",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
  ],

  fail: [
    {
      id: "sadas",
      name: "Garry",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
    {
      id: "sadas",
      name: "derek",
      amt: "5000",
      date: "05/24/2018",
      type: "debited",
    },
  ],
};
export default class FamilyPayments extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Payments",
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
      selected: 0,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabitem,
              {
                backgroundColor: this.state.selected == 0 ? "#ffb03c" : "#fff",
              },
            ]}
            onPress={() => {
              this.setState({ selected: 0 });
            }}
          >
            <Text style={styles.tabitemText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabitem,
              {
                backgroundColor: this.state.selected == 1 ? "#ffb03c" : "#fff",
              },
            ]}
            onPress={() => {
              this.setState({ selected: 1 });
            }}
          >
            <Text style={styles.tabitemText}>Success</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabitem,
              {
                backgroundColor: this.state.selected == 2 ? "#ffb03c" : "#fff",
              },
            ]}
            onPress={() => {
              this.setState({ selected: 2 });
            }}
          >
            <Text style={styles.tabitemText}>Failed</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            /// horizontal
            showsVerticalScrollIndicator={false}
            data={
              this.state.selected == 0
                ? this.state.data.pending
                : this.state.selected == 1
                ? this.state.data.success
                : this.state.data.fail
            }
            renderItem={({ item: d }) => (
              <View style={styles.listCard}>
                <View style={styles.listCardItems}>
                  <View>
                    <Text style={styles.listCardItemsText}>{d.name}</Text>
                    <Text style={styles.listCardItemsText1}>{d.type}</Text>
                  </View>
                  <View>
                    <Text style={styles.listCardItemsText}>£ {d.amt}</Text>
                    <Text style={styles.listCardItemsText1}>{d.date}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabitem: {
    marginVertical: 10,
    width: global.CONSTANT.WIDTH / 3 - 18,
    borderRadius: 8,
  },
  tabitemText: {
    marginVertical: 10,

    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
  listCardItems: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listCardItemsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    textTransform: "capitalize",
  },
  listCardItemsText1: {
    fontSize: 14,
    marginVertical: 5,
    textTransform: "capitalize",
  },
});
