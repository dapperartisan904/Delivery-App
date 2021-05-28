import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Avatar, Input, Button, Image } from "react-native-elements";
import global from "../../global";
import { ScrollView } from "react-native-gesture-handler";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';
// import CustomLoader from "../../components/Loader"
import Toast from 'react-native-toast-message'
import Loading from "../../components/Loading";
import {saveDeliveryAddress} from "../../utils/Api"
export default class newProof extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      proof: global.USER.details.client_info.first_name+" Group",
      deliveryAddress: "",
      isLoading: false,
      loadingText: ""
    };
  }
  autoDetectLocation = async () => {
    Loading.show()
    // console.log(this.props.navigation.state.routeName);
    if (Platform.OS === "ios") {
      // your code using Geolocation and asking for authorisation with
      // Geocoder.init("AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0"); // use a valid API key
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      // geolocation.requestAuthorization()
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });
      }
      let location = await Location.getCurrentPositionAsync({});
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + location.coords.latitude + ',' + location.coords.longitude + "&key=AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0")
          .then((response) => response.json())
          .then((responseJson) => {
              // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
              this.setState({
                deliveryAddress: responseJson.results[0].formatted_address,
                street: responseJson.results[0].address_components[0].long_name+" "+responseJson.results[0].address_components[1].short_name,
                city: responseJson.results[0].address_components[2].short_name,
                state: responseJson.results[0].address_components[3].long_name,
                post_code: responseJson.results[0].address_components[6].long_name
              })
          })
    } else {
      Geocoder.init("AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"); // use a valid API key
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });
      }
      const GET_LOCATION_OPTIONS = {
        enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000
      };
      // get current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log(position)
          fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + "&key=AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0")
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
                this.setState({
                  deliveryAddress: responseJson.results[0].formatted_address,
                  street: responseJson.results[0].address_components[0].long_name+" "+responseJson.results[0].address_components[1].short_name,
                  city: responseJson.results[0].address_components[2].short_name,
                  state: responseJson.results[0].address_components[3].long_name,
                  post_code: responseJson.results[0].address_components[6].long_name
                })
          })
        },
        (err) => {
          alert("Location permission is denied");
          // console.log(err);
        },
        GET_LOCATION_OPTIONS,
      );

    }   
    Loading.hide()
  };


  saveContinue=()=>{
    if(!this.state.proof){
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'You must insert New Group Name',
      })
    } else if(!this.state.deliveryAddress){
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'You must insert Delivery Address, or Auto Detect',
      })
    } else {
      // send reuest to save the new group to mysql server.
      // saveDeliveryAddress({
      //   city: this.state.city,
      //   street: this.state.street,
      //   state: this.state.state,
      //   post_code: this.state.post_code
      // }).then((res)=>{
        this.props.navigation.navigate("FunkyFive", {
          searchAddress: this.state.deliveryAddress,
          groupName: this.state.proof,
        })
      // })
      
      // Toast.show({
      //   type: 'success',
      //   text1: 'Success',
      //   text2: 'New Group is Created',
      // })
    }
  }
  render() {
    return (
      // bg container
      <View style={styles.bgContainer}>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {/* <CustomLoader
          isLoading={this.state.isLoading}
          loadingText={this.state.loadingText}
        /> */}
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.proofContainer}>
            <Icon
              name="chevron-left"
              color="#000"
              type="material-community"
              size={32}
              iconStyle={styles.icon}
              Component={TouchableOpacity}
              onPress={() => this.props.navigation.navigate("NewGrub")}
            />
            <View>
              <Text style={styles.prrofText}>NEW GRUBGROUP</Text>
              <Text style={styles.detailText}>Add Details</Text>
            </View>
            <Image source={global.ASSETS.CHIPS} style={styles.image} />
          </View>
          <Avatar
            containerStyle={styles.avatar}
            rounded
            showEditButton
            size={70}
            source={global.ASSETS.PROFILE}
          />
          <View style={styles.inputContainer}>
            <View style={styles.fromContainer}>
              <Input
                placeholder="Enter group name"
                placeholderTextColor="gray"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                inputStyle={styles.inputText}
                onChangeText={v => this.setState({ proof: v })}
                value={this.state.proof}
              />
            </View>
            <View style={styles.fromContainer}>
              <Input
                placeholder="Enter Delivery address"
                placeholderTextColor="gray"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                inputStyle={styles.inputText}
                onChangeText={v => this.setState({ deliveryAddress: v })}
                value={this.state.deliveryAddress}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginHorizontal: 22,
              marginTop: 20
            }}
          >
            <Icon
              name="crosshairs"
              color={global.COLOR.PRIMARY}
              type="material-community"
              size={24}
              iconStyle={styles.icon}
            />
            <Text onPress={this.autoDetectLocation} style={styles.locationText} TouchableComponent={TouchableOpacity}>Auto Detect My location</Text>
          </View>
          <View style={{ justifyContent: "space-evenly" }}>
            <Text style={styles.addressText}>Previously saved addresses</Text>
          </View>
        </ScrollView>

        {/* proof container */}
        <View style={{ flex: 0.09 }}>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            title="SAVE AND CONTINUE"
            titleStyle={styles.buttonTitle}
            TouchableComponent={TouchableOpacity}
            onPress={this.saveContinue}
            // onPress={() => this.props.navigation.navigate("FunkyFive")}
          />
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
  proofContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: global.CONSTANT.STATUSBAR + 10
  },
  prrofText: {
    fontWeight: "bold",
    fontSize: 18
  },
  detailText: {
    color: "gray",
    fontSize: 16
  },
  icon: {
    // marginTop: 5
    // margin: 8
  },
  avatar: {
    alignSelf: "center",
    marginTop: 40
  },

  inputContainer: {
    marginTop: 30,
    marginHorizontal: 30
  },
  fromContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: global.COLOR.PRIMARY,
    marginTop: 14
    // marginVertical: 20
    // height: 60
    // marginHorizontal: 40
  },

  inputText: {
    fontWeight: "bold",
    fontSize: 18,
    // marginVertical: 10,
    color: "gray",
    marginLeft: 6,
    marginVertical: 6
  },
  inputFiedContainer: {
    borderBottomWidth: 0
  },
  locationText: {
    color: global.COLOR.PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center"
    // marginTop: 9
  },
  addressText: {
    fontWeight: "bold",
    fontSize: 18,
    // margin: 30,
    color: "gray",
    marginTop: 10,
    marginHorizontal: 20
  },
  oldAddress: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 10
  },
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "#000"

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 60,
    width: 400
    // marginTop: 50
  },
  buttonTitle: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 20,
    marginTop: -5
  },
  image: {
    height: 60,
    width: 60,
    resizeMode: "cover"
  }
});
