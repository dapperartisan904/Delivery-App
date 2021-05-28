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
  TouchableHighlight
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import * as Permissions from "expo-permissions";
import { Icon, Divider } from "react-native-elements";
import Geocoder from 'react-native-geocoding';
import global from "../../global";
const BASE_URL = "https://www.grubhouse.co.uk/upload/";
const { width, height } = Dimensions.get("window");
import { gerMerchantMenu } from "../../utils/Api";

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class restaurantMapView extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    // this.getLocation()
    this.state = {
      animation: new Animated.Value(0),
      restoList: [],
      map:'',
      latitude: global.LOCATION.latitude,
      longitude: global.LOCATION.longitude,
    };
  }

  getLocation =async()=>{
    if(Platform.OS === "ios"){
      geolocation.requestAuthorization()
   }else{
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }
   }
    const GET_LOCATION_OPTIONS = {
       enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
        },
        (err) => {
          // console.log(err);
        },
        GET_LOCATION_OPTIONS,
      );
  }
  componentDidMount(){
    this.setState({restoList: this.props.navigation.state.params.restList,
                    cuisine: this.props.navigation.state.params.cuisine})
    // console.log("restaurantMapview", this.props.navigation.state.params.restList)
    // console.log("adfasdf", this.props.navigation.state.params.cuisine)
    this.animation = new Animated.Value(0);
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value/ (width-15) + 0.3);
      if (index >= this.state.restoList.length) {
        index = this.state.restoList.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      const  coordinate  = this.state.restoList[index];
      this.state.map.animateToRegion(
        {
          latitude: Number(coordinate.latitude),
          longitude: Number(coordinate.lontitude),
          latitudeDelta: 0.5022,
          longitudeDelta: 0.0021,
        })
    })
  }

  starRating=(rating)=>{
    var temp = []
    for(var i=1; i < 6; i++){
      temp.push(<Icon
              name="star"
              type="material-community"
              size={20}
              color={i<=rating?"yellow":"grey"}
            />)
    }
    return temp
  }
  _getLocationAsync = async () => {
    if (Platform.OS === "ios") {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });
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
    return (d/1000/1.85).toFixed(1)+"miles"; // returns the distance in meter
  }

  deliveryOptions=(serviceType)=>{		
    switch (serviceType) {
      case "2":
        return <View 
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
    var merchant = {
      id: rest.merchant_id,
      name: rest.restaurant_name,
      image: rest.logo?BASE_URL+rest.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
      address: rest.street+", "+rest.city+", "+rest.state,
      rating: rest.rating,
      service: rest.service,
      slug: rest.restaurant_slug,
      delivery_time:rest.delivery_estimation,
      amount: (rest.delivery_charges*1).toFixed(2),
    }
    // console.log(merchant)
    gerMerchantMenu(rest.merchant_id).then((response)=>{
      this.props.navigation.navigate("DetailsScreen", {
        merchant: merchant,
        data: response.details
      })
    })
  }

  render() {
    const interpolations = this.state.restoList.map((marker, index) => {
      const inputRange = [
        (index - 1) * (width -20),
        index * (width-20),
        ((index + 1) * (width-20)),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: ["rgba(0, 255, 0, 1)", "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)"],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
    
    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.state.map = map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: this.state.restoList[0]?Number(this.state.restoList[0].latitude):0,
            longitude: this.state.restoList[0]?Number(this.state.restoList[0].lontitude):0,
            latitudeDelta: 0.5022,
            longitudeDelta: 0.0021,
          }}
          style={styles.container}
        >
          {this.state.restoList.length?this.state.restoList.map((rest, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            // const opacityStyle = {
            //   opacity: interpolations[index].opacity,
            // };
            const backColorStyle = {
              backgroundColor: interpolations[index].opacity,
            };
            // console.log("scalie", scaleStyle)
            return (
              <MapView.Marker key={index} coordinate={{
                latitude: Number(rest.latitude),
                longitude: Number(rest.lontitude)
              }}>
                <Animated.View style={[styles.markerWrap]}>
                  <Animated.View style={[styles.ring, backColorStyle]} />
                    <Text style={{color: "#fff", position: "absolute", top: 2, }}>{index+1}</Text>
                    {/* <Animated.View style={{width: 10, height: 10, borderRadius: 10, padding: 2}, backColorStyle}/> */}
                    {/* <Image source={global.ASSETS.MAP_MARKER} /> */}
                </Animated.View>
              </MapView.Marker>
            );
          }):null}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ])}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          
          {this.state.restoList.map((rest, index) => (
            <TouchableOpacity 
              style={styles.card} 
              key={index}
              onPress={()=>{
                this.getMenu(rest)
              }}
            >
              <View style={styles.cardBody}>
                <TouchableOpacity style={styles.cardImageContainer}
                  onPress={()=>{
                    this.getMenu(rest)
                  }}
                  >
                  <Image
                    source={{uri:rest.logo?BASE_URL+rest.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg" }}
                    // uri: BASE_URL+rest.image
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View style={styles.content}>
                  <View style={styles.textContent}>
                    <View style={styles.lineContainer}>
                      <Text numberOfLines={1} style={styles.cardtitle}>{rest.restaurant_name}</Text>
                    </View>
                    <View style={styles.rating}>
                      { this.starRating(rest.rating) }
                        
                      <Text numberOfLines={1} style={styles.cardDescription}>{rest.time}</Text>
                    </View>
                    <View style={styles.lineContainer}>
                      <Text numberOfLines={1} style={styles.cardDescription}>Delivery Time:</Text>
                      <Text numberOfLines={1} style={styles.cardDescription}>{rest.delivery_estimation}</Text>
                    </View>
                    <View style={styles.lineContainer}>
                      <Text numberOfLines={1} style={styles.cardDescription}>Delivery Price:</Text>
                      <Text numberOfLines={1} style={styles.cardDescription}>{Number(rest.delivery_charges).toFixed(2)}</Text>
                    </View>
                    <View style={styles.lineContainer}>
                      <Text numberOfLines={1} style={styles.cardDescription}>Distance From You:</Text>
                      <Text numberOfLines={1} style={styles.cardDescription}>{rest.distance}</Text>
                    </View>
                    <View style={styles.lineContainer}>
                      <Text numberOfLines={1} style={styles.cardDescription}>Address:</Text>
                      <Text numberOfLines={1} style={styles.cardDescription}>{rest.street+", "+rest.city+", "+rest.state}</Text>
                    </View>
                      <Text numberOfLines={1} style={styles.cardDescription}>
                        {rest.food_type}
                      </Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                {this.deliveryOptions(rest.service)}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  foodText: {
    color: "gray",
    fontWeight: "normal",
    textAlign: "center",
    fontSize: 10
  },
  image: {
    height: 60,
    width: 60,
    resizeMode: "cover",
    marginHorizontal: 5,
    borderRadius: 6
  },
  horizontalFlatlist: {
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative"
  },
  flatlist: {
    height: 150,
    marginTop: 30,
    justifyContent: "center",
    // marginHorizontal: "3%"
  },
  rating: {
    flexDirection: "row"
  },
  lineContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content:{
    flex: 7,
    padding: 7
  },
  cardImageContainer:{
    flex: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 18,
    borderRadius: 6,
    resizeMode: "cover",
    width: "100%",
    height: "100%"
  },
  cardBody: {
    flex: 9,
    flexDirection: "row"
  },
  cardFooter:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - 15,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 1, y: -1 },
    height: 180,
    width: width-20,
    overflow: "hidden",
    flex:1,
    flexDirection: "column"
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "bold",
    marginBottom: 7
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    // backgroundColor: "rgba(130,4,150, 0.3)",
    // position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
  },
});