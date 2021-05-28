import React, { Component, useEffect } from "react";
import * as Permissions from "expo-permissions";
import Geocoder from 'react-native-geocoding';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Clipboard
} from "react-native";
import { Icon, Avatar, Input, Button, Overlay } from "react-native-elements";
import global from "../../global";
import * as Contacts from "expo-contacts";
import { ScrollView } from "react-native-gesture-handler";
import {GetCategory, SearchAddress} from "../../utils/Api"

const DATA = {
  preOrder: [
    {
      id: "1",
      name: "A U Ramesh M",
      number: "9876543210"
    }
  ]
};
export default class funkyFive extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    // this.requestPermissionsAsync();
    this.getContactsAsync();
    this.state = {
      link: "https://www.grubhouse.in/GRUBHOUSE",
      overlay: false,
      data: [],
      selected: [],
      refresh: false,
      filterText: ""
    };
  }
  getContactsAsync = async () => {
    
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers]
      });

      if (data.length > 0) {
        const contact = data;
        this.setState({ data });
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        var hours = new Date().getHours(); //To get the Current Hours
        var min = new Date().getMinutes(); //To get the Current Minutes
        var sec = new Date().getSeconds(); //To get the Current Seconds
        this.setState({link:  "https://www.grubhouse.in/GRUBHOUSE"+year+month+date+hours+min+sec})
        // console.log(contact);
      }
    }
  };
  order=()=>{
    // console.log("you can order now", this.props.navigation.state.params.merchant)
    if(typeof this.props.navigation.state.params.merchant !=="undefined"){
      this.props.navigation.navigate("Orders", {
        merchant: this.props.navigation.state.params.merchant,
        groupName: this.props.navigation.state.params.groupName,
        selected: this.state.selected          
      })
    } else {
      alert("First, You have to select the restaurant for delivery!")
    }
  }

  copyLink = () => {
    Clipboard.setString(this.state.link);
    alert("Link is copied!")
  };

  getData =()=>{
    let rest = []
    if(this.state.searchAddress.length>0){
      GetCategory().then(res=>{
        let cuisineData= []
        res.details.map((c, i)=>{
          cuisineData[c.cuisine_id] = c.cuisine_name
        })
        this.setState({cuisineCategory: res.details})
        this.setState({
          cuisineList: cuisineData
        })
        this.searchFunc()
      })
    } else {
      alert("Please insert Address")
    }
    
  }
  
  searchFunc=async()=>{
    var latitude =''
    var longitude =''
    let rest = []
    let temp = []
    if(Platform.OS === "ios"){
      // your code using Geolocation and asking for authorisation with
      Geocoder.init("AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0"); // use a valid API key
      geolocation.requestAuthorization()
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });
      }
   }else{
    Geocoder.init("AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"); // use a valid API key

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }
    }
    var location = ''
    Geocoder.from(this.state.searchAddress)
		.then(json => {
      location= json.results[0].geometry.location;
      // console.log("location from geocoder", location)
			SearchAddress(
        location.lat, location.lng,
        global.USER.details.client_info.client_id
        ).then((res)=>{
        if(res.details)
        res.details.map((elements, index )=>{
          rest.push({
            id:elements.merchant_id,
            image:elements.logo != "" ? "https://www.grubhouse.co.uk/upload/"+elements.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
            restaurant_name: elements.restaurant_name,
            time: "15 - 25 mins",
            food_type: "£ - Fast Food",
            type: elements.street+", "+elements.city+", "+elements.state,
            liked: elements.fab_like?1:0,
            cuisine: elements.cuisine,
            rating: 5,
            coordinate: {
              latitude: elements.latitude,
              longitude: elements.lontitude
            },
            fullAddress: elements.street + ", " + elements.city + ", " + elements.state,
            service: elements.service
          });
          
        })
        temp= res.details

        this.props.navigation.navigate("Select", {
          searchAddress: this.state.searchAddress.trim(),
          originalRestData: res.details,
          restData : res.details,
          category : this.state.cuisineList,
          cuisineCategory: this.state.cuisineCategory,
          cuisine: this.state.cuisineList,
          beforePath: "FunkyFive"
        })
      })
		})
		.catch(error => console.warn(error));
    
  }
  componentDidMount(){
    this.setState({
      searchAddress: this.props.navigation.state.params.searchAddress
    })
  }

  render() {
    // let selected = [];
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={{ flex: 0.8 }}>
          <View style={styles.proofContainer}>
            <Icon
              name="chevron-left"
              color="gray"
              type="material-community"
              size={32}
              iconStyle={styles.icon}
              Component={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("NewProof")}
            />
            <View>
              <Text style={styles.prrofText}> NEW GRUBGROUP:{this.props.navigation.state.params.groupName}</Text>
              <Text style={styles.detailText}> {this.state.selected.length+1} members</Text>
            </View>
            <Image source={global.ASSETS.POPCORN} style={styles.image} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
              marginTop: 20
            }}
          >
            <Text>Delivery from :</Text>
            <TouchableOpacity
              onPress={this.getData}
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
          <View style={{ justifyContent: "space-evenly" }}>
            <View style={styles.adminContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginHorizontal: 10
                }}
              >
                <Avatar rounded size={35} source={global.ASSETS.PROFILE} />

                <Text style={styles.youText}>You</Text>
              </View>
              <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                title="Order"
                titleStyle={styles.buttonTitle}
                TouchableComponent={TouchableOpacity}
                onPress={this.order}
              />
            </View>

            <FlatList
              showsHorizontalScrollIndicator={false}
              data={this.state.selected}
              extraData={this.state.refresh}
              keyExtractor={item => item.id}
              renderItem={({ item: d, index: i }) => (
                <View style={{ justifyContent: "space-evenly" }}>
                  <View style={styles.adminContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginHorizontal: 10
                      }}
                    >
                      <Avatar
                        rounded
                        size={35}
                        source={global.ASSETS.PROFILE}
                      />

                      <Text style={styles.youText}>{d.name}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>

          <Text style={styles.addText}>Add participants to GRUBGROUP</Text>

          <View style={{ justifyContent: "space-evenly" }}>
            <TouchableOpacity
              onPress={() => this.setState({ overlay: true })}
              style={styles.contactContaier}
            >
              <Icon
                name="account-plus-outline"
                color="#fff"
                type="material-community"
                size={24}
                iconStyle={{ marginTop: 10 }}
              />
              <Text style={styles.contactText}>ADD FROM CONTACTS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Invite")}
              style={styles.contactContaier}
            >
              <Icon
                name="facebook-messenger"
                color="#fff"
                type="material-community"
                size={24}
                iconStyle={{ marginTop: 10 }}
              />
              <Text style={styles.contactText}>SEND GRUB HOUSE INVITE</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "#000", marginTop: 50 }}>
            <TouchableOpacity
              onPress={() => Clipboard.setString("mail@mail.com")}
            >
              <Text style={styles.linkText}>{this.state.link}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ alignSelf: "flex-end", margin: 10 }}
            onPress={this.copyLink}
          >
            <Text style={styles.copyText}>Copy Link</Text>
          </TouchableOpacity>
          <View>
            <Image source={global.ASSETS.SUSHI} style={styles.sushiImage} />
          </View>
          <Overlay
            isVisible={this.state.overlay}
            windowBackgroundColor="rgba(255, 255, 255, .3)"
            overlayBackgroundColor="#fff"
            // height={600}
            width={360}
            overlayStyle={{position:"absolute"}}
          >
            <View>
              <Input
                placeholder="Enter Name/Mobile No."
                placeholderTextColor="#000"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                onChangeText={v => this.setState({ filterText: v })}
                inputStyle={styles.inputText}
                style={{position:"absolute", top:0}}
              />
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={this.state.data}
              extraData={this.state.refresh}
              keyExtractor={item => item.id}
              renderItem={({ item: d, index: i }) => (
                this.state.filterText.length>0?d.name.toLowerCase().search(this.state.filterText)>=0?
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.state.selected.includes(d)
                        ? this.state.selected.pop(d)
                        : this.state.selected.push(d);
                      this.setState({ refresh: !this.state.refresh });
                      // console.log(this.state.selected);
                    }}
                    style={[
                      styles.numberContainer,
                      {
                        borderColor: this.state.selected.includes(d)
                          ? "red"
                          : "rgba(0,0,0,0.1)"
                      }
                    ]}
                  >
                    <Text style={styles.nameText}>{d.name}</Text>
                    <Text style={styles.numberText}>
                      {d.phoneNumbers[0].number}
                    </Text>
                  </TouchableOpacity>
                </View>:<View></View>:<View>
                  <TouchableOpacity
                    onPress={() => {
                      this.state.selected.includes(d)
                        ? this.state.selected.pop(d)
                        : this.state.selected.push(d);
                      this.setState({ refresh: !this.state.refresh });
                      // console.log(this.state.selected);
                    }}
                    style={[
                      styles.numberContainer,
                      {
                        borderColor: this.state.selected.includes(d)
                          ? "red"
                          : "rgba(0,0,0,0.1)"
                      }
                    ]}
                  >
                    <Text style={styles.nameText}>{d.name}</Text>
                    <Text style={styles.numberText}>
                      {d.phoneNumbers[0].number}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <View>
              <Button
                containerStyle={styles.menuContainer}
                buttonStyle={styles.menuButtonStyle}
                title="Done"
                titleStyle={styles.menuTitle}
                TouchableComponent={TouchableOpacity}
                onPress={() => this.setState({ overlay: false, filterText: "" })}
              />
            </View>
          </Overlay>
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
    justifyContent: "flex-start",
    marginHorizontal: 6,
    marginTop: global.CONSTANT.STATUSBAR + 10
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
  youText: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16
  },
  adminContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    marginHorizontal: 10
  },
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "#000"

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 30,
    width: 100,
    borderRadius: 40
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 15,
    marginTop: -5
  },
  contactContaier: {
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 36,
    marginTop: 20
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 14,
    marginHorizontal: 10
  },
  linkText: {
    marginVertical: 14,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  addText: {
    color: "gray",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40
  },
  copyText: {
    color: global.COLOR.PRIMARY,
    textAlign: "right",
    // margin: 20,
    fontSize: 18,
    fontWeight: "bold"
  },
  proofContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: global.CONSTANT.STATUSBAR + 10
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 10,
    marginVertical: 8
  },
  image: {
    height: 60,
    width: 60,
    resizeMode: "cover"
  },

  inputText: {
    fontWeight: "bold",
    fontSize: 18,
    // marginVertical: 10,
    color: "#000"
    // marginLeft: -11
  },
  inputFiedContainer: {
    borderBottomWidth: 1,
    marginTop: 20
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  numberText: {
    fontSize: 18,
    color: "gray",
    marginTop: 4
  },
  numberContainer: {
    marginHorizontal: 20,
    // borderBottomColor: "gray",
    // borderBottomWidth: 0.4,
    marginTop: 26,
    borderWidth: 2
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
  sushiImage: {
    height: 120,
    width: 180,
    resizeMode: "cover",
    alignSelf: "center"
  }
});
