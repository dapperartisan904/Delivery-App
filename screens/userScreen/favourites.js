import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, Image, ImageBackground, TouchableOpacity} from "react-native";
import { Icon } from "react-native-elements";
import global from "../../global";
import { gerMerchantMenu } from "../../utils/Api";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';

export default class notifications extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name=="Your Favorite"?navigation.state.params.name:navigation.state.params.name+"'s Favorite",
      headerStyle: {
        backgroundColor: "#fff"
      },
  
      headerTintColor: "#000",
  
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      deliveryOption : this.props.navigation.state.params.data.services
    };
  }

  componentDidMount(){
    this._getLocationAsync()
    var ordarr = []
    this.props.navigation.state.params.data.data.map(ordelement =>{
      ordarr.push({
        id : ordelement.merchant_id,
        image : ordelement.logo != "" ? "https://www.grubhouse.co.uk/upload/"+ordelement.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
        name: ordelement.restaurant_name,
        review: ordelement.ratings==null? "0":(ordelement.ratings*1).toFixed(2),
        delivery_time:ordelement.delivery_estimation==""?"15~25min":ordelement.delivery_estimation,
        type:"Breakfast and Brunch",
        amount: (ordelement.delivery_charges*1).toFixed(2),
        address: ordelement.street,
        price_level: ordelement.percent_commision,
        distance: 0 ,
        open_time: "5:00am",
        close_time: "10:00pm",
        service: ordelement.service,
        slug: ordelement.restaurant_slug,
        rating: {
          ratings: ordelement.rating.ratings,
          votes: ordelement.rating.votes
        }
      });
      
    });
    this.setState({
      data: ordarr
    });
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
          size={20}
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
          size={20}
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
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          style={{marginLeft: 0, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
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
          lat: location.coords.latitude,
          lng: location.coords.longitude,
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
                lat: position.coords.latitude,
                lng: position.coords.longitude,
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
  getMenu = (rest)=>{
    // console.log(rest, "my favorite merchant")
    // console.log(rest)
    gerMerchantMenu(rest.id).then((response)=>{
      this.props.navigation.navigate("DetailsScreen", {
        merchant: rest,
        data: response.details
      })
    })
  }
  render() {
    return (
      <View style={styles.bgContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item: d }) => (
            <View 
              style={styles.horizontalFlatlist}
              
            >
              <TouchableOpacity 
                style={{width: 140}}
                onPress={()=>this.getMenu(d)}
              >
                <ImageBackground
                  source={{ uri: d.image}} style={styles.crispyImage} />
              </TouchableOpacity>
              {/* krispy container */}
              <View style={styles.krispyContainer}>
                <Text 
                  style={styles.leftText}
                  numberOfLines={1}
                >{d.name}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalFlatlist : {
    flexDirection:  "row",
    alignItems: "flex-start",
    flex:1,
    borderRadius: 5,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 1.2,
    shadowRadius: 3.30,
    elevation: 3,
    margin: 5,
    
  },
  starConatiner:{
    flexDirection: "row",
    marginLeft: 15
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  crispyImage: {
    height: 130,
    width: 130,
    // width: 360,
    resizeMode: "cover",
    borderRadius: 10,
    overflow: "hidden",
    // marginHorizontal: 12,
    justifyContent: "center",
    marginHorizontal: 12,
    marginTop: 10
    // marginLeft: 10
    // marginHorizontal: "5%"
  },
  krispyContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 20,
    flex: 1,
    paddingTop: 20,
  },
  leftText: {
    fontSize: 18,
    width: "100%"
  },
  rightText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5
  },
  breakfastText: {
    fontSize: 12,
    color: "gray"
  },
  amountText: {
    color: global.COLOR.PRIMARY,
    fontSize: 12,
    fontWeight: "bold"
  }
});
