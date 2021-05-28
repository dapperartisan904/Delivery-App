import React, { Component } from "react";
import {
  Text, StyleSheet, View, TouchableOpacity, TextInput, ImageBackground, ScrollView, FlatList,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import global from "../../global";
import ScrollableTabView from "react-native-scrollable-tab-view";
import Restaurant from "../../screens/userScreen/restaurantScreen";
import Dish from "../../screens/userScreen/dishScreen";
import { Input, Image } from "react-native-elements";
import Modal from "react-native-modal";
import { sendSupportEmail } from "../../utils/Api";

import * as MailComposer from "expo-mail-composer"

export default class addressSearchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search_type: "",
      filter: true,
      searchAddress: this.props.navigation.state.params.searchAddress,
      originalRestData: this.props.navigation.state.params.originalRestData,
      restData: this.props.navigation.state.params.restData,
      filterRestData: this.props.navigation.state.params.restData,
      category: this.props.navigation.state.params.category,
      cuisineCategory: this.props.navigation.state.params.cuisineCategory,
      cuisineList: this.props.navigation.state.params.cuisineList,
      searchBar: false,
      searchedCuisine: [],
      suggestAddress: "",
      userEmail: "",
      toemail: 'support@grubhouse.co.uk',
      isModalVisible: false,
      isAlertModalVisible: false,
    };
  }
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: <View
        style={{ width: "100%", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <Text style={{ color: 'black', fontSize: 18, fontWeight: "bold", fontFamily: global.FONT.Simonetta_Regular }}>Search Restaurants</Text>

      </View>,
      headerStyle: {
        backgroundColor: "#fff"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold",
        fontFamily: global.FONT.Simonetta_Regular
      },
      headerRight: () => <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 15 }}>
        <TouchableOpacity
          onPress={() => { params.handleThis(); }}
        >
          <Icon
            name="magnify"
            color="#000"
            type="material-community"
            size={25}
          />
        </TouchableOpacity>
      </View>
    }
  };
  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.showSearch,
    });
    // console.log(this.state.filterRestData.length, "before show modal")
    // this.showAlertModal()
    if (this.state.filterRestData.length == 0) {
      this.showAlertModal()
    }
  }
  sendMail = () => {
    if (this.state.userEmail == "") {
      alert("please insert your email")
    } else if (this.state.suggestAddress == "") {
      alert("Please insert your suggest address")
    } else {
      this.setState({
        isModalVisible: false
      })
      sendSupportEmail("I suggest this address:" + this.state.suggestAddress, "Suggest location").then(res => {
        Alert.alert("GRUBHOUSE", res.msg)
      })
    }
  }
  filter = (value) => {
    // console.log(value)
    var temp = []
    var cuisine = []
    var filteredText = []
    value = value.toLowerCase()
    if (value != "") {
      this.state.filterRestData.map((rest, index) => {
        if (rest.restaurant_name.toLowerCase().indexOf(value) >= 0) {
          temp.push(rest)
          if (filteredText.indexOf({
            type: "Restaurant",
            title: rest.restaurant_name
          }) < 0) {
            filteredText.push({
              type: "Restaurant",
              title: rest.restaurant_name
            })
          }
        }
        var flag = false
        if (typeof rest.menu.list != "undefined")
          for (var i = 0; i < rest.menu.list.length; i++) {
            if (flag) {
              flag = false
              break;
            }
            for (var j = 0; j < rest.menu.list[i].item.length; j++) {
              if (rest.menu.list[i].item[j].item_name.toLowerCase().indexOf(value) >= 0) {
                if (temp.indexOf(rest) < 0) {
                  temp.push(rest)
                }
                flag = true
                if (filteredText.indexOf({
                  type: "Cuisine",
                  title: rest.menu.list[i].item[j].item_name
                }) < 0) {
                  filteredText.push({
                    type: "Cuisine",
                    title: rest.menu.list[i].item[j].item_name
                  })
                }
                if (cuisine.indexOf(rest.menu.list[i].item[j]) < 0) {
                  cuisine.push(rest.menu.list[i].item[j])
                }
                break;
              }
            }
          }
      })
    } else {
      temp = this.state.restData
    }
    var t = ""
    filteredText.map((tx, index) => {
      t += tx.type + ": " + tx.title
      if (index + 1 != index) {
        t += ","
      }
    })
    // console.log(cuisine, "temp")

    this.setState({ filterRestData: temp, searchedText: t, searchedCuisine: cuisine })
  }
  showSearch = () => {
    this.setState({ searchBar: true })
  }
  suggestCity = () => {
    this.setState({
      isModalVisible: true,
      isAlertModalVisible: false
    })
  }
  hideSuggest = () => {
    this.setState({
      isAlertModalVisible: false
    })
    this.props.navigation.goBack(null)
  }
  showAlertModal = () => {
    this.setState({
      isAlertModalVisible: true
    })
  }

  hideModal = () => {
    this.setState({
      isModalVisible: false
    })
  }
  render() {
    return (
      // background containe
      <View style={styles.bgContainer}>
        <Modal isVisible={this.state.isModalVisible} style={{ zIndex: 999 }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: 300, height: 310, backgroundColor: "#fff", borderRadius: 20, padding: 30, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ width: "100%", textAlign: "center", fontSize: 16, color: "#6599D9", marginBottom: 10 }}>Please insert your email to be notified when your location has been added to the platform</Text>
              <TextInput style={styles.input}
                placeholder='Enter Your Email'
                onChangeText={(v) => { this.setState({ userEmail: v }) }}
                style={styles.inputText}
                value={this.state.userEmail}
              />
              <TextInput style={styles.input}
                placeholder='Enter Area'
                onChangeText={(v) => { this.setState({ suggestAddress: v }) }}
                style={styles.inputText}
                value={this.state.suggestAddress}
              />
              <Button
                title="Submit"
                buttonStyle={styles.search}
                titleStyle={styles.searchTitle}
                type="outline"
                Component={TouchableOpacity}
                onPress={this.sendMail}
              ></Button>
              <Button
                title="Cancel"
                buttonStyle={styles.search}
                titleStyle={styles.searchTitle}
                type="outline"
                Component={TouchableOpacity}
                onPress={this.hideModal}
              ></Button>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isAlertModalVisible} style={{ zIndex: 998, height: 150 }}>
          <View style={{ flex: 1, width: "100%", height: 250, justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: 300, height: 250, backgroundColor: "#fff", borderRadius: 20, padding: 30, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ width: "100%", textAlign: "center", fontSize: 16, color: "#6599D9", marginBottom: 30 }}>Looks like GrubHouse hasn't reached your area. Suggest your location for us to expand our platform further in the locations looking for our service.</Text>
              <Button
                title="Suggest a City"
                buttonStyle={styles.search}
                titleStyle={styles.searchTitle}
                type="outline"
                Component={TouchableOpacity}
                onPress={this.suggestCity}
              ></Button>
              <Button
                title="Cancel"
                buttonStyle={styles.search}
                titleStyle={styles.searchTitle}
                type="outline"
                Component={TouchableOpacity}
                onPress={this.hideSuggest}
              ></Button>
            </View>
          </View>
        </Modal>
        {/* input container */}
        <View
          style={{
            // marginTop: global.CONSTANT.STATUSBAR + 20,
            marginHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {
            this.state.searchBar && <View style={{ marginTop: -3, top: 0, position: "absolute", flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "white", zIndex: 100, width: "100%", height: 50, marginBottom: 15 }}>
              <View style={{ flex: 9, padding: 5, width: "100%" }}>
                <Input
                  leftIcon={{ type: "material-community", name: "magnify", color: "white" }}
                  placeholder="Search for a Dish or Restaurant"
                  placeholderTextColor="#FFF"
                  inputContainerStyle={styles.inputFiedContainer}
                  keyboardType="default"
                  inputStyle={{ color: "white" }}
                  onChangeText={value => { this.setState({ searchText: value }); this.filter(value) }}
                />
              </View>

              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginHorizontal: 6, paddingTop: 25, position: "absolute", right: 15 }}>
                <Icon
                  name="close"
                  // reverse
                  color="#000"
                  type="material-community"
                  size={20}
                  iconStyle={{ width: 25, height: 25, backgroundColor: "gray", borderRadius: 2, padding: 3 }}
                  onPress={() => {
                    this.setState({
                      searchBar: false,
                      filterRestData: this.state.restData
                    });
                    setTimeout(() => { this.filter("") }, 500)
                  }}
                />
              </View>
            </View>
          }
          {/* <Text style={styles.addressText}>Address Search :</Text> */}
          <Text style={styles.bottomText} numberOfLines={1}>
            Address: &nbsp;{this.state.searchAddress}
          </Text>

        </View>

        {
          this.state.searchBar && <View style={{ flexDirection: "column" }}>
            <View>
              <Text style={styles.bottomText, { marginTop: 35, paddingLeft: 20 }} numberOfLines={1}>
                Searched: {this.state.searchedText}
              </Text>
            </View>
            <View style={styles.crispyFlatlist, { padding: 10 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.searchedCuisine}
                renderItem={({ item: d }) => (
                  <View style={{ marginRight: 10 }}>
                    <Image
                      source={{ uri: d.photo }}
                      style={{ height: 80, width: 80, borderRadius: 6, borderWidth: 2, borderColor: "#000" }}
                      PlaceholderContent={<Image source={require("../../assets/food.png")} />}
                    />
                    <Text style={{ width: 80 }} numberOfLines={2} >{d.item_name}</Text>
                    <Text style={styles.amountText}>{typeof d.prices[0] !== "undefined" ? d.prices[0].replace("&nbsp;", "  ") : null}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        }
        <Restaurant
          navigation={this.props.navigation}
          originalRestData={this.state.filterRestData}
          restData={this.state.filterRestData}
          cuisineList={this.props.navigation.state.params.cuisineList}
          fromHome={true}
        />
        <View>
          {
            this.state.filterRestData.length ? <Button
              containerStyle={styles.menuContainer}
              buttonStyle={styles.menuButtonStyle}
              icon={{
                name: "map",
                color: "#fff",
                size: 18,
              }}
              title=" Map"
              titleStyle={styles.menuTitle}
              TouchableComponent={TouchableOpacity}
              onPress={() => {
                this.props.navigation.navigate("restaurantMapView", {
                  restList: this.state.filterRestData,
                  cuisine: this.state.cuisineList
                })
              }}
            /> : null
          }

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputFiedContainer: {
    marginTop: global.CONSTANT.STATUSBAR,
    borderBottomWidth: 0,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "gray",
    backgroundColor: "#292D3E",
    width: "100%"
    // borderRadius: 20
    // marginLeft: 30
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },
  inputText: {
    borderWidth: 1,
    borderColor: "#6599D9",
    width: 200,
    marginBottom: 10,
    borderRadius: 3,
    padding: 3
  },
  tabContainer: {
    marginTop: -20,
  },
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomText: {
    fontSize: 16,
    color: global.COLOR.PRIMARY,
    width: 250,
    alignSelf: "center",
    marginHorizontal: 5,
  },
  sortView: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    marginLeft: 10,
    marginTop: 10,
  },
  sortText: {
    marginHorizontal: 10,
    marginVertical: 5,
    fontSize: 18,
  },
  menuContainer: {
    alignSelf: "center",
    backgroundColor: "#000",

    zIndex: 9,
    position: "absolute",
    marginTop: -70,
  },
  menuButtonStyle: {
    backgroundColor: "transparent",
    height: 44,
    width: 120,
    borderRadius: 40,
    // marginTop: 50
  },
  menuTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 15,
  },
  search: {
    backgroundColor: "#FFF",
    color: "white",
    width: 150,
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    height: 40
  },
});
