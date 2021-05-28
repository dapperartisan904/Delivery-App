import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Icon, Avatar, Divider } from "react-native-elements";
import global from "../../global";
// import profileBake from "../assets/profileBake.png";
import { ScrollView } from "react-native-gesture-handler";
export default class basket extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        {/* upper Container */}
        <View style={styles.upperContainer}>
          {/* grub container */}
          <View style={styles.proofContainer}>
            <Icon
              name="chevron-left"
              color="gray"
              type="material-community"
              size={32}
              iconStyle={styles.icon}
              Component={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("Orders")}
            />
            <View>
              <Text style={styles.prrofText}>NEW GRUB HOUSE: {this.props.navigation.state.params.groupName}</Text>
              <Text style={styles.detailText}>  {this.props.navigation.state.params.selected.length+1} members</Text>
            </View>
            <Image source={global.ASSETS.DRYFRUIT} style={styles.image} />
          </View>
          <View style={styles.deliveryContainer}>
            <Text>Delivery from :</Text>
            <Text style={{ color: global.COLOR.PRIMARY, marginRight: 50 }}>
            {typeof this.props.navigation.state.params.merchant!=="undefined"?this.props.navigation.state.params.merchant.restaurant_name:"No Restaurant Selected"}
            </Text>
            <Icon
              name="silverware"
              color={global.COLOR.PRIMARY}
              type="material-community"
              size={24}
            />
          </View>
          <View style={styles.orderBackContainer}>
            <TouchableOpacity
              style={styles.orderContainer}
              onPress={() => this.props.navigation.navigate("Orders")}
            >
              <Text style={styles.orderText}>ORDERS</Text>
              <Image
                source={global.ASSETS.ORDER}
                style={styles.orderIcon}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderContainer}>
              <Text style={styles.orderText}>BASKET</Text>
              <Icon
                name="basket"
                color={global.COLOR.PRIMARY}
                type="material-community"
                size={28}
                iconStyle={{ marginTop: 4 }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.cardContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginHorizontal: 10,
                  marginVertical: 16,
                }}
              >
                <Avatar rounded size={35} source={global.ASSETS.PROFILE} />
                <Text style={styles.youText}>Your Order</Text>
              </View>

              <Divider style={styles.divider} />
              <View style={{ justifyContent: "space-evenly" }}>
                {this.props.navigation.state.params.selected.map((member, index)=>{
                  member.items.map((item, subIndex)=>{
                    <View style={styles.detailsContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Icon
                          name="stop-circle-outline"
                          color="red"
                          type="material-community"
                          size={18}
                          iconStyle={{ marginTop: 18 }}
                        />
                        <Text style={styles.leftText}>
                          {item.dish_name} - ({item.dish_size}) * {item.dish_quantity}
                        </Text>
                      </View>
                      <Text style={styles.leftText}>£ {item.dish_quantity*item.price}</Text>
                    </View>
                  })
                })}
                
                <View style={styles.itemsContainer}>
                  <Text style={styles.leftText}>Item Total</Text>
                  <Text style={styles.leftText}>£ 1015</Text>
                </View>
                <View style={styles.itemsContainer}>
                  <View>
                    <Text style={styles.leftText}>Delivery Charge</Text>
                    <Text style={{ fontSize: 10, width: 170 }}>
                      *Become a grub member option for free delivery for a year
                    </Text>
                  </View>
                  <Text style={styles.leftText}>15%</Text>
                </View>
                <View style={styles.itemsContainer}>
                  <Text style={styles.leftText}>Service Charge</Text>
                  <Text style={styles.leftText}>10%</Text>
                </View>
                <View style={styles.itemsContainer}>
                  <Text style={styles.leftText}>Total</Text>
                  <Text style={styles.leftText}>£ 1197</Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.offerContainer}>
                  <Text style={styles.percentageText}>%</Text>
                  <Text style={styles.offerText}>View available offers.</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.backCheckContainer}>
          <TouchableOpacity
            style={styles.checkoutContainer}
            onPress={() => this.props.navigation.navigate("GroupBills")}
          >
            <Icon
              name="clipboard-check-outline"
              color="#fff"
              type="material-community"
              size={20}
            />
            <View>
              <Text style={styles.checkoutText}>CHECKOUT</Text>
            </View>
            <View>
              <Text style={styles.totalText}>£ 1,197</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
  },
  upperContainer: { flex: 0.96 },
  proofContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: global.CONSTANT.STATUSBAR + 10,
  },
  grubContainer: {
    justifyContent: "space-evenly",
    marginHorizontal: 10,
  },
  deliveryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  prrofText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detailText: {
    color: "gray",
  },
  avatar: {
    alignSelf: "center",
    marginLeft: 200,
  },
  orderBackContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 6,
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  orderText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 10,
    color: "gray",
  },
  adminContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 60,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },

  youText: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  leftText: {
    fontSize: 14,
    marginHorizontal: 5,
    marginTop: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  divider: {
    height: 2,
    width: "90%",
    backgroundColor: global.COLOR.PRIMARY,
    marginHorizontal: 20,
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  offerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginVertical: 10,
    margin: 16,
  },
  offerText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 5,
  },
  percentageText: {
    backgroundColor: global.COLOR.PRIMARY,
    color: "#fff",
    height: 20,
    width: 20,
    textAlign: "center",
    borderRadius: 40,
  },
  checkoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 10,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  totalText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  backCheckContainer: {
    backgroundColor: "#000",
    flex: 0.1,
    // marginTop: 20
  },
  orderIcon: {
    height: 24,
    width: 20,
    resizeMode: "contain",
    marginTop: 10,
  },
  image: {
    height: 60,
    width: 60,
    resizeMode: "cover",
  },
});
