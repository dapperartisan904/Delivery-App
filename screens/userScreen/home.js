import React, { Component } from "react";
import axios from 'axios';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  Alert
} from "react-native";
import Axios from "axios";
import global from "../../global";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Icon, Input } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import { Divider } from "react-native-paper";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';
import * as Animatable from "react-native-animatable";
import moment from "moment";
import { SearchCuisineById } from "../../utils/Api";
import ImageLoad from 'react-native-image-placeholder';
import { Loading } from "../../components/Loading"
import { GetCategory5 } from "../../utils/Api";
import { GetRestaurant5, gerMerchantMenu } from "../../utils/Api";
import { GetRestaurantTrending } from "../../utils/Api";
import { GetMonthFavourList } from "../../utils/Api";
import { GetAllRestor, GetUserData, GetCategoryT, SearchAddress, LoadCart, GetCartCount, GetCategoryNearby, CheckCart } from "../../utils/Api";
import { getPushNotificationPermissions, registerForPushNotificationsAsync, sendNotification } from "../../utils/NotificationApi";
import * as Notifications from 'expo-notifications';

import AwesomeAlert from 'react-native-awesome-alerts';
import { indexOf } from "lodash";

export default class home extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      rest_array:[],
      cityName: 'London',
      latitude: 51.5073509,
      longitude: 0.1278,
      currentLocation: "",
      isSearching: false,
      offset: 0,
      mapHeight: 50,
      currentCoords:{
        lat: 0,
        lng: 0
      },
      food:[],
      newOnGrub: [],
      trendingNow:[],
      monthFavourite:[],
      allRestor:[],
      newOnGrubServices: [],
      trendingNowServices:[],
      monthFavouriteServices:[],
      allRestorServices:[],
      isLoading:false,
      loadingText:"",
      showAlert:false,
      searchAddress:'',
      userLocation: {
        latitude: 0.0,
        longitude: 0.0
      },
      autoAddress: []
    };
  }
  componentDidMount(){
    this._getLocationAsync()
    var flag = getPushNotificationPermissions()
    if(flag){
      registerForPushNotificationsAsync().then()
    }
    Notifications.addNotificationReceivedListener(this._handleNotification);
    
    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
  }
  _handleNotification=(notification)=>{
    alert(notification)
  }
  _handleNotificationResponse=(response )=>{
    alert(response)
  }
  searchByAddress=()=>{
    if(this.state.searchAddress.length!=0){
      this.props.navigation.navigate("AddressSearch", {
        searchAddress: this.state.searchAddress.trim()
      })
    } else {
      alert("Please insert Address")
    }
  }
  getGreetingTime = (currentTime) => {
    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const currentHour = parseFloat(currentTime.format("HH"));

    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      // Between 12 PM and 5PM
      return "Good afternoon";
    } else if (currentHour >= splitEvening) {
      // Between 5PM and Midnight
      return "Good evening";
    }
    // Between dawn and noon
    return "Good morning";
  };
    _getLocationAsync = async () => {
      await this.findCategory();
      // console.log(this.props.navigation.state.routeName);
      if (Platform.OS === "ios") {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return false;
        }
     
      } else {
        Geocoder.init("AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"); // use a valid API key
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
          this.setState({
            errorMessage: "Permission to access location was denied",
          });
        }
        
      }   
    };

  rad = (x) => {
      return x * Math.PI / 180;
  };

  getDistance=(lat,lng)=>{
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(lat - this.state.latitude);
    var dLong = this.rad(lng - this.state.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(lat)) * Math.cos(this.rad(lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return (d/1000).toFixed(1)+"km"; // returns the distance in meter
  }
  findCategory = async() =>{
    GetCategoryNearby().then((d)=>{
      let catarray = [];
      if(d.details)
      d.details.map(elements =>{
        catarray.push({
          id:elements.cuisine_id,
          image:"https://www.grubhouse.co.uk/upload/"+elements.featured_image,
          text1:elements.cuisine_name,
        });
        
      });
      this.setState({food: catarray});
    });
    await this.findRestor();
  }
  findRestor = async() => {
    GetRestaurant5().then((restor)=>{
      let arr = [];
      if(restor.details)
      restor.details.data.map(element =>{
          if(element.offers){
            // console.log("+++++++++++++++++++++++++++++++==================================================", element.offers)
          }
          arr.push({
            id : element.merchant_id,
            image : element.logo != "" ? "https://www.grubhouse.co.uk/upload/"+element.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
            name: element.merchant_title,
            address: element.street+", "+element.city+", "+element.state,
            review: element.ratings==null? "0":element.ratings.toFixed(2),
            delivery_time:element.delivery_estimation==""?"15~25min":element.delivery_estimation,
            amount: (element.delivery_charges*1).toFixed(2),
            type:element.cuisine,
            distance:this.getDistance(element.latitude, element.lontitude),
            open_time: "5:00am",
            close_time: "10:00pm",
            service: element.service,
            cuisine: element.cuisine,
            slug: element.restaurant_slug,
            rating: element.rating,
            postCode: element.post_code,
            offers: element.offers
          });
      });
      this.setState({
        newOnGrub: arr,
        newOnGrubServices: restor.details.services
      });
    }) ;
    await this.findRestorTrendingNow();
  }
  findRestorTrendingNow = async() => {
    GetRestaurantTrending().then((trede)=>{
      let ordarr = [];
      if(trede.details)
      trede.details.data.map(ordelement =>{
          ordarr.push({
            id : ordelement.merchant_id,
            image : ordelement.logo != "" ? "https://www.grubhouse.co.uk/upload/"+ordelement.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
            
            address: ordelement.street+", "+ordelement.city+", "+ordelement.state,
            name: ordelement.merchant_title,
            review: ordelement.ratings==null? "0":(ordelement.ratings*1).toFixed(2),
            delivery_time:ordelement.delivery_estimation==""?"15~25min":ordelement.delivery_estimation,
            type:ordelement.cuisine,
            amount: (ordelement.delivery_charges*1).toFixed(2),
            price_level: ordelement.percent_commision,
            distance:this.getDistance(ordelement.latitude, ordelement.lontitude),
            open_time: "5:00am",
            close_time: "10:00pm",
            service: ordelement.service,
            cuisine: ordelement.cuisine,
            slug: ordelement.restaurant_slug,
            rating: ordelement.rating,
            postCode: ordelement.post_code,
            offers: ordelement.offers
          });
      });
      this.setState({
        trendingNow: ordarr,
        trendingNowServices: trede.details.services
      }); 
    })
    await this.getMonthFavour();
  }

  getMonthFavour = async() => {
    GetMonthFavourList().then((months)=>{
      let ordarr = [];
      if(months.details)
      months.details.data.map(ordelement =>{
          ordarr.push({
            id : ordelement.merchant_id,
            image : ordelement.logo != "" ? "https://www.grubhouse.co.uk/upload/"+ordelement.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
            name: ordelement.merchant_title,
            review: ordelement.ratings==null? "0":(ordelement.ratings*1).toFixed(2),
            delivery_time:ordelement.delivery_estimation==""?"15~25min":ordelement.delivery_estimation,
            type:ordelement.cuisine,
            amount: (ordelement.delivery_charges*1).toFixed(2),
            address: ordelement.street+", "+ordelement.city+", "+ordelement.state,
            price_level: ordelement.percent_commision,
            distance:this.getDistance(ordelement.latitude, ordelement.lontitude),
            open_time: "5:00am",
            close_time: "10:00pm",
            service: ordelement.service,
            cuisine: ordelement.cuisine,
            slug: ordelement.restaurant_slug,
            rating: ordelement.rating,
            postCode: ordelement.post_code,
            offers: ordelement.offers
          });
         
      });
      this.setState({
        monthFavourite: ordarr,
        monthFavouriteServices: months.details.services
      });
    })
    
    await this.GetAllRestorList();
  }
  GetAllRestorList = async() => {
    GetAllRestor().then((res)=>{
      let ordarr = [];
      if(res.details)
      res.details.data.map(ordelement =>{
        // console.log(ordelement.merchant_id)
          ordarr.push({
            id : ordelement.merchant_id,
            image : ordelement.logo != "" ? "https://www.grubhouse.co.uk/upload/"+ordelement.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
            name: ordelement.merchant_title,
            review: ordelement.ratings==null? "0":(ordelement.ratings*1).toFixed(2),
            delivery_time:ordelement.delivery_estimation==""?"15~25min":ordelement.delivery_estimation,
            type:ordelement.cuisine,
            amount: (ordelement.delivery_charges*1).toFixed(2),
            address: ordelement.street+", "+ordelement.city+", "+ordelement.state,
            price_level: ordelement.percent_commision,
            distance:this.getDistance(ordelement.latitude, ordelement.lontitude),
            open_time: "5:00am",
            close_time: "10:00pm",
            service: ordelement.service,
            cuisine: ordelement.cuisine,
            slug: ordelement.restaurant_slug,
            rating: ordelement.rating,
            postCode: ordelement.post_code,
            offers: ordelement.offers
          });
      });
      this.setState({
        allRestor: ordarr,
        allRestorServices: res.details.services
      });
      // console.log("services", res.details.services);
      // console.log("global user data",  global.USER.details.client_info.first_name)
      // console.log("all services", this.state.newOnGrubServices, this.state.trendingNowServices, this.state.monthFavouriteServices, this.state.allRestorServices)
    })
  }
  showAlert = () => {
    // console.log(global.USER)
    this.setState({
      showAlert: true
    });
  };
 
  hideAlert = () => {
   
    this.setState({
      showAlert: false
    });
  };
  searchRestById(id){
    // console.log(id)
  }

  deliveryOptions=(serviceType)=>{		
    switch (serviceType) {
      case "2":
        return <View 
        style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={15}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Delivery</Text>
      </View>
        break;
      case "3":
        return <View 
        style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={15}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Pick Up</Text>
      </View>
        break;
        
      case "4":	
        return [<View 
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={15}
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
            size={15}
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
            size={15}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Dine In</Text>
        </View>
          ]
         break;
         
      case "5":	
         return [<View 
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={15}
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
          size={15}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Dine In</Text>
      </View>
        ]
         break;
         
      case "6":	
         return [
          <View 
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={15}
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
          size={15}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Dine In</Text>
      </View>
        ]                        
         break;   
        
      case "7":	
         return [
          <View 
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={15}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Dine In</Text>
        </View>
        ]
         break;       
            
      default:
        return [<View 
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={15}
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
          size={15}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Pick Up</Text>
      </View>
        ]
        break;
    }
  }

  getData =()=>{
    let rest = []
    if(this.state.searchAddress.length>0){
      GetCategoryT().then(res=>{
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
    if (Platform.OS === "ios") {
      
      Geocoder.init("AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0"); // use a valid API key
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
      Geocoder.from(this.state.searchAddress)
        .then(json => {
          let location= json.results[0].geometry.location;
          SearchAddress(
            location.lat, location.lng,
            global.USER.details.client_info.client_id
            ).then((res)=>{
            if(res.details)
            this.props.navigation.navigate("AddressSearch", {
              searchAddress: this.state.searchAddress.trim(),
              originalRestData: res.details,
              restData : res.details,
              category : this.state.cuisineList,
              cuisineCategory: this.state.cuisineCategory,
              cuisine: this.state.cuisineList
            })
          })
        }).catch(error => {
          alert("Please insert the correct address")
          console.warn(error)}
        );
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
      Geocoder.from(this.state.searchAddress)
        .then(json => {
          let location= json.results[0].geometry.location;
          SearchAddress(
            location.lat, location.lng,
            global.USER.details.client_info.client_id
            ).then((res)=>{
            if(res.details)
            this.props.navigation.navigate("AddressSearch", {
              searchAddress: this.state.searchAddress.trim(),
              originalRestData: res.details,
              restData : res.details,
              category : this.state.cuisineList,
              cuisineCategory: this.state.cuisineCategory,
              cuisine: this.state.cuisineList
            })
          })
        }).catch(error => {
          alert("Please insert the correct address")
          console.warn(error)}
        );
    }
  }

  getMenu = (rest)=>{
    gerMerchantMenu(rest.id).then((response)=>{
      // if(response.code == 1){
        this.props.navigation.navigate("DetailsScreen", {
          merchant: rest,
          data: response.details
        })
      // } else {
        // alert("Merchant Id error")
      // }
    })
  }
  autoCompleteApi=async (v)=>{
    Axios.defaults.baseURL = "";
    await Axios({
      method: "get",
      url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+v+"&key="+(Platform.OS == "ios"?"AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0":"AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"),
    }).then(res=>{
      // console.log(res.data)
      var temp = []
      res.data.predictions.map((addCom, index)=>{
        // console.log(addCom.terms[addCom.terms.length-1].value)
        if(addCom.terms[addCom.terms.length-1].value=="UK")
        temp.push(addCom.description)
      })
      this.setState({autoAddress: temp})

    });
    Axios.defaults.baseURL = "http://grubhouse.co.uk/mobileappv2/api/";
  }
  goBasket = ()=>{
    // console.log("check cart")
    CheckCart().then(res=>{
      if(res.merchant){
        var merchant = res.merchant
        // console.log(merchant[0])
        var cart = ""
        var cartCount = ""
        LoadCart(merchant[0].merchant_id, '').then(res=>{
          cart = res
          GetCartCount(merchant[0].merchant_id).then(res=>{
            cartCount = res
            // console.log({
            //   cart: cart,
            //   count: res
            // })
            this.props.navigation.navigate("CustomerBasket", {
              cart: {
                cart: cart,
                count: res
              },
              changePrentCart: ()=>{}, 
              changeParentTotal: ()=>{},
              merchant: {
                id : merchant[0].merchant_id
              }
            })
          })
        })
        
        // console.log("you")
      } else {
        this.props.navigation.navigate("EmptyBasket")
      }
      
    })
    
    
  }
  render() {
    return (
      // backgroound container
      <ScrollView style={styles.bgContainer}>
        {/* upper slider container */}
        <View style={{textAlign:"center"}}>
          <AwesomeAlert
            show={this.state.showAlert}
            showProgress={true}
            title=""
            message="This service is temporarily closed due to lockdown."
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="O K"
            contentContainerStyle={{color:"blue",textAlign:"center"}}

            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
        </View>
        <View style={styles.upperContainer}>
          {/* image background container */}
          <ImageBackground
            source={global.ASSETS.BGIMAGE}
            style={styles.textContainer}
            imageStyle={styles.backgroundImage}
          >
            {/* image container */}
            <View style={styles.imageContainer}>
              {/* table icon container */}
              <View style={styles.iconContainer}>
                {/* table icon */}
                <TouchableOpacity
                  onPress={this.showAlert}
                >
                  <Image
                    source={global.ASSETS.TABLE}
                    style={styles.tableIcon}
                  ></Image>
                </TouchableOpacity>
                {/* shopping icon */}
                <TouchableOpacity
                  onPress={()=>{this.goBasket()}}
                >
                  <Image
                    source={global.ASSETS.SHOPING}
                    style={styles.shoppingIcon}
                  ></Image>
                </TouchableOpacity>
              </View>

              {/* logo container */}
              <Image source={global.ASSETS.LOGO} style={styles.logo}></Image>
              <View style={styles.morningContainer}>
                <Animatable.Text
                  // animation="slideInLeft"
                  style={styles.morningText}
                >
                  {this.getGreetingTime(moment())}&nbsp;{global.USER.details.client_info.first_name}
                </Animatable.Text>
                <Animatable.Text
                  animation="slideInLeft"
                  style={styles.timeText}
                >
                  {this.getGreetingTime(moment()).toLowerCase() ==
                  "good afternoon"
                    ? "Let’s get some lunch "
                    : this.getGreetingTime(moment()).toLowerCase() ==
                      "good evening"
                    ? "what should we have for dinner?"
                    : this.getGreetingTime(moment()).toLowerCase() ==
                      "good morning"
                    ? "Its breakfast time"
                    : ""}
                </Animatable.Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* search container */}
        <View style={{flexDirection: "column", position: "relative", zIndex: 20}}>
          <View style={styles.backSearchContainer}>
          {/* location name container */}
            <View style={styles.neyYorkContainer}>
            <View>
              <Icon
                name="map-marker"
                color="#fff"
                type="material-community"
                size={20}
                iconStyle={styles.icon}
              />
            </View>
            <View>
              <Text style={styles.newyorkText}>London</Text>
            </View>
          </View>
          <View style={styles.searchContainer}>
            <View style={{justifyContent: "center", flexDirection: "row", alignItems: "center", paddingLeft: 10, width: "90%"}}>
              <Input
                placeholder="Search by postcode"
                placeholderTextColor="gray"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                onChangeText = {(v)=>{
                  this.setState({searchAddress: v})
                  this.autoCompleteApi(v)
                }}
                inputStyle={styles.inputText}
                value={this.state.searchAddress}
              />
              <TouchableOpacity style={{width: "20%", marginTop: 5}} onPress={this.getData}>
                <View style={{width: "100%", height: "50%"}}>
                  <Icon
                    name="magnify"
                    color="gray"
                    type="material-community"
                    size={26}
                    iconStyle={styles.serachIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View>
            </View>
          </View>
        </View>
        {
          this.state.searchAddress?<View style={{top: 30, width: "80%",alignSelf: "flex-end", flexDirection: "column", height: 100, zIndex:300, position: "absolute"}}>
          {
            this.state.autoAddress.map((add, index)=>{
              return <TouchableOpacity
                        style={{height: 40, zIndex: 100, paddingHorizontal: 10}}
                        onPress={()=>{
                          this.setState({searchAddress: add, autoAddress: []})
                        }}
                      >
                      <Text style={{height: 40, textAlignVertical: "center", backgroundColor: "white", borderColor: "gray", borderBottomWidth: 1, }}>{add}</Text>
                    </TouchableOpacity>
            })
          }
        </View>:null
        }
        </View>
        
        {/* bottom Container */}
        <View style={styles.bottomContainer}>
          {/* flatlist container */}
          <View style={styles.flatlist}>
            {
              this.state.food.length?<FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.food}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() => {
                    SearchCuisineById(d).then(res=>{
                      if(!res){
                        Alert.alert("GRUB", "Right now there is no restaurant that make \""+d.text1+"\" in your area on our platform, \nbut we hope to change that soon");
                      }
                    });
                    // this.props.navigation.navigate("Combo");
                  }}
                  style={styles.horizontalFlatlist}
                >
                  <Image source={{ uri: d.image }} style={styles.image} />
                  <Text style={styles.foodText, {position: "absolute", top: 75, left: 17, color: "#fff", zIndex: 99}}>{d.text1}</Text>
                </TouchableOpacity>
              )}
            />:null
            }
            
            <TouchableOpacity
              style={{
                width: 70,
                alignSelf: "flex-end",
                // marginHorizontal: 10
              }}
              onPress={() => this.props.navigation.navigate("SearchScreen")}
            >
              <Text style={styles.seeText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.tredingText}>NEW ON GRUBHOUSE</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.newOnGrub}
            renderItem={({ item: d }) => (
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={()=>this.getMenu(d)}
                  style={styles.horizontalFlatlist}
                >
                  <Image source={{ uri: d.image }} style={styles.crispyImage} />
                  {/* krispy container */}
                  {d.offers?<Text style={styles.offerText}>{d.offers?d.offers[0]:""}</Text>:null}
                  
                  <View style={styles.krispyContainer}>
                    <Text style={styles.leftText}>{d.name}</Text>
                    <Text style={styles.rightText}>{d.delivery_time}</Text>
                  </View>

                  <View style={styles.krispyContainer}>
                    <Text style={styles.breakfastText}>{d.type}</Text>
                  </View>
                  {/* star icon container */}
                  <View style={styles.starConatiner}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={styles.amountText}>£{d.amount}</Text>{this.deliveryOptions(d.service)}
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Icon
                        name="map-marker"
                        color="#013220"
                        type="material-community"
                        size={24}
                        // iconStyle={styles.icon}
                      />
                      <Text style={styles.breakfastText}>{d.postCode}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* <Divider style={styles.divider1} /> */}
              </View>
            )}
          />
          <View>
            <Text style={styles.tredingText}>TRENDING NOW</Text>
          </View>
          {/* crispy food  flatlist */}
          <View style={styles.crispyFlatlist}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.trendingNow}
              renderItem={({ item: d }) => (
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={()=>this.getMenu(d)}
                    style={styles.horizontalFlatlist}
                  >
                    <Image
                      source={{ uri: d.image }}
                      style={styles.bottomImage}
                    />
                    {/* krispy container */}
                    {d.offers?<Text style={styles.offerText}>{d.offers?d.offers[0]:""}</Text>:null}
                    <View style={styles.krispyContainer}>
                      <Text style={styles.leftText}>{d.name}</Text>
                      <Text style={styles.rightText}>{d.delivery_time}</Text>
                    </View>

                    <View style={styles.krispyContainer}>
                      <Text style={styles.breakfastText}>{d.type}</Text>

                    </View>
                    {/* star icon container */}
                    <View style={styles.starConatiner}>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={styles.amountText}>£{d.amount}</Text>{this.deliveryOptions(d.service)}
                      </View>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Icon
                          name="map-marker"
                          color="#013220"
                          type="material-community"
                          size={24}
                          // iconStyle={styles.icon}
                        />
                        <Text style={styles.breakfastText}>{d.postCode}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* <Divider style={styles.divider1} /> */}
                </View>
              )}
            />
            {/* with in text container */}
            <View>
              <Text style={styles.tredingText}>THIS MONTHS FAVOURITE</Text>
            </View>
            <View style={styles.crispyFlatlist}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.monthFavourite}
                renderItem={({ item: d }) => (
                  <View style={styles.row}>
                    <TouchableOpacity
                      onPress={()=>this.getMenu(d)}
                      style={styles.horizontalFlatlist}
                    >
                      <Image
                        source={{ uri: d.image }}
                        style={styles.bottomImage}
                      />
                      {/* krispy container */}
                      {d.offers?<Text style={styles.offerText}>{d.offers?d.offers[0]:""}</Text>:null}
                      <View style={styles.krispyContainer}>
                        <Text style={styles.leftText}>{d.name}</Text>
                        <Text style={styles.rightText}>{d.delivery_time}</Text>
                      </View>
                      <View style={styles.krispyContainer}>
                        <Text style={styles.breakfastText}>{d.type}</Text>
                      </View>
                      <View style={styles.starConatiner}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={styles.amountText}>£{d.amount}</Text>{this.deliveryOptions(d.service)}
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Icon
                            name="map-marker"
                            color="#013220"
                            type="material-community"
                            size={24}
                            // iconStyle={styles.icon}
                          />
                          <Text style={styles.breakfastText}>{d.postCode}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {/* <Divider style={styles.divider1} /> */}
                  </View>
                )}
              />
            </View>
            <View>
              <Text style={styles.tredingText}>MORE RESTAURANTS</Text>
            </View>
            {/* more restorent container */}
            <View style={styles.crispyFlatlist}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.allRestor}
                renderItem={({ item: d }) => (
                  <View style={styles.row}>
                    <TouchableOpacity
                      onPress={()=>this.getMenu(d)}
                      style={styles.horizontalFlatlist}
                    >
                      <Image
                        source={{ uri: d.image }}
                        style={styles.bottomImage}
                      />
                      {/* krispy container */}
                      {d.offers?<Text style={styles.offerText}>{d.offers?d.offers[0]:""}</Text>:null}
                      <View style={styles.krispyContainer}>
                        <Text style={styles.leftText}>{d.name}</Text>
                        <Text style={styles.rightText}>{d.delivery_time}</Text>
                      </View>
                      <View style={styles.krispyContainer}>
                        <Text style={styles.breakfastText}>{d.type}</Text>
                      </View>
                      <View style={styles.starConatiner}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={styles.amountText}>£{d.amount}</Text>{this.deliveryOptions(d.service)}
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Icon
                            name="map-marker"
                            color="#013220"
                            type="material-community"
                            size={24}
                            // iconStyle={styles.icon}
                          />
                          <Text style={styles.breakfastText}>{d.postCode}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {/* <Divider style={styles.divider1} /> */}
                  </View>
                )}
              />
            </View>
          </View>
          {/* quick links container */}
          <View style={{ marginTop: 30 }}>
            <Text style={styles.tredingText}>Quick Link</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ComingScreen")}
              style={styles.orderContainer}
            >
              <Text style={styles.orderText}>Coming on the 28th of July</Text>
              <Icon
                name="chevron-right"
                color="#000"
                type="material-community"
                size={30}
                // iconStyle={styles.icon1}
              />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("GroupIntro")}
              style={styles.orderContainer}
            >
              <Text style={styles.orderText}>Group Ordering</Text>
              <Icon
                name="chevron-right"
                color="#000"
                type="material-community"
                size={30}
                // iconStyle={styles.icon1}
              />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("SendGift")}
              style={styles.orderContainer}
            >
              <Text style={styles.orderText}>Send Gift</Text>
              <Icon
                name="chevron-right"
                color="#000"
                type="material-community"
                size={30}
                // iconStyle={styles.icon1}
              />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Information")}
              style={styles.orderContainer}
            >
              <Text style={styles.orderText}>Customer Support</Text>
              <Icon
                name="chevron-right"
                color="#000"
                type="material-community"
                size={30}
                // iconStyle={styles.icon1}
              />
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  row: {
    position: "relative"
  },  
  offerText: {
    backgroundColor: global.COLOR.PRIMARY,
    color: "white",
    position: "absolute",
    top: 210,
    right: 0,
    padding: 4,
    borderRadius: 2
  },
  cardDescription:{
    fontSize: 13,
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
    
  },
  upperContainer: {
    flex: 0.4,
    // position: "relative",
    zIndex: 0
  },
  collectImage: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  takeImage: {
    height: 20,
    width: 26,
    resizeMode: "cover",
  },
  badgeImage: {
    height: 40,
    width: 40,
    resizeMode: "cover",
    alignSelf: "center",
  },
  inputText: {
    fontWeight: "bold",
    width: "90%",
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
  inputFiedContainer: {
    // borderWidth: 1,
    borderColor: "gray",
    width: "90%",
    marginTop:-5,
    borderBottomWidth: null,
    // marginTop: 5
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  imageContainer: {
    backgroundColor: "rgba(0, 0, 0,0.3)",
  },
  textContainer: {
    height: 310,
    // width: 400
    resizeMode: "stretch"
  },
  backgroundImage: {
    opacity: 1,
    zIndex: 0,
    position: "absolute"
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -50,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: global.CONSTANT.STATUSBAR + 20,
    marginHorizontal: "8%",
  },
  tableIcon: {
    height: 34,
    width: 34,
    resizeMode: "cover",
    marginRight: 4,
  },
  shoppingIcon: {
    height: 26,
    width: 26,
    resizeMode: "cover",
    marginTop: 4,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: global.COLOR.SECONDARYTEXT,
    textAlign: "center",
    // marginLeft: 48,
    marginTop: -12,
    // backgroundColor: "rgba(0, 0, 0,0.1)"
    // width: 150
    // marginTop: -30
  },
  morningContainer: { marginTop: "32%" },
  morningText: {
    // zIndex: 4,
    // position: "absolute",
    fontSize: 22,
    fontFamily: global.FONT.Simonetta_Regular,
    marginHorizontal: 10,
    color: global.COLOR.SECONDARYTEXT,
    // marginTop: 80
  },
  timeText: {
    fontSize: 30,
    marginHorizontal: 10,
    fontFamily: global.FONT.ITALIC,
    color: global.COLOR.SECONDARYTEXT,
    // zIndex: 9,
    // position: "absolute",
    // marginTop: 30
  },
  backSearchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "#fff",
    zIndex : 4,
    marginHorizontal: 10,
    height: 55,
    marginTop: -28,
    zIndex: 30,
  },
  neyYorkContainer: {
    backgroundColor: global.COLOR.PRIMARY,
    width: "30%",
    borderRadius: 10,
    marginRight: -10,
  },
  icon: {
    marginTop: 6,
    marginHorizontal: 5,
  },
  newyorkText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 3,
    textAlign: "center",
  },
  serachIcon: {
    // marginLeft: -10,
    width: "100%",
    zIndex: 9,
  },
  searchContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:0,
    marginLeft: -4,
    backgroundColor: "#fff",
    height: 55,
    marginRight: 4,
  },
  searchText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 14,
    color: "gray",
  },
  bottomContainer: {
    // flex: 0.98
  },
  horizontalFlatlist: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: "cover",
    marginHorizontal: 5,
    borderRadius: 6
  },
  foodText: {
    color: "gray",
    fontWeight: "normal",
    textAlign: "center",
  },
  flatlist: {
    height: 150,
    marginTop: 30,
    justifyContent: "center",
    // marginHorizontal: "3%"
    zIndex: -100
  },
  tredingText: {
    fontSize: 18,
    margin: 12,
    fontWeight: "bold",
  },
  crispyImage: {
    height: 260,
    width: 350,
    resizeMode: "cover",
    borderRadius: 20,
    // marginHorizontal: 12,
    justifyContent: "center",
    marginHorizontal: 4,
    // marginHorizontal: 12
    // marginLeft: 10
    // marginHorizontal: "5%"
  },
  crispyFlatlist: {
    width: null,
  },
  krispyContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 20,
  },
  leftText: {
    fontSize: 18,
    color: "gray",
  },
  rightText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  breakfastText: {
    fontSize: 12,
    color: "gray",
  },
  amountText: {
    color: "#3B5998",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10
  },
  titleText: {
    fontSize: 18,
    color: "gray",
    margin: 12,
  },
  seeText: {
    // alignSelf: "flex-end",
    fontSize: 13,
    fontWeight: "bold",
    // marginHorizontal: 10
  },
  slideImage: {
    // height: 300,
    // width: 390
  },
  overlay: {
    height: 300,
  },

  reviewText: {
    fontSize: 12,
    color: "gray",
    marginHorizontal: 5,
    marginTop: 4,
  },

  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: global.CONSTANT.STATUSBAR + 10,
    marginHorizontal: 16,
  },

  starConatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center"
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 30,
  },
  orderText: {
    fontSize: 18,
    // fontWeight: "bold"
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  divider1: {
    height: 1,
    marginVertical: 10,
  },
  bottomImage: {
    height: 260,
    width: 350,
    resizeMode: "cover",
    borderRadius: 20,
    // marginHorizontal: 12,
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 4,
    // marginHorizontal: 8
  },
});
