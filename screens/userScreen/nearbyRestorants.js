import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TouchableHighlight,
  Alert
} from "react-native";
import { Overlay } from "react-native-elements";
import axios from 'axios';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Button
} from "react-native-elements";
import Loading from "../../components/Loading";
import FontAwesomeSpin from "../../components/Spin.js"
import global from "../../global";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Icon, Divider } from "react-native-elements";
import Geocoder from 'react-native-geocoding';
import { getNearBy, gerMerchantMenu } from "../../utils/Api";
import * as MailComposer from "expo-mail-composer"
import Modal from "react-native-modal";
import * as Svg from 'react-native-svg';
import { SearchCuisineById, StoreUserData, GetOpenTime, sendSupportEmail } from "../../utils/Api";

export default class nearbyRestorants extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    const screenHeight = Math.round(Dimensions.get('window').height);
    // this._getLocationAsync()
    this.state = {
      scrollY: new Animated.Value(screenHeight),
      mapAnimatedHeight: new Animated.Value(screenHeight),
      data: [],
      cLocation: {
        lat: 0.0,
        lng: 0.0
      },
      loading: false,
      isChanging: true,
      mapHeight: 50,
      cAddress: "",
      orgLocation: {
        lat: 0.0,
        lng: 0.0
      },
      nearbyList: [],
      isModalVisible: false,
      mapLoading: false,
      userEmail: '',
      suggestAddress: '',
      toemail: 'support@grubhouse.co.uk',
      nearbyRestList: []
    };
  }
  success = (pos) => {
    var crd = pos.coords;
  }

  error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  //get current location
  _getLocationAsync = async () => {
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
    this.setState(
      {
        orgLocation: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        },
        cLocation: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        loading: false,
        mapLoading: true
      });
      setTimeout(() => {
        this.setState({
          mapLoading: true
        })
      }, 500)
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
          this.setState(
            {
              orgLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              cLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              loading: false,
             
            });
            setTimeout(() => {
              this.setState({
                mapLoading: true
              })
            }, 500)
        },
        (err) => {
          alert("Location permission is denied");
          // console.log(err);
        },
        GET_LOCATION_OPTIONS,
      );
    }   
  };
  checkOpen = (merchant_id) => {
    GetOpenTime(merchant_id).then(res=>{
      if (typeof res == "undefined"){
        return false
      } else {
        var dateIndex = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ]
        var cDate = new Date()
        var cDay = cDate.getDay()
        var cTime = cDate.getHours()
        var msg = ""
        msg +=this.props.navigation.state.params.merchant.name+" is not opened now "
  
        if(res.pre_order){
          msg += "\nBut is accepting preorders"
        } else {
          this.setState({preorderStatus: false})
        }
        if(res.stores_open_starts){
          var openTime = Number(res.stores_open_starts[dateIndex[cDay]].split(":")[0])
          var closeTime = Number(res.stores_open_ends[dateIndex[cDay]].split(":")[0])
          // console.log(openTime, cTime, closeTime)
          if(openTime > closeTime){
            if(openTime > cTime)
            return false
          } else if (openTime < closeTime){
            if(openTime > cTime || cTime > closeTime)
            return false
          } else if(!res.stores_open_starts[dateIndex[cDay]]) {
            return false
            // console.log("2")
          }
        } else {
          return false
        }
      }
      return true
    })
  }
  

  changeLocation = async () => {
    // to bottom animation
    const screenHeight = Math.round(Dimensions.get('window').height);
    Animated.timing(this.state.scrollY, {
      toValue: screenHeight,
      duration: 500,
    }).start();
    Animated.timing(this.state.mapAnimatedHeight, {
      toValue: screenHeight,
      duration: 500,
    }).start();
    this.setState({ isChanging: true })
  }

  searchComplete = async () => {
    // to top
    Animated.timing(this.state.scrollY, {
      toValue: 0,
      duration: 500,
    }).start();
    Animated.timing(this.state.mapAnimatedHeight, {
      toValue: 290,
      duration: 500,
    }).start();
    this.setState({
      isChanging: false
    })
  }

  searchArea = async () => {
    // get location from moved region of map view
    let location = this.refs.mapView.__lastRegion
    // console.log("currentRegion", location)
    this.getRests({
      latitude: location.latitude,
      longitude: location.longitude
    })
  }

  getRests = async (location) => {
    // get restaurants from database
    this.setState({
      loading: true,
      cLocation: {
        lat: location.latitude,
        lng: location.longitude
      },
      nearbyList: [],
      cAddress: ""
    });
    var street = ''
    var city = ''
    // if (Platform.OS === "ios") {
      var address = await Location.reverseGeocodeAsync(location).catch(err=>{
        setTimeout(()=>{
          this.setState({loading: false })
          this.searchComplete()
        }, 3000)
      })
      if(typeof address == "undefined"){
        setTimeout(()=>{
          this.setState({loading: false })
          this.searchComplete()
        }, 3)
      }
      this.setState({ cAddress: address[0].street })
      let data = []
      let restsData = []
      getNearBy(location)
        .then(response => {
          var rests= response.details.data

          rests.sort(function(a, b){
            if(a.open_startus && !b.open_startus){
              return -1
            } else {
              return 1
            }
          })

          rests.map(async (rest, index) => {
            if(rest.opening){
              // console.log(rest.opening)
            }
            data.push({
              id: rest.merchant_id,
              name: rest.restaurant_name,
              fullAddress: rest.street + ", " + rest.city + ", " + rest.state,
              address: rest.street,
              image: rest.logo != "" ? "https://www.grubhouse.co.uk/upload/" + rest.logo : "https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
              price_level: 4,
              cuisine: rest.cuisine,
              rating: rest.rating,
              open_time: this.getServeTime(rest.stores_open_day, rest.stores_open_starts, rest.stores_open_ends, "start"),
              // review: rest.ratings==null? "0":rest.ratings.toFixed(2),
              close_time: this.getServeTime(rest.stores_open_day, rest.stores_open_starts, rest.stores_open_ends, "end"),
              distance: rest.distance,
              lat: rest.latitude ? rest.latitude : 0,
              lng: rest.lontitude ? rest.lontitude : 0,
              service: rest.service,
              slug: rest.restaurant_slug,
              delivery_charges: rest.delivery_charges,
              delivery_estimation: rest.delivery_estimation,
              open_startus: rest.open_startus
            })
          })

          this.setState({ nearbyList: data, nearbyRestList: data, loading: false })

          // console.log("nearby restaurants data", data)
          this.searchComplete()
        });
    setTimeout(()=>{
      this.setState({loading: false })
      this.searchComplete()
    }, 10000)

  }
  
  getServeTime = (open_days, starts, ends, flag)=> {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]
    var d = new Date()
    var cDay = d.getDay()
    if(flag == "start") {
      return starts[days[cDay]]?starts[days[cDay]]:"05:00"
    } else  {
      return ends[days[cDay]]?ends[days[cDay]]:"22:00"
    }
  }
  suggestCity = () => {
    this.setState({
      isModalVisible: true
    })
  }

  hideModal = () => {
    this.setState({
      isModalVisible: false
    })
  }
  sendMail = () => {

    if(this.state.userEmail==""){
      alert("please insert your email")
    } else if (this.state.suggestAddress=="") {
      alert("Please insert your suggest address")
    } else {
      this.setState({
        isModalVisible: false
      })
      var mailBody = "I suggest this address: "+this.state.suggestAddress
      sendSupportEmail(mailBody, "Suggest Address").then(res=>{
        Alert.alert("GRUBHOUSE", res.msg)
      })
    }
    
  }
  rad = (x) => {
    return x * Math.PI / 180;
  };
  getDistance = (rest) => {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(rest.lat - this.state.cLocation.lat);
    var dLong = this.rad(rest.lng - this.state.cLocation.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(rest.lat)) * Math.cos(this.rad(rest.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return (d / 1000).toFixed(1) + "km"; // returns the distance in meter
  }
  goOriginal = () => {
    // console.log(this.state.orgLocation)
    this.refs.mapView.animateToRegion(
      {
        latitude: this.state.orgLocation.lat,
        longitude: this.state.orgLocation.lng,
        latitudeDelta: 0.4022,
        longitudeDelta: 0.0021,
      }, 2000)
    setTimeout(() => {
      this.setState({
        cLocation: {
          lat: this.state.orgLocation.lat,
          lng: this.state.orgLocation.lng
        }
      })
    }, 2000)
  }
  
  componentDidMount() {
    this._getLocationAsync()
    // this.changeLocation()
  }

  deliveryOptions=(serviceType)=>{		
    switch (serviceType) {
      case "2":
        return <View 
        style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Delivery</Text>
      </View>
        break;
      case "3":
        return <View 
        style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Pick Up</Text>
      </View>
        break;
        
      case "4":	
        return [<View 
          style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Delivery</Text>
        </View>, 
          <View 
          style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Pick Up</Text>
        </View>,
          <View 
          style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Dine In</Text>
        </View>
          ]
         break;
         
      case "5":	
         return [<View 
          style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Delivery</Text>
        </View>, 
        <View 
        style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Dine In</Text>
      </View>
        ]
         break;
         
      case "6":	
         return [
          <View 
          style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Pick Up</Text>
        </View>,
        <View 
        style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Dine In</Text>
      </View>
        ]                        
         break;   
        
      case "7":	
         return [
          <View 
          style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Dine In</Text>
        </View>
        ]
         break;       
            
      default:
        return [<View 
              style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
              Component = {TouchableOpacity}  
            >
              <Icon
                name="check-circle"
                type="material-community"
                size={20}
                color={"grey"}
              />
              <Text style={styles.cardDescription}>Delivery</Text>
            </View>, 
            <View 
            style={{marginLeft: 10, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
            Component = {TouchableOpacity}  
          >
            <Icon
              name="check-circle"
              type="material-community"
              size={20}
              color={"grey"}
            />
            <Text style={styles.cardDescription}>Pick Up</Text>
          </View>
            ]
        break;
    }
  }
  
  getMenu = (rest)=>{
    // console.log(rest)
    var merchant = {
      id: rest.id,
      name: rest.name,
      image: rest.image,
      address: rest.fullAddress,
      rating: rest.rating,
      slug: rest.slug,
      service: rest.service,
      delivery_time:rest.delivery_estimation,
      amount: (rest.delivery_charges*1).toFixed(2),
    }
    gerMerchantMenu(rest.id).then((response)=>{
        this.props.navigation.navigate("DetailsScreenNear", {
          merchant: merchant,
          data: response.details
        })
      })
    }

  render() {
    const screenHeight = Math.round(Dimensions.get('window').height);
    if (!this.state.mapLoading){
      return (
      <Overlay isVisible={true} overlayStyle={styles.overlay}>
        <View>
          <Image source={global.ASSETS.LOADING} style={styles.loadingImage} />
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      </Overlay>)
    } else {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Modal isVisible={this.state.isModalVisible} style={{ zIndex: 999 }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: 300, height: 310, backgroundColor: "#fff", borderRadius: 20, padding: 30, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ width: "100%", textAlign: "center", fontSize: 16, color: "#6599D9", marginBottom: 10 }}>Please insert your email to be notified when your location has been added to the platform</Text>
              <TextInput style={styles.input}
                placeholder='Enter Your Email'
                onChangeText={(v) => { this.setState({ userEmail: v }) }}
                style={styles.inputText}
                value={this.state.searchAddress}
              />
              <TextInput style={styles.input}
                placeholder='Enter Area'
                onChangeText={(v) => { this.setState({ suggestAddress: v }) }}
                style={styles.inputText}
                value={this.state.searchAddress}
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
        <Animated.View style={styles.mapContainer, { height: this.state.mapAnimatedHeight }} ref="mapContainer">
          {/* map view container */}
          
          <MapView
            ref="mapView"
            showsMyLocationButton
            style={{ flex: 1, width: global.CONSTANT.WIDTH }}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: this.state.cLocation.lat,
              longitude: this.state.cLocation.lng,
              latitudeDelta: 0.3022,
              longitudeDelta: 0.0021,
            }}
          >
            {this.state.nearbyRestList.length > 0 ? this.state.nearbyList.map((rest, index) => (
              <MapView.Marker
                key={index + 0.2}
                coordinate={{
                  latitude: rest.lat,
                  longitude: rest.lng
                }}
              // style={{width: 10, height: 10}}
              >
                <Image
                  source={require('../../assets/emptyNumber1.png')}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
                <MapView.Callout onPress={()=>this.getMenu(rest)
                }
                  key={index + 0.1}
                >
                  <TouchableHighlight underlayColor='#dddddd'>
                    <View style={styles.callView}>
                      <View style={{ marginBottom: 4 }}>
                        <Text>{rest.name}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "80%" }}>
                          <View style={{ width: 30, flexDirection: "row", alignItems: "center" }}>
                            <Icon
                              name="map-marker-check"
                              type="material-community"
                              color="gray"
                            />
                          </View>
                          <View style={{ overflow: "hidden", height: 40, width: 140, flexDirection: "row", alignItems: "center" }}>
                            <Text>{rest.fullAddress}</Text>
                          </View>
                        </View>
                        <View style={{ width: "20%", height: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                          <Text>
                            <Icon
                              name="chevron-right"
                              type="material-community"
                              color="gray"
                            />
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                </MapView.Callout>
              </MapView.Marker>
            )) : null}
            {this.state.loading ?
              <Marker
                coordinate={{
                  latitude: this.state.cLocation.lat,
                  longitude: this.state.cLocation.lng,
                }}
                style={{ animated: false }}
                Component={TouchableOpacity}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <FontAwesomeSpin>
                  <Image source={global.ASSETS.MAP_LOAD} style={{ width: 40, height: 40 }} />
                </FontAwesomeSpin>
              </Marker> : null}
            <Marker
              coordinate={{
                latitude: this.state.cLocation.lat,
                longitude: this.state.cLocation.lng,
              }}
              style={{ animated: true, zIndex: 99, flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              Component={TouchableOpacity}
              anchor={{ x: 0.5, y: 0.9 }}
            >
              <Icon
                name="map-marker"
                type="material-community"
                size={35}
                color="blue"
                style={styles.mapMarker}
              />
              <MapView.Callout
                  key={199+ 0.1}
                >
                  <TouchableHighlight underlayColor='#dddddd'>
                    <View style={styles.callLocationView}>
                      <Text>
                        {this.state.cAddress}
                      </Text>
                    </View>
                  </TouchableHighlight>
                </MapView.Callout>
            </Marker>
          </MapView>
        </Animated.View>
        {/* // background container */}
        <Animated.View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "transparent", position: "absolute", top: this.state.scrollY, paddingBottom: 20 }}>
          <ScrollView style={styles.bgContainer, { backgroundColor: "transparent", width: "100%" }}>
            {/* Map container */}
            <Text onPress={this.searchComplete} style={{ fontSize: 25, textAlign: "left", width: "100%", paddingBottom: 200, padding: 50, }} onPress={this.changeLocation}></Text>
            {/* bottom container */}
            <View style={styles.bottomContainer}>
              {/* nearby text container */}
              {this.state.nearbyList.length > 0 ?
                <View>
                  <Text style={styles.restaurantText}>NEARBY RESTAURANTS</Text>
                </View> : null}
              {/*  restaurant detail flatlis container */}
              <View style={styles.crispyFlatlist, { backgroundColor: "transparent" }}>
                {/* flatlist */}
                {this.state.nearbyList.length > 0 ? <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.nearbyList}
                  renderItem={({ item: d }) => (
                    <View
                      style={{
                        borderColor: "gray",
                        borderWidth: 0.2,
                        marginHorizontal: 10,
                        backgroundColor: "#fff",
                        marginBottom: 20,
                        borderRadius: 10,
                        position: "relative"
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.getMenu(d)}
                      >
                        {
                          d.open_startus?null:<View style={{borderRadius: 5, position: 'absolute', top:0, zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.4)', width: "100%", height: "100%", resizeMode: "cover", justifyContent: "center", alignItems: "center"}} >
                            <Text style={{color: "white", width: "80%", fontSize: 20}}>This merchant is closed today{d.open_startus}</Text>
                          </View>
                        }
                            
                        <Image source={{ uri: d.image }} style={styles.images} />
                        <View style={styles.timeContainer}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              // marginLeft: 6
                            }}
                          >
                            <View style={styles.greenContainer}>
                              <Text style={styles.openText}> Open </Text>
                            </View>
                            <Text style={styles.timeText}> {d.open_time}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              backgroundColor: "rgba(0,0,0,0.3)",
                            }}
                          >
                            <View style={styles.redContainer}>
                              <Text style={styles.openText}> Close </Text>
                            </View>
                            <Text style={styles.timeText}> {d.close_time} </Text>
                          </View>
                        </View>
                        <Text style={styles.missText}>{d.name}</Text>
                        <Text style={styles.addressText}>{d.fullAddress}</Text>
                        <View style={styles.amountContainer}>
                          <Text style={styles.amountText}>£&nbsp;</Text>
                          <Text style={styles.amountText}>&nbsp;&nbsp;･&nbsp;&nbsp;</Text>
                          <Text style={styles.amountText}>{d.distance}</Text>
                          <Text style={styles.amountText}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                          {/* <Text style={styles.amountText}>{d.rating.ratings}</Text> */}
                          <View style={{flexDirection: "row", marginLeft: "auto"}}>
                            {this.deliveryOptions(d.service)}  
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                /> :
                  <View style={{ width: "100%", height: 400, backgroundColor: "#fff" }}>
                    <View style={{ width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <View style={{}}>
                        <Image
                          style={{ width: 40, height: 40, marginBottom: 5, marginTop: 30 }}
                          source={global.ASSETS.ICON}
                        ></Image>
                      </View>
                      <View style={{ width: "60%", marginBottom: 15 }}>
                        <Text style={{ fontSize: 17, textAlign: "center" }}>GRUB HOUSE</Text>
                      </View>
                      <View style={{ width: "80%", marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, color: "#6599D9", textAlign: "center" }}>
                          Looks like GrubHouse hasn’t reached your area. Suggest your location for us to expand our platform further in the locations looking for our service.
                      </Text>
                      </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <View style={{ width: 140 }}>
                        <Button
                          title="Suggest a city"
                          buttonStyle={styles.search, { margin: "auto" }}
                          titleStyle={styles.searchTitle}
                          type="outline"
                          Component={TouchableOpacity}
                          onPress={this.suggestCity}
                        ></Button>
                      </View>

                    </View>
                  </View>
                }
              </View>
            </View>
          </ScrollView>
        </Animated.View>
        <View style={styles.searchContainer}>
          <View style={styles.searchBtnContainer}>
            {this.state.isChanging ? this.state.loading ? null : <Button
              title="Search this area"
              buttonStyle={styles.search}
              titleStyle={styles.searchTitle}
              type="outline"
              Component={TouchableOpacity}
              onPress={this.searchArea}
            ></Button> : null}

          </View>
          <View style={styles.currentLocContainer, { backgroundColor: "transparent" }}>
            <Button
              buttonStyle={styles.currentLocation}
              onPress={this.goOriginal}
              icon={
                <Icon
                  name="navigation"
                  color="#1A73E8"
                  type="material-community"
                  iconStyle={{ backgroundColor: "#FFF", transform: [{ rotateZ: "45deg" }] }}
                />
              }
              type="outline"
              Component={TouchableOpacity}
            ></Button>
          </View>
        </View>
        <View style={styles.locationChangeContainer}>
          {this.state.loading ?
            <Text style={styles.changeText}>Loading...</Text> : this.state.isChanging ?
              <Text style={styles.changeText}>Drag map to choose search area</Text> : [<Icon
                name="map-marker"
                color="white"
                type="material-community"
                style={{ marginTop: 5 }}
                size={22}></Icon>,
              <Text style={styles.currentAddress}>{this.state.cAddress}</Text>]
          }
          <TouchableOpacity
            style={styles.changeText}
            onPress={this.changeLocation}>
            {this.state.isChanging ? this.state.loading ? <FontAwesomeSpin style={{ fontSize: 32 }}>
              <Icon
                name="rotate-right"
                type="material-community"
                size={22}
                color="#fff"
                style={styles.loadingIcon}
              />
            </FontAwesomeSpin> : null : <Text style={styles.changeText}>Change</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );}
  }
}

const styles = StyleSheet.create({
  inputText:{
    borderWidth: 1, 
    borderColor: "#6599D9", 
    width: 200,
    marginBottom: 10,
    borderRadius: 3,
    padding: 3
    
  },
  overlay: {
    borderColor: global.COLOR.PRIMARY,

    borderWidth: 2,
    opacity: 1,
    height: 150,
    width: 150,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    marginVertical: 5,
    color: global.COLOR.PRIMARY,
  },
  mapMarker: {
    // zIndex: 999
  },
  callLogo: {
    width: "100%",
    height: 40,
    padding: 3,
  },
  callView: {
    flexDirection: "column",
    flex: 1,
    width: 180,
    height: 65,
    padding: 3,
    borderRadius: 5
  },
  callLocationView: {
    flexDirection: "column",
    flex: 1,
    padding: 3,
    flexDirection: "row",
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5
  },
  searchContainer: {
    flexDirection: "row",
    zIndex: 2,
    justifyContent: "flex-end",
    paddingBottom: 4,
    position: "absolute",
    width: "100%",
    height: 40,
    bottom: 47,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  searchBtnContainer: {
    flex: 0.9,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    margin: "auto",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  currentLocContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    margin: "auto",
    right: 4
  },
  currentLocation: {
    zIndex: 16,
    width: 50,
    backgroundColor: "#fff",
    right: 4,
  },
  searchTitle: {
    color: "#1A73E8",
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
  changeText: {
    color: "#fff",
    marginLeft: "auto",
    justifyContent: "flex-end",
  },
  currentAddress: {
    color: "#FFF",
    width: 250,
  },
  locationChangeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#6599D9",
    color: "#000",
    zIndex: 2,
    position: "absolute",
    bottom: 0
  },
  bgContainer: {
    flex: 1,
    width: null,
    // backgroundColor: "#fff",
    // position: "absolute",
    zIndex: 8,
    height: "100%"
    // marginTop: 70,
  },
  mapContainer: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    flex: 1,
    zIndex: -2,
    position: "absolute",
  },

  bottomContainer: {
    flex: 1,
    // zIndex: 8,
    backgroundColor: "#fff",
    // position: "absolute",
  },
  restaurantText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    // paddingTop: 250,
    // backgroundColor: "transparent",
  },
  loadingImage: {
    width: 90,
    height: 90,
  }, 
  images: {
    height: 200,
    // marginHorizontal: 8,
    marginBottom: 5,
    borderRadius: 10,
    resizeMode: "cover",
  },
  missText: {
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 10,
  },
  addressText: {
    fontSize: 20,
    // fontFamily: global.FONT.ITALIC,
    marginHorizontal: 10,
    color: "gray",
    fontStyle: "italic",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "normal",
    marginHorizontal: 6,
    color: "#fff",
    alignSelf: "center",
  },
  amountText: {
    fontSize: 18,
    color: "gray",
    // marginHorizontal:
    // marginBottom: 20
    // marginVertical: 20
  },
  icon: {
    marginTop: -250,
    alignSelf: "center",
    // zIndex: -9,
    // position: "absolute"
  },
  crispyFlatlist: {
    width: "100%",
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginHorizontal: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: -40,
  },
  redContainer: {
    backgroundColor: "red",
    borderRadius: 5,
    width: 70,
  },
  openText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 6,
    color: "#fff",
    marginVertical: 1,
    alignSelf: "center",
  },
  greenContainer: {
    backgroundColor: "green",
    borderRadius: 5,
    width: 70,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginHorizontal: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
