import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import { Icon, Avatar, Button } from "react-native-elements";
import global from "../../global";
import {
  ScrollView,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { gerMerchantMenu } from "../../utils/Api";

export default class orders extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      orders: "1",
      data: [],
      orderResult: []
    };
  }
  componentDidMount(){
    var data = []
    data.push({
      id: 0,
      avatar: "none",
      name: "You",
      items: []
    })
    this.props.navigation.state.params.selected.map((member, index)=>{
      data.push({
        id: index+1,
        avatar: "none",
        name: member.name,
        items: []
      })
    })
    
    this.setState({
      data: data
    })
  }
  getMenu = (rest)=>{
    gerMerchantMenu(this.props.navigation.state.params.merchant.id).then((response)=>{
      this.props.navigation.navigate("DetailsScreen", {
        merchant: this.props.navigaton.state.params.merchant, //?????
        data: response.details
      })
    })
  }
  render() {
    return (
      <View style={styles.bgConainer}>
        <View style={styles.proofContainer}>
          <Icon
            name="chevron-left"
            color="gray"
            type="material-community"
            size={32}
            iconStyle={styles.icon}
            Component={TouchableOpacity}
            onPress={() => this.props.navigation.navigate("FunkyFive")}
          />
          <View>
            <Text style={styles.prrofText}> NEW GRUB HOUSE: {this.props.navigation.state.params.groupName}</Text>
            <Text style={styles.detailText}> {this.props.navigation.state.params.selected.length+1} members</Text>
          </View>
          <Image source={global.ASSETS.ALMOND} style={styles.image} />
        </View>
        <View style={styles.orderContainer}>
          <Text>Delivery from :</Text>
          <TouchableOpacity
           
          >
            <Text style={{ color: global.COLOR.PRIMARY, marginRight: 50 }}>
            {typeof this.props.navigation.state.params.merchant!=="undefined"?this.props.navigation.state.params.merchant.restaurant_name:"No Restaurant Selected"}
            </Text>
          </TouchableOpacity>

          <Icon
            name="silverware"
            color={global.COLOR.PRIMARY}
            type="material-community"
            size={24}
          />
        </View>
        <View style={styles.orderBackContainer}>
          <TouchableOpacity style={styles.orderContainer}>
            <Text style={styles.orderText}>ORDERS</Text>
            <Image
              source={global.ASSETS.ORDER}
              style={styles.orderIcon}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.orderContainer}
            onPress={() => this.props.navigation.navigate("Basket", {
                merchant: this.props.navigation.state.params.merchant,
                groupName: this.props.navigation.state.params.groupName,
                selected: this.state.data
            })}
          >
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
        <ScrollView style={{ marginTop: 20 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item: d }) => (
              <View>
                <TouchableWithoutFeedback
                  style={styles.adminContainer}
                  onPress={() =>
                    this.setState({
                      isHidden: !this.state.isHidden
                    })
                  }
                >
                  <View style={styles.orderContainer}>
                    <Avatar rounded size={35} source={{ uri: d.avatar }} />
                    <Text style={styles.youText}>{d.name}</Text>
                  </View>
                  {d.items.length > 0 ? (
                    <Icon
                      name="chevron-down"
                      color="gray"
                      type="material-community"
                      size={32}
                      iconStyle={{ marginTop: 8 }}
                    />
                  ) : (
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>No Items</Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
                <Divider style={styles.divider} />
                {this.state.isHidden && (
                  <View>
                    {d.items.map(f => {
                      return (
                        <View style={styles.detailsContainer}>
                          <View style={styles.orderContainer}>
                            <Icon
                              name="stop-circle-outline"
                              color={f.dish_type == "veg" ? "#009FFF" : "red"}
                              type="material-community"
                              size={16}
                              iconStyle={{ marginTop: 12 }}
                            />
                            <Text style={styles.leftText}>{f.dish_name}</Text>
                            <Text style={styles.leftText}>({f.dish_size})</Text>
                            <Text style={styles.leftText}>
                              *{f.dish_quantity}
                            </Text>
                          </View>
                          <Text style={styles.leftText}>{f.total}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          />
        </ScrollView>
        <View>
          <Button
            containerStyle={styles.menuContainer}
            buttonStyle={styles.menuButtonStyle}
            title="Menu"
            titleStyle={styles.menuTitle}
            TouchableComponent={TouchableOpacity}
            onPress={ this.getMenu }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgConainer: {
    flex: 1,
    width: null
  },
  proofContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: global.CONSTANT.STATUSBAR + 10
  },
  leftContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 50
  },
  prrofText: {
    fontWeight: "bold",
    fontSize: 16
  },
  detailText: {
    color: "gray"
  },
  avatar: {
    alignSelf: "center",
    marginLeft: 200
  },
  orderBackContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 6
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    // marginTop: 20,
  },
  orderText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 10,
    color: "gray"
  },
  adminContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 10
  },

  youText: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16
  },
  menuContainer: {
    alignSelf: "center",
    backgroundColor: "#000",

    zIndex: 9,
    position: "absolute",
    marginTop: -70
  },
  menuButtonStyle: {
    backgroundColor: "transparent",
    height: 44,
    width: 120,
    borderRadius: 40
    // marginTop: 50
  },
  menuTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 15
  },
  itemContainer: {
    backgroundColor: "gray",
    height: 24,
    alignSelf: "center",
    borderRadius: 20,
    width: 90
  },
  itemText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3,
    color: "#fff"
  },
  divider: {
    height: 0.5,
    backgroundColor: global.COLOR.PRIMARY,
    marginHorizontal: 16,
    marginTop: -5
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    backgroundColor: "#fff"
  },
  leftText: {
    fontSize: 14,
    marginHorizontal: 5,
    marginVertical: 10
  },
  orderIcon: {
    height: 24,
    width: 20,
    resizeMode: "contain",
    marginTop: 10
  },
  image: {
    height: 60,
    width: 60,
    resizeMode: "cover"
  }
});
