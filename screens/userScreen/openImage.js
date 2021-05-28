import React, { Component } from "react";
import { Text, StyleSheet, View, Image, ImageBackground } from "react-native";
import global from "../../global";
import { Icon, Avatar, Tooltip } from "react-native-elements";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { toggleFClike, goDetailById, gerMerchantMenu, removeFoodCourt } from "../../utils/Api"
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';
// import Video from 'react-native-af-video-player'
import parse from "../../utils/parse";
import stringify from "../../utils/stringify";
import { Video } from 'expo-av';

export default class openImage extends Component {
  static navigationOptions = {
    title: "Food Court",
    headerStyle: {
      backgroundColor: "#fff",
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      liked: false
    };
  }
  componentDidMount(){
    this._getLocationAsync()
    this.setState({like: this.props.navigation.state.params.data.like}, ()=>{this.getHeart()})
    
  }
  toggleLike=(id)=>{
    toggleFClike(id).then(res=>{
      // console.log(res)
      this.setState({like: res.details.like})
      this.getHeart()
    })
  }
  goDetail=(id)=>{
    goDetailById(id).then(rest=>{
      var merchant = {
        id : rest.merchant_id,
        image : rest.logo != "" ? "https://www.grubhouse.co.uk/upload/"+rest.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
        name: rest.restaurant_name,
        address: rest.street,
        amount: (rest.delivery_charges*1).toFixed(2),
        review: rest.ratings==null? "0":Number(rest.ratings).toFixed(2),
        delivery_time:rest.delivery_estimation==""?"15~25min":rest.delivery_estimation,
        type:"Breakfast and Brunch",
        amount: (rest.delivery_charges*1).toFixed(2),
        distance:this.getDistance(rest.latitude, rest.lontitude),
        open_time: "5:00am",
        close_time: "10:00pm",
        service: rest.service,
        rating: {
          ratings: rest.ratings,
          votes: 0
        },
      }
      // console.log(merchant)
      gerMerchantMenu(id).then((response)=>{
   
        this.props.navigation.navigate("DetailsScreen", {
          merchant: merchant,
          data: response.details
        })
      })
    })
    
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

  rad = (x) => {
      return x * Math.PI / 180;
  };
  getDistance=(lat,lng)=>{
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(lat - this.state.lat);
    var dLong = this.rad(lng - this.state.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(lat)) * Math.cos(this.rad(lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return (d/1000).toFixed(1)+"km"; // returns the distance in meter
  }
  deleteFCourt = (d)=> {
    // console.log(d)
    if(d.client_id == global.USER.details.client_info.client_id) {
      removeFoodCourt(d.id).then((res)=>{
        if (res.details.length > 0) {
          this.props.navigation.navigate("Food")
        }
      })
    } else {
      alert("You can't remove this!")
    }
  }
  getHeart=()=>{
    var favorite = this.state.like
    var flag = false
    // console.log(favorite, "favorite")
    if(favorite)
    favorite.map((fv, index)=>{
      if(fv.client_id == global.USER.details.client_info.client_id){
        flag = true
      }
    })
    // console.log("it is changed", flag)
    this.setState({liked: flag})
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            marginLeft: 10,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View 
          style={{
            flexDirection: "row",
            marginVertical: 5,
            marginLeft: 10,
            alignItems: "center",
            justifyContent: "flex-start"
            
          }}>
            <TouchableOpacity>
              <Avatar
                source={{ uri: "https://www.grubhouse.co.uk/upload/"+this.props.navigation.state.params.data.user[0].avatar }}
                size="small"
                rounded
                onPress= {()=>{
                    if(this.props.navigation.state.params.data.user[0].clt_id == global.USER.details.client_info.client_id){
                      this.props.navigation.navigate("Profile")
                    } else {
                      // console.log(this.props.navigationstate.params.data.user[0], "usre Info")
                      this.props.navigation.navigate("FProfile", {
                        client: this.props.navigation.state.params.data.user[0],
                      reload: ()=>{},
                      setData: ()=>{}
                      })
                    }
                  }
                }
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ margingLeft: 10 }}
              onPress= {()=>{
                  if(this.props.navigation.state.params.data.user[0].clt_id == global.USER.details.client_info.client_id){
                    this.props.navigation.navigate("Profile")
                  } else {
                    // console.log(this.props.navigation.state.params.data.user[0])
                    this.props.navigation.navigate("FProfile", {
                      client: this.props.navigation.state.params.data.user[0],
                      reload: ()=>{},
                      setData: ()=>{}
                    })
                  }
                }
              }
              >
              <Text style={styles.username}>{this.props.navigation.state.params.data.user[0].first_name}</Text>
              {
                this.props.navigation.state.params.data.content[0].rating!=0?
                <View
                  onPress={() => this.props.navigation.navigate("Like")}
                  style={styles.likes}
                >
                  <View>
                    <Text>
                      {this.props.navigation.state.params.data.user[0].first_name}&nbsp;rates&nbsp;dish &nbsp; 
                    </Text>
                  </View>
                  <View>
                    
                    <Icon
                      name="star-outline"
                      color="#F56466"
                      type="material-community"
                      size={20}
                      iconStyle={styles.starIcon}
                      Component={TouchableOpacity}
                    />
                    </View>
                    <View>
                      <Text style={styles.likeText}>{this.props.navigation.state.params.data.content[0].rating}</Text>
                    </View>
                  
                </View>:null
            }
            </TouchableOpacity>
          </View>
          {
            
            this.props.navigation.state.params.data.user[0].clt_id == global.USER.details.client_info.client_id?<View
                style={{marginRight: 20}}
              >
              <Tooltip
                // backgroundColor={"rgba(0, 0, 0, 0)"}
                ref={(ref) => {this.toolTip = ref}}
                
                popover={
                <Text
                style={{width: "100%", textAlign: "center"}}
                onPress={()=>{
                  this.deleteFCourt(this.props.navigation.state.params.data.content[0])
                  this.toolTip.toggleTooltip(false)
                }}
                >Remove
                </Text>}>
                <Icon
                  name="dots-horizontal"
                  // reverse
                  color="#000"
                  type="material-community"
                  size={20}
                  iconStyle={{
                    backgroundColor: "white",
                    borderRadius: 20
                  }}
                  />
              </Tooltip>
              </View>:null
          }
          
        </View>
          
        <View style={{borderRadius: 5, padding: 5, position: "relative"}}>
            {this.props.navigation.state.params.data.content[0].file_type =="video"?<Video
                                        source={{ uri: "https://www.grubhouse.co.uk/upload/" + this.props.navigation.state.params.data.content[0].image }}
                                        rate={1.0}
                                        volume={1.0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={styles.image}
                                      />:<Image source={{ uri: "https://www.grubhouse.co.uk/upload/" + this.props.navigation.state.params.data.content[0].image }} style={styles.image} />}
          {/* <Image source={{uri: "https://www.grubhouse.co.uk/upload/"+this.props.navigation.state.params.data.content[0].image}} style={styles.image}></Image> */}
          <View style={{position: "absolute", bottom: 8, left: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
            <View style={styles.iconContainer}>
              <Icon
                name={this.state.liked?"heart":"heart-outline"}
                color="#F56466"
                type="material-community"
                size={30}
                iconStyle={styles.icon}
                Component={TouchableOpacity}
                onPress={()=>{this.toggleLike(this.props.navigation.state.params.data.content[0].id)}}
              />
              <View style={{alignItems: "center", marginLeft:-5, marginRight: 5}}>
                <Text style={styles.likeText}>{this.state.like?this.state.like.length:0}</Text>
              </View>
              <Icon
                name="comment-processing-outline"
                color={global.COLOR.PRIMARY}
                type="material-community"
                size={30}
                iconStyle={{marginRight: 5}}
                Component={TouchableOpacity}
                onPress={()=>{this.props.navigation.navigate("AddComment", {
                  fc_id: this.props.navigation.state.params.data.content[0].id,
                  image: this.props.navigation.state.params.data.content[0].image,
                })}}
              />
              {
                this.props.navigation.state.params.data.content[0].merchant_id>0?<TouchableOpacity
                onPress={()=>{this.goDetail(this.props.navigation.state.params.data.content[0].merchant_id)}}>
                  <Image source={global.ASSETS.CHEF} style={styles.chefIcon} 
                    // onPress={this.props.navigation.navigate("")}
                    
                  />
                </TouchableOpacity>:null
              }
              
            </View>
            <View style={{flexDirection: "row"}}>

            </View>
          </View>
        </View>
        <View 
        >
          <Text style={styles.descText}>
            {
              parse(this.props.navigation.state.params.data.content[0].description)
            }
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },
  image: {
    height: 450,
    width: "100%",
    resizeMode: "contain",
    // borderRadius: 5,
    padding: 3
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    backgroundColor:"rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowOpacity: 0.39,
    shadowRadius: 1.30,
    elevation: 5,
    alignItems: "center"
    // marginTop: -50
  },
  icon: {
    marginRight: 10,
  },
  likes:{
    flexDirection: "row", 
    alignItems:"center", 
    justifyContent: "flex-end", 
    paddingLeft: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
  },
  likeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray"
  },
  descText: {
    fontSize: 16,
    // fontWeight: "bold",
    marginHorizontal: 12,
    marginTop: 5,
    borderRadius: 8,
    borderColor: "#1A73E8",
    // borderWidth: 1,
    padding: 7,
    height: 100,
    // borderStyle: "dotted"
  },
  chefIcon: {
    height: 32,
    width: 36,
    resizeMode: "cover",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
    // marginTop: 5,
  },
  location: {
    fontSize: 14,
    // fontWeight: "bold",
    marginHorizontal: 15,
    // marginTop: 5,
  },
});
