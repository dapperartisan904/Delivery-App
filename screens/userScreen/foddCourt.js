import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";
// import global.ASSETS.BURGER from "../assets/global.ASSETS.BURGER.png";
import ImageOverlay from "react-native-image-overlay";
import global from "../../global";
import { getSponsoredMerchant, getFoodCourt, getFCourtDetail } from "../../utils/Api";
import { Icon, Input,Avatar, Tooltip } from "react-native-elements";
import { Card } from 'react-native-shadow-cards';
import one from "../../assets/one.png";
import * as Animatable from "react-native-animatable";
import noodles from "../../assets/noodles.png";
import pizza from "../../assets/pizza.png";
import two from "../../assets/two.png";
import three from "../../assets/three.png";
import four from "../../assets/four.png";
import five from "../../assets/five.png";
import { Thumbnail } from 'react-native-thumbnail-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { getOfferDetail, getSponsoredImage, gerMerchantMenu, removeFoodCourt } from  "../../utils/Api"
import { Video } from 'expo-av';
import ReactNativeTooltipMenu from 'react-native-tooltip-menu';

const BASE_URL = "https://www.grubhouse.co.uk/upload/";

const DATA = [
  {
    image: "https://i.ibb.co/g6NMfRw/IMG-4624.jpg"
  },
  {
    image: "https://i.ibb.co/2hNSnKb/IMG-4628.jpg"
  },
  {
    image: "https://i.ibb.co/ysB54ZY/IMG-4439.jpg"
  },
  {
    image: "https://i.ibb.co/XWWfn3q/IMG-4441.jpg"
  },
  {
    image:
      "https://i.ibb.co/Jn8wpj2/F7-B784-F9-776-D-4-C4-C-AE41-92-C1-AE124649.jpg"
  },
  {
    image: "https://i.ibb.co/BKBCvkZ/IMG-4446.jpg"
  }
];
export default class foddCourt extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    // console.log("food court")
    this.toolTip = []
    this.state = {
      data: DATA,
      sponsoredMerchant: [],
      foodCourt: [],
      filteredFoodCourt: [],
      promotion_image: "",
      dropdownView: false,
      filterType: 'merchant',
      users: []
    }; 
  }
  componentDidMount() {
    getSponsoredMerchant().then(res => {
      this.setState({ sponsoredMerchant: res.details })
    })
    getSponsoredImage().then(res => {
      this.setState({promotion_image: res.details[0].image})
    })
    getFoodCourt().then(res => {
      if (res.details.food_court.length > 0) {
        // this.setState({ foodCourt: res.details })
        var temp = []
        res.details.food_court.map((item, index)=>{
          var itemTemp = item
          itemTemp['image'] = item.file_type =="videop"?this.generateThumbnail("https://www.grubhouse.co.uk/upload/" + item.image ):"https://www.grubhouse.co.uk/upload/" + item.image
          temp.push(itemTemp)
        })
        if (res.details.food_court.length > 0) {
          // this.setState({ foodCourt: temp, filteredFoodCourt:temp })
          this.setState({ foodCourt: temp, users: res.details.users })
        }
      }
    })
  }
  reload = () => {
    getSponsoredMerchant().then(res => {
      this.setState({ sponsoredMerchant: res.details })
    })
    getSponsoredImage().then(res => {
      
      this.setState({promotion_image: res.details[0].image})
    })
    getFoodCourt().then(res => {
      console.warn(res.details.food_court.length)
      if (res.details.food_court.length > 0) {
        // this.setState({ foodCourt: res.details })
        var temp = []
        res.details.food_court.map((item, index)=>{
          var itemTemp = item
          itemTemp['image'] = item.file_type =="videop"?this.generateThumbnail("https://www.grubhouse.co.uk/upload/" + item.image ):"https://www.grubhouse.co.uk/upload/" + item.image
          temp.push(itemTemp)
        })
        if (res.details.food_court.length > 0) {
          // this.setState({ foodCourt: temp, filteredFoodCourt:temp })
          this.setState({ foodCourt: temp, users: res.details.users })
        }
      }
    })
  }

  generateThumbnail = async (fileUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        fileUri,
        {
          time: 3000,
        }
      );
      // console.log(uri, "video thumbnails")
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };
  getImage=(item)=>{
    var uri = item.file_type =="videop"?this.generateThumbnail("https://www.grubhouse.co.uk/upload/" + item.image ):"https://www.grubhouse.co.uk/upload/" + item.image
    // console.log(item, "item")
    return <Image source={{ uri:  uri}} style={styles.image2} />
  }

  getMenu = (rest)=>{
    var merchant = {
      id: rest.merchant_id,
      name: rest.restaurant_name,
      image: "https://www.grubhouse.co.uk/upload/"+rest.logo,
      address: rest.street + ", " + rest.city + ", " + rest.state,
      rating: rest.rating,
      service: rest.service,
      delivery_time:rest.delivery_estimation==""?"15~25min":rest.delivery_estimation,
      slug: rest.restaurant_slug,
      delivery_time:rest.delivery_estimation,
      amount: (rest.delivery_charges*1).toFixed(2),
    }
    // console.log(rest)
    gerMerchantMenu(rest.merchant_id).then((response)=>{
      this.props.navigation.navigate("DetailsScreen", {
        merchant: merchant,
        data: response.details
      })
    })
  }
  filter = (val)=>{
    // console.log(val)
    var temp = []
    var sVal = val.toLowerCase()
    if(sVal != ""){
      // console.log("before map of food court")
      if(val[0] == "@"){
        this.state.users.map((fc, index)=>{
          var flaga = -1
          
            this.setState({filterType: 'user'})
            flaga = fc?.first_name?fc?.first_name?.toLowerCase().indexOf(sVal.substring(1, sVal.length)):-1
            // flagd = fc?.first_name?fc?.first_name?.toLowerCase().indexOf(sVal.substring(1, sVal.length)):-1
            if(!this.middlecheck(temp, fc, 'user') && flaga>=0){
              if(global.USER.details.client_info?.first_name != fc?.first_name)
              temp.push(fc)
            }
          flaga = -1
        })
      } else {
        this.state.foodCourt.map((fc, index)=>{
          var flagb = -1
          flagb = fc.client_location.toLowerCase().indexOf(sVal)
            this.setState({filterType: 'merchant'})
            if(!this.middlecheck(temp, fc, 'merchant') && flagb>=0){
              temp.push(fc)
            }
            flagb = -1
        })
      }
    } else {
      temp = this.state.foodCourt
    }
    this.setState({filteredFoodCourt: temp})
  }

  middlecheck = (arr, item, index) => {
    for(var i = 0; i < arr.length; i++){
      if(index == 'user'){
        if(arr[i].first_name == item.first_name) return true
      } else {
        if(arr[i].client_location == item.client_location) return true
      }
    } 
    return false
  }
  gotoDetail = (item) => {
    // console.log(item)
    if(this.state.filterType == 'user'){
      if(item.client_id != null){
        this.props.navigation.navigate("FProfile", {
          client: item,
          reload: ()=>{},
          setData: ()=>{}
        })
      }
    } else {

      if(item.merchant_id){
        // console.log(item)
        var merchant = {
          id: item.merchant_id,
          name: item.restaurant_name,
          image: item.logo?BASE_URL+item.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
          address: item.street+", "+item.city+", "+item.state,
          rating: item.rating?item.rating:0,
          service: item.service,
          slug: item.restaurant_slug?item.restaurant_slug:'',
          delivery_time:item.delivery_estimation?item.delivery_estimation:'',
          amount: item.delivery_charges?(item.delivery_charges*1).toFixed(2):0,
        }
        
        gerMerchantMenu(item.merchant_id).then((response)=>{
          this.props.navigation.navigate("DetailsScreen", {
            merchant: merchant,
            data: response.details
          })
        })
      } else {
        alert("Something errors, Please contact Admin!")
      }
    }
  }
  render() {
    return (
      <View
        style={{flex: 1, position: "relative"}}
      >
        {
            this.state.dropdownView&&<TouchableOpacity
            style={{ position: "absolute", flex:1, top: 70, zIndex: 400, width: global.CONSTANT.WIDTH, height: global.CONSTANT.HEIGHT, backgroundColor: "rgba(0, 0, 0, 0.7)"}}
            onPress={()=>{
              // console.log("touich")
              this.setState({dropdownView: false})
            }}
          >
            <View
              style={{width: "80%",  alignSelf: "center", height: 200,borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}
            >
              <FlatList
                data={this.state.filteredFoodCourt}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{width: "100%", zIndex: 430, flexDirection: "row", justifyContent: "space-between", borderColor: "gray", borderBottomWidth: 1}}
                    activeOpacity={0.5}
                    onPress={()=>{
                      // console.log(item)
                      this.setState({dropdownView: false})
                      this.setState({searchText: ""})
                      this.gotoDetail(item)
                    }}
                  > 
                  {
                    this.state.filterType=='user'?<View style={{padding: 10, width: "100%", justifyContent: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "white"}}>
                    {item.avatar?<Avatar rounded size={20} source={{ uri: "https://www.grubhouse.co.uk/upload/"+item.avatar }} />:<Avatar rounded size={20} title={"NN"} />}
                    <Text style={{fontSize: 12, marginLeft: 5}}>
                      {item.first_name}
                    </Text>
                  </View>: <Text style={{fontSize: 12, backgroundColor: 'white', padding: 10, width: '100%'}}>{item.client_location}</Text>
                  }
                    
                  </TouchableOpacity>
                )}
                style={{width: "100%", height: 300,borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}
                keyExtractor={item => item.name}
              />
            </View>
          </TouchableOpacity>
          }
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",height: 70 }}>
          <View style={{flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Input
              leftIcon={{ type: "material-community", name: "magnify" }}
              placeholder="Search"
              placeholderTextColor="#000"
              inputContainerStyle={styles.inputFiedContainer}
              keyboardType="default"
              inputStyle={styles.inputText}
              
              onFocus = {()=>{this.setState({dropdownView: true})}}
              onChangeText={value => {this.setState({ searchText: value });
                // console.log(value)
                if(value){
                  this.setState({dropdownView: true})
                } else {
                  this.setState({dropdownView: false})
                }
                this.filter(value)}}
            />
            
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginHorizontal: 6, paddingTop: 20, height: "100%", position: "relative" }}>
            <Icon
              name="reload"
              // reverse
              color="#000"
              type="material-community"
              size={20}
              iconStyle={styles.icon1}
              onPress={() => {
                this.reload()
              }}
            />
          </View>
          
            
        </View>
          
          <ScrollView 
            style={styles.bgContainer}
            nestedScrollEnabled={true}
          >
            {/* search container */}
            
            {/* food court from db */}
            <View>
              {this.state.sponsoredMerchant?.map((rest, indeex) => {
                return <View
                  // onPress={() => this.props.navigation.navigate("Details")}
                  style={{ width: "100%" }}
                >
                  <View
                    Component={TouchableOpacity}
                    style={{borderRadius: 10, overflow: "hidden"}} 
                  >
                    <Card style={{ padding: 10, marginLeft: 'auto', marginRight: "auto", width: "95%", marginTop: 10, marginBottom: 4 }}>
                      <TouchableOpacity
                        onPress={()=>{this.getMenu(rest)}}
                      >
                        <ImageBackground
                          source={{uri: "https://www.grubhouse.co.uk/upload/"+this.state.promotion_image}} 
                          style={styles.images} 
                          Component={TouchableOpacity}
                        />
                      </TouchableOpacity>
                      
                      <View style={{justifyContent: "space-between", alignItems: "center", flexDirection: "row", alignItems: 'center'}}>
                        <Text style={styles.missText} Component={TouchableOpacity}>{rest.restaurant_name}</Text>
                        <Text style={styles.sponsoredMark} Component={TouchableOpacity}>Sponsored</Text>
                      </View>
                    </Card>
                  </View>
                  
                  <ScrollView
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                  >
                    {() => { return this.state.sponsoredMerchant[indeex].offers.length == 0 ? <Text>There is no offers</Text> : null }}
                    {this.state.sponsoredMerchant[indeex].offers.length && rest.offers.map((offer, i) => {
                      return <Card style={{ padding: 10, margin: 10, width: 200, flexDirection: "row" }}>
                        <View style={{ width: "60%", flexDirection: "column", justifyContent: "space-between" }}>
                          <Text>{offer.offer_name}</Text>
                          <Text style={{color: "gray"}}>save {Number(offer.offer_percentage).toFixed(0)}%</Text>
                          <Text>£&nbsp;･&nbsp;{Number(offer.offer_price).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={{ width: "40%" }}
                          onPress={()=>{getOfferDetail(rest.merchant_id)}}
                        >
                          <Image source={{ uri: "https://www.grubhouse.co.uk/upload/" + offer.image }} style={{ resizeMode: "cover", width: 60, height: 60 }} />
                        </TouchableOpacity>
                      </Card>
                    })}
                  </ScrollView>
                </View>
              })}
            </View>

            {/* food court inserted by uesr from db */}
            
            <View
              style={{ marginHorizontal: -1, marginTop: -9, marginBottom: -14, width: "100%"}}
            >
              <Text style={styles.title}>Who's Eating What Where?</Text>  
              <FlatGrid
                itemDimension={global.CONSTANT.WIDTH / 3 - 16}
                items={this.state.foodCourt}
                fixed
                renderItem={({ item }) => (
                  <View style={{position: "relative"}}
                  >
                    <TouchableOpacity
                      onPress={()=>{getFCourtDetail(item.id)}}
                    >
                      
                      {item.file_type =="video"?<Video
                                                  source={{ uri:  item.image}}
                                                  rate={1.0}
                                                  volume={0.0}
                                                  isMuted={false}
                                                  resizeMode="cover"
                                                  shouldPlay
                                                  isLooping
                                                  style={styles.image2} 
                                              />:<Image source={{ uri:  item.image}} style={styles.image2} />}
                    </TouchableOpacity>
                </View>
                )}
              />
            </View>
            
          
          </ScrollView>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  moredetail:{
    fontSize: 12,
    color: "#1A73E8"
  },
  images: {
    borderRadius: 15,
    resizeMode: "cover",
    width: "100%",
    height: 250,
    marginBottom: 10,
    // zIndex: 100
  },
  scrollView: {
    width: "100%"
  },
  missText: {
    fontSize: 20,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    textShadowColor: '#000',
  },
  sponsoredMark: {
    fontSize: 12,
    fontWeight: "bold",
    borderRadius: 32,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 6,  
    elevation: 2,
  },
  amountText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10
  },
  amountContainer: {
    flexDirection: "row",
    width: "100%"
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bgContainer: {
    width: null,
    backgroundColor: "#fff",
    marginHorizontal: 3
    // margin: 5
  },
  image: {
    height: 243,
    width: global.CONSTANT.WIDTH / 2 + 64,
    resizeMode: "cover"
  },
  imageChoco: {
    height: 243,
    width: global.CONSTANT.WIDTH,
    resizeMode: "cover"
  },
  image1: {
    height: 121,
    width: global.CONSTANT.WIDTH / 2 - 60,
    resizeMode: "cover"
  },
  image2: {
    height: 140,
    margin: -4
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "gray",
    marginHorizontal: 6
    // margin: 6
  },
  inputFiedContainer: {
    marginTop: global.CONSTANT.STATUSBAR,
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
    fontFamily: global.FONT.GEORGIA
  },
});
