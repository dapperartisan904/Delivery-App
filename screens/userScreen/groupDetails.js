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

const DATA = {
  items: [
    {
      id: "1",
      avatar:
        "https://image.shutterstock.com/image-photo/cute-baby-girl-sitting-on-260nw-689375770.jpg",
      name: "Your Order",
      items: [
        {
          id: "asda",
          dish_name: "kadhai chicken",
          dish_size: "half",
          dish_quantity: 2,
          dish_type: "non-veg",
          total: "£ 155"
        },
        {
          id: "asda",
          dish_name: "Veg - Corn",
          dish_size: "full",
          dish_quantity: 1,
          dish_type: "veg",
          total: "£ 175"
        }
      ]
    },
    {
      id: "2",
      avatar:
        "data:image/jpeg;base64,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",
      name: "Amrutha",
      items: []
    },
    {
      id: "3",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa1xrTa1l-u9Gecb8Jre8SSXfEbLfH-KGe0drosdue72bmq7wTUg&s",
      name: "Chandlar",
      items: [
        {
          id: "asda",
          dish_name: "kadhai chicken",
          dish_size: "half",
          dish_quantity: 2,
          dish_type: "non-veg",
          total: "£ 155"
        },
        {
          id: "asda",
          dish_name: "Veg rice balls",
          dish_size: "full",
          dish_quantity: 1,
          dish_type: "veg",
          total: "£ 175"
        }
      ]
    },
    {
      id: "4",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2_XAoq1uMsC016P538PRKi7MZtlowBuUn7mKAaUQA6JRhnI5C7A&s",
      name: "joey",
      items: [
        {
          id: "asda",
          dish_name: "kadhai chicken",
          dish_size: "half",
          dish_quantity: 2,
          dish_type: "non-veg",
          total: "£ 155"
        },
        {
          id: "asda",
          dish_name: "Veg rice balls",
          dish_size: "full",
          dish_quantity: 1,
          dish_type: "veg",
          total: "£ 175"
        }
      ]
    },
    {
      id: "5",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRstyx5rjbU1_EiUXsKix-eoBQz69G39TrDbhLbCbu9r_TdYvsQaQ&s",
      name: "Peter",
      items: [
        {
          id: "asda",
          dish_name: "kadhai chicken",
          dish_size: "half",
          dish_quantity: 2,
          dish_type: "non-veg",
          total: "£ 155"
        },
        {
          id: "asda",
          dish_name: "Veg rice balls",
          dish_size: "full",
          dish_quantity: 1,
          dish_type: "veg",
          total: "£ 175"
        }
      ]
    },
    {
      id: "6",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoMnq8bzCU6CUb2PkFvfBnME6H6qYtnZe6n8_t1Cmh3392Kk8e&s",
      name: "Aman",
      items: [
        {
          id: "asda",
          dish_name: "kadhai chicken",
          dish_size: "half",
          dish_quantity: 2,
          dish_type: "non-veg",
          total: "£ 155",
          total: "£ 175"
        },

        {
          id: "asda",
          dish_name: "Veg rice balls",
          dish_size: "full",
          dish_quantity: 1,
          dish_type: "veg",
          total: "£ 175"
        }
      ]
    }
    // {
    //   item: [{}]
    // }
  ]
};

export default class groupDetails extends Component {
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
      isHidden: true,
      orders: "1",
      data: DATA
    };
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={this.state.data.items}
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
          {/* <Divider style={styles.divider} /> */}
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
          <Divider style={styles.divider} />
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
    justifyContent: "flex-start",
    marginHorizontal: 10,
    marginVertical: 8
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
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10
  },
  leftText: {
    fontSize: 14,
    marginHorizontal: 5,
    marginTop: 10
  }
});
