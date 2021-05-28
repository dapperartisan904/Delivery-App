import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Divider, Avatar } from "react-native-elements";
import global from "../../global";

export default class groupBills extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Bills",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  });
  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        {/* your bills container */}
        <View style={styles.yourBillContainer}>
          {/* your bill container */}
          <View style={styles.billContainer}>
            <Text style={styles.billText}>YOUR BILLS</Text>
            <Icon
              name="receipt"
              color="gray"
              type="material-community"
              size={20}
              iconStyle={{ marginHorizontal: 10 }}
            />
          </View>
          {/* settle container */}
          <View style={styles.billContainer}>
            <Text style={styles.billText}>SETTLE BILLS</Text>
            <Icon
              name="receipt"
              color="gray"
              type="material-community"
              size={20}
              iconStyle={{ marginHorizontal: 10 }}
            />
          </View>
        </View>
        {/* grub house container */}
        <View style={styles.grubContainer}>
          <View>
            <Text style={styles.grubText}>GRUB HOUSE</Text>
            <Text style={styles.memberText}> 5 members</Text>
            <Text style={styles.memberText}> 14-11-2018,16:00</Text>
          </View>
          <Icon
            name="account-group-outline"
            color="gray"
            type="material-community"
            size={36}
            iconStyle={styles.icon}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.orderContainer}>
          <Icon
            name="check-circle"
            color={global.COLOR.PRIMARY}
            type="material-community"
            size={20}
            iconStyle={{ marginHorizontal: 10 }}
          />
          <Text style={styles.billText}>Order Delivered</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.itemsContainer}>
            <Text style={styles.leftText}>Item Total</Text>
            <Text style={styles.leftText}>£ 1015</Text>
          </View>
          <View style={styles.itemsContainer}>
            <Text style={styles.leftText}>Delivery Charge</Text>
            <Text style={styles.leftText}>£ 15%</Text>
          </View>
          <View style={styles.itemsContainer}>
            <Text style={styles.leftText}>Service Charge</Text>
            <Text style={styles.leftText}>£ 10%</Text>
          </View>
          <View style={styles.itemsContainer}>
            <Text style={styles.leftText}>Total</Text>
            <Text style={styles.leftText}>£ 1197</Text>
          </View>
        </View>

        <View style={styles.avatarContainetr}>
          <View style={styles.profileContainer}>
            <Avatar rounded size={26} source={global.ASSETS.PROFILE} />
            <Text style={styles.nameText}>Krishna</Text>
          </View>
          <View>
            <Text style={styles.paidText}> Paid by cash</Text>
          </View>
        </View>
        <View style={styles.orderContainer}>
          <Icon
            name="arrow-right-circle"
            color={global.COLOR.PRIMARY}
            type="material-community"
            size={20}
            iconStyle={{ marginHorizontal: 10 }}
          />
          <Text style={styles.billText}>You Paid £ 1,197 for Grub House</Text>
        </View>
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
  billContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20
  },
  billText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "gray"
  },
  yourBillContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 30
  },
  grubText: {
    fontWeight: "bold",
    fontSize: 16
  },
  memberText: {
    color: "gray"
  },
  grubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 45,
    marginTop: 50
  },
  icon: {
    marginVertical: 10
  },
  divider: {
    height: 1,

    backgroundColor: global.COLOR.PRIMARY,
    marginHorizontal: 30,
    marginTop: 16
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 30,
    marginTop: 24
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 38
  },
  leftText: {
    fontSize: 14,
    marginHorizontal: 5,
    marginTop: 6
  },
  avatarContainetr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 38,
    marginTop: 30
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  nameText: {
    // margin: 10,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
    marginHorizontal: 16
  },
  paidText: {
    marginTop: 5,
    color: "gray"
  }
});
