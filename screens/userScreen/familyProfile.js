import React, { Component } from "react";
import { Text, StyleSheet, View, Image, FlatList } from "react-native";
import { Divider, Button } from "react-native-elements";
import global from "../../global";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class familyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        activity: [
          {
            id: "zdasc",
            date: "12:32 PM",
            details: "Child has been added",
          },
          {
            id: "zdadvdsdsc",
            date: "10:00 AM",
            details: "Child has been removed",
          },
          {
            id: "zdasdcc",
            date: "11:00PM",
            details: "Child has been added",
          },
          {
            id: "zdascfrer",
            date: "09:00 AM",
            details: "Child has been added",
          },
          {
            id: "zdreasc",
            date: "01:12 PM",
            details: "Child has been added",
          },
        ],
      },
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Tab container */}
        <View style={styles.tabsContainer}>
          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                this.props.navigation.navigate("FamilyProfileMembers");
              }}
            >
              <Image source={global.ASSETS.MEMBERS} style={styles.gridIcon} />

              <Text>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                this.props.navigation.navigate("FamilyProfileCard");
              }}
            >
              <Image source={global.ASSETS.CARD} style={styles.gridIcon} />
              <Text>Virtual Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                this.props.navigation.navigate("FamilyPayments");
              }}
            >
              <Image source={global.ASSETS.PAYMENTS} style={styles.gridIcon} />

              <Text>Payments</Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.gridDivider} />
          <View style={styles.grid}>
            <TouchableOpacity style={styles.gridItem}>
              <Image
                source={global.ASSETS.COMMUNICATION}
                style={styles.gridIcon}
              />

              <Text style={{ width: 50 }}>Communications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem}>
              <Image
                source={global.ASSETS.MONEYTRANSFER}
                style={styles.gridIcon}
              />

              <Text style={{ width: 50 }}>Request/Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={global.ASSETS.REPORT} style={styles.gridIcon} />

              <Text>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Button */}
        <View>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            title="Edit Profile"
            titleStyle={styles.buttonTitle}
            TouchableComponent={TouchableOpacity}
            onPress={this.handleValidate}
          />
          <Text style={styles.welcomeText}>
            Welcome to Grub House Family Plan
          </Text>
        </View>
        {/* Recent activity */}
        <View>
          <View>
            <Text>Recent Activity</Text>
          </View>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.data.activity}
              renderItem={({ item: d }) => (
                <View style={styles.activitycontainer}>
                  <View style={styles.activityList}>
                    <Image
                      source={global.ASSETS.TIMER}
                      style={styles.activityListIcon}
                    />
                    <Text style={styles.activityListDate}>{d.date}</Text>
                    <Text style={styles.activityListDetails}>{d.details}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  tabsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gridItem: {
    marginVertical: 5,
  },
  gridIcon: {
    width: 30,
    height: 30,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 5,
  },
  gridDivider: {
    marginVertical: 8,
    height: 3,
    width: global.CONSTANT.WIDTH - 50,
    backgroundColor: "gray",
    alignSelf: "center",
  },
  buttonContainer: {
    //   width:global.
    marginHorizontal: 10,
    borderRadius: 10,
  },

  buttonStyle: {
    //   width:global.
    borderRadius: 10,
  },
  welcomeText: {
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 20,
    fontSize: 12,
    color: "gray",
  },
  activitycontainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  activityList: {
    flexDirection: "row",
    marginVertical: 10,
  },
  activityListIcon: {
    height: 18,
    width: 20,
    marginRight: 5,
    resizeMode: "contain",
  },
  activityListDate: {
    color: "#2291ff",
    marginRight: 5,
  },
});
