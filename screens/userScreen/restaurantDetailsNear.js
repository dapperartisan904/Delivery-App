import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import combo from "../../assets/combo.png";
import { FlatGrid } from "react-native-super-grid";
import { Icon } from "react-native-elements";
import global from "../../global";
import { Divider } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Counter from "react-native-counters";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { getFCourtDetailMoreInfoN } from "../../utils/Api";
import { Video } from 'expo-av';
import { Rating, AirbnbRating } from 'react-native-ratings';

export default class detailsScreenNear extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.restaurant.restauran_name,
    headerStyle: {
      backgroundColor: "#fff",
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
    },
  });
  constructor(props) {
    super(props);
    this.mapRef = ""
    this.myLatLongs = []
    this.myLatLongs.push(
      this.props.navigation.state.params.userPosition
    )
    this.myLatLongs.push({
      latitude: Number(this.props.navigation.state.params.restaurant.latitude?this.props.navigation.state.params.restaurant.latitude:0),
      longitude: Number(this.props.navigation.state.params.restaurant.lontitude?this.props.navigation.state.params.restaurant.lontitude:0),
    })
    

    this.state = {
      restaurant: this.props.navigation.state.params.restaurant,
      userPosition: this.props.navigation.state.params.userPosition,
      dateIndex: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
      index: 0,
      warningCol: false,
      openCol: true
    };
    // console.log(this.state.restaurant)
  }
  phoneSecurity = ()=>{
    // phoneSecurity
    var phone = ''
    if(this.state.restaurant.contact_phone.length >5 ){
      var numbers = this.state.restaurant.contact_phone.split("/")
      // console.log(numbers.length, "numner of phones", this.state.restaurant.contact_phone)
      numbers.map((num, index)=>{
        phone += "∗∗∗∗∗"+num.substring(4, num.length);
        if(numbers.length != index+1){
          phone +="/"
        }
      })
    } else {
      phone = this.state.restaurant.contact_phone
    }

    return phone
  }
  closeMsg(){
    if(this.state.restaurant.close_store){
      return <View style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20}}><Text style={{fontSize: 18}}>{this.state.restaurant.close_msg}</Text></View>
    } else {
      var date = new Date()
      var cTime = date.getHours()
      var cDay = date.getDay()
      var openTime = this.state.restaurant.stores_open_starts[this.state.dateIndex[cDay]].split(":")[0]
      var closeTime = this.state.restaurant.stores_open_ends[this.state.dateIndex[cDay]].split(":")[0]
      if(cTime < openTime || cTime > closeTime){
        return <View style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20}}><Text style={{fontSize: 18}}>{this.state.restaurant.close_msg}</Text></View>
      }
    }

  }
  render() {
    // console.log(this.props.navigation.state.params.userPosition, "user Position +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", width: "100%" }}>
        <ScrollView>
        <View style={styles.mapViewContainer}>
          <MapView
            ref={(ref)=>{this.mapRef = ref}}
            showsMyLocationButton
            style={{ flex: 1, width: global.CONSTANT.WIDTH }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: Number(this.state.restaurant.latitude?this.state.restaurant.latitude:0),
              longitude: Number(this.state.restaurant.lontitude?this.state.restaurant.lontitude:0),
              latitudeDelta: 0.3022,
              longitudeDelta: 0.0021,
            }}
            onLayout = {() =>{ 
              this.mapRef.fitToCoordinates(this.myLatLongs, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: true })}}
          >
            <Marker
              coordinate={this.state.userPosition}
              Component={TouchableOpacity}
              anchor={{ x: 0.5, y: 0.9 }}
            >
              <Icon
                name="record-circle"
                type="material-community"
                size={24}
                color="blue"
                style={styles.mapMarker}
              />
            </Marker>
            <Marker
              coordinate={{
                latitude: Number(this.state.restaurant.latitude?this.state.restaurant.latitude:0),
                longitude: Number(this.state.restaurant.lontitude?this.state.restaurant.lontitude:0),
              }}
              Component={TouchableOpacity}
              anchor={{ x: 0.5, y: 0.9 }}
            >
              <View style={{backgroundColor: "black", borderRadius: 8, flexDirection: "row", justifyContent:"center", alignItems: "center", padding:2}}>
                <Icon
                  name="silverware-fork-knife"
                  type="material-community"
                  size={24}
                  color="white"
                  style={styles.mapMarker}
                />
                <Text style={{color: "white"}}>{this.state.restaurant.restaurant_name}</Text>
              </View>
              
            </Marker>
            <MapViewDirections 
              apikey={Platform.OS==="ios"?"AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0":"AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"}
              destination={{ latitude: Number(this.state.restaurant.latitude?this.state.restaurant.latitude:0), longitude: Number(this.state.restaurant.lontitude?this.state.restaurant.lontitude:0) }} 
              strokeWidth={5}
              strokeColor="black"
              origin={{
                latitude: this.state.userPosition.latitude,
                longitude: this.state.userPosition.longitude
              }} 
            />
          </MapView>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={styles.title}>Restaurants Note</Text>
        </View>
        {
          this.closeMsg()
        }
        <View style={{marginLeft: 20}}>
          <Text style={styles.title}>Info</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: "10%", margin: 10, borderColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <Icon
              name="phone"
              color="gray"
              type="material-community"
              size={24}
              // iconStyle={styles.icon}
            />
          </View>
          <View style={{width: "90%", textAlignVertical: "center", padding: 10, height: "100%"}}>
            <Text style={{height: "100%", textAlignVertical: 'center'}}>{this.phoneSecurity()}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: "10%", margin: 10, borderColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <Icon
                name="map-marker-outline"
                color="gray"
                type="material-community"
                size={24}
                // iconStyle={styles.icon}
              />
          </View>
          <View style={{width: "90%", textAlignVertical: "center", padding: 10, height: "100%"}}>
            <Text style={{height: "100%", textAlignVertical: 'center'}}>{this.state.restaurant.complete_address}</Text>
          </View>
        </View>
        <View style={styles.divider}/>
        <Collapse
          isCollapsed={this.state.openCol} 
          onToggle={()=>{
            this.setState({openCol: !this.state.openCol})
          }}
        >
          <CollapseHeader>
            <View style={styles.warningContainer}>
              <Text style={styles.warning}>{this.state.restaurant.restaurant_name} opening and closing time:</Text>
              <Icon
                name={this.state.openCol?"chevron-down":"chevron-right"}
                color="gray"
                type="material-community"
                size={24}
                // iconStyle={styles.icon}
              />
            </View>
          </CollapseHeader>
          <CollapseBody style={{paddingHorizontal : 20}}>
            {
              this.state.dateIndex.map((di, index)=>{

                // if(typeof this.state.restaurant.stores_open_custom_text[di]!="undefined" && this.state.restaurant.stores_open_starts[di]!=""){
                  // this.setState({index: this.state.index++})
                  // i++
                  return <View style={styles.rowContainer}>
                          <View style={{width: "10%", margin: 10, borderColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <Icon
                                name="clock-outline"
                                color="gray"
                                type="material-community"
                                size={24}
                                // iconStyle={styles.icon}
                              />
                          </View>
                          <View style={{width: "90%", textAlignVertical: "center", padding: 10, height: "100%",}}>
                            <View style={styles.rowContainer, { flexDirection: "column"}}>
                              <Text>{di.toUpperCase()}</Text>
                              <Text style={{color: "gray"}}>{this.state.restaurant.stores_open_starts[di]}-{this.state.restaurant.stores_open_ends[di]}</Text>
                            </View>
                          </View>
                        </View>
                      
                // }
              })
                
          }
          </CollapseBody>
        </Collapse>
        
        <View style={styles.divider}/>
        <Collapse
          onToggle={()=>{
            this.setState({warningCol: !this.state.warningCol})
          }}
        >
          <CollapseHeader>
            <View style={styles.warningContainer}>
              <Text style={styles.warning}>Allergic to anything in the food you desire? Find out what ingredients are being used.</Text>
              <Icon
                name={this.state.warningCol?"chevron-down":"chevron-right"}
                color="gray"
                type="material-community"
                size={24}
                // iconStyle={styles.icon}
              />
            </View>
          </CollapseHeader>
          <CollapseBody style={{paddingHorizontal : 20}}>
            {
              this.state.restaurant.ingredients?this.state.restaurant.ingredients.map((item, index)=>{
              return<View style={styles.rowContainer}>
                      <View style={{width: "10%", margin: 10, borderColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <Icon
                            name="alert-octagon-outline"
                            color="gray"
                            type="material-community"
                            size={24}
                            // iconStyle={styles.icon}
                          />
                      </View>
                      <View style={{width: "90%", textAlignVertical: "center", padding: 10, height: "100%",}}>
                        <View style={styles.rowContainer, { flexDirection: "row", alignItems: "center", height: "100%"}}>
                          <Text style={{color: "gray"}}>{item.ingredients_name}</Text>
                        </View>
                      </View>
                    </View>
              }):null
            }
          </CollapseBody>
        </Collapse>
        <View style={styles.divider}/>
        <View style={styles.warningContainer}>
          <Text style={styles.warning}>Ratings</Text>
          <Rating
            type='star'
            ratingColor='#3498db'
            ratingBackgroundColor='#c8c7c8'
            ratingCount={5}
            startingValue={Number(this.state.restaurant.rating.ratings)}
            isDisabled={true}
            imageSize={20}
            style={{ paddingVertical: 10 }}
          />
        </View>
        
        <View>
        <View
          style={{ marginHorizontal: -6, marginTop: -9, marginBottom: -14 }}
        >
          <FlatGrid
            itemDimension={global.CONSTANT.WIDTH / 3 - 30}
            items={this.state.restaurant?.food_court}
            renderItem={({ item }) => (
              <View style={{position: "relative"}}
              >
                <TouchableOpacity
                  onPress={()=>{getFCourtDetailMoreInfoN(item.id)}}
                >
                  {/* <Thumbnail url={"https://www.grubhouse.co.uk/upload/" + item.image } /> */}
                  
                  {item.file_type =="video"?<Video
                        source={{ uri:  "https://www.grubhouse.co.uk/upload/" + item.image}}
                        rate={1.0}
                        volume={0.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={styles.image2} 
                    />:<Image source={{ uri:  "https://www.grubhouse.co.uk/upload/" + item.image}} style={styles.image2} />}
                </TouchableOpacity>
            </View>
            )}
          />
        </View>
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  warningContainer: { 
    marginLeft: 20, 
    marginVertical: 15, 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    width: "88%"
  },
  warning: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    width: "90%"
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "black",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 6,
    borderColor: "gray",
    borderBottomWidth: 1
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    textAlignVertical: "center",
    paddingRight: 15,
    marginLeft: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },  
  mapViewContainer: {
    width: "100%",
    height: 280,
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 350,
  },
  image: {
    borderRadius: 40,
    resizeMode: "cover",
  },
  icon: {
    color: "#000",
    // height:
  },
  iconContainer: {
    marginTop: global.CONSTANT.STATUSBAR + 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  heartIcon: {
    color: "red",
  },
  cardContainer: {
    backgroundColor: "#fff",
    height: 180,
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: -104,
  },
  almiraText: {
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 15,
    marginTop: 10,
  },
  addressText: {
    fontSize: 10,
    // fontWeight: "normal",
    marginHorizontal: 15,
    color: "gray",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 4,
  },
  typeRating: {
    fontSize: 14,
    color: "gray",
    margin: 4,
  },
  drinkText: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 12,
    marginTop: 25,
  },
  images: {
    height: 160,
    width: 320,
    marginHorizontal: 8,
    marginBottom: 5,
    borderRadius: 20,
    resizeMode: "cover",
  },
  missText: {
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 10,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "normal",
    marginHorizontal: 10,
    color: "gray",
  },
  amountText: {
    fontSize: 18,
    color: "gray",
    marginHorizontal: 10,
    marginTop: -20,
  },
  divider: {
    height: 0.5,
    width: 400,
    backgroundColor: "gray",
    alignSelf: "center",
    marginTop: 6,
  },
  popularText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  burger: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    color: "gray",
  },
  tortaText: {
    fontWeight: "700",
    fontSize: 18,
    // color: "gray"
  },
  grilledText: {
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
    marginHorizontal: 14,
    marginBottom: 10,
  },
  drinkText: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 12,
  },

  appleText: {
    fontSize: 20,
    marginHorizontal: 24,
    color: "gray",
  },
  divider2: {
    height: 0.5,
    width: 400,
    backgroundColor: "gray",
    alignSelf: "center",
    marginTop: 50,
  },
  payment: {
    fontSize: 20,
    fontWeight: "normal",
    marginHorizontal: 20,
    color: "gray",
  },
  moreText: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 12,
    // marginVertical: 30
  },
  images: {
    height: 140,
    width: 180,
    marginHorizontal: 8,
    borderRadius: 6,
    resizeMode: "cover",
  },
  pizzaText: {
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 5,
    // margin: 12
  },
  typeText: {
    fontSize: 20,
    fontWeight: "normal",
    marginHorizontal: 8,
    color: "gray",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 6,
  },

  notesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 5,
    marginVertical: 20,
  },
  restaurantText: {
    fontSize: 18,
    color: global.COLOR.PRIMARY,
  },
  image2: {
    height: 124,
    width: global.CONSTANT.WIDTH / 3 - 3,
    resizeMode: "cover",
    marginVertical: -4.5
  },
  bottomContainer: {
    flex: 0.1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginTop: 10
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
    // justifyContent: "center",
  },
  cartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});
