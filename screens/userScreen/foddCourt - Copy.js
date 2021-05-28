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
      dropdownView: false
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
      if (res.details.length > 0) {
        // this.setState({ foodCourt: res.details })
        var temp = []
        res.details.map((item, index)=>{
          var itemTemp = item
          itemTemp['image'] = item.file_type =="videop"?this.generateThumbnail("https://www.grubhouse.co.uk/upload/" + item.image ):"https://www.grubhouse.co.uk/upload/" + item.image
          temp.push(itemTemp)
        })
        if (res.details.length > 0) {
          this.setState({ foodCourt: temp, filteredFoodCourt:temp })
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
      var temp = []
      res.details.map((item, index)=>{
        var itemTemp = item
        itemTemp.image = item.file_type =="video"?this.generateThumbnail("https://www.grubhouse.co.uk/upload/" + item.image ):"https://www.grubhouse.co.uk/upload/" + item.image
        temp.push(itemTemp)
      })
      if (res.details.length > 0) {
        this.setState({ foodCourt: temp, filteredFoodCourt:temp  })
      }
    })
    // console.log(this.state.sponsoredMerchant, "___________________________________")
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
  filter = (val)=>{
    // console.log(val)
    var temp = []
    var sVal = val.toLowerCase()
    if(sVal != ""){
      this.state.foodCourt.map((fc, index)=>{
        var flaga = -1
        var flagb = -1
        var flagc = -1
        var flagd = -1
        // console.log(fc)
        flaga = fc.client_location.toLowerCase().indexOf(sVal)
        if(val[0] == "@"){
          flagb = fc?.first_name?fc?.first_name?.toLowerCase().indexOf(sVal.substring(1, sVal.length)):-1
          flagd = fc?.first_name?fc?.first_name?.toLowerCase().indexOf(sVal.substring(1, sVal.length)):-1
        }
        
        flagc = fc.food_name.toLowerCase().indexOf(sVal)
        
        // console.log(fc)
        if(flaga>=0||flagb>=0||flagc>=0||flagd>=0){
          temp.push(fc)
        }
        flaga = -1
        flagb = -1
        flagc = -1
        flagd = -1
      })
    } else {
      temp = this.state.foodCourt
    }
    this.setState({filteredFoodCourt: temp})
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
                      getFCourtDetail(item.id)
                    }}
                  >
                    <View style={{paddingLeft: 10, flexDirection: "column", justifyContent: "center", width: "70%"}}>
                      <Text style={{paddingLeft: 10, width: "100%", backgroundColor: "white",  }}>{item.food_name} </Text>
                      <Text style={{paddingLeft: 10, width: "100%", backgroundColor: "white", color: 'gray'  }}>{item.client_location} </Text>
                    </View>
                    <View style={{width: "30%", justifyContent: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "white"}}>
                      {item.avatar?<Avatar rounded size={20} source={{ uri: "https://www.grubhouse.co.uk/upload/"+item.avatar }} />:<Avatar rounded size={20} title={"NN"} />}
                      <Text style={{fontSize: 12, marginLeft: 5}}>
                        {item.first_name}
                      </Text>
                    </View>
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
              {this.state.sponsoredMerchant.map((rest, indeex) => {
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
                      
                      <View style={{justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                      <Text style={styles.missText} Component={TouchableOpacity}>{rest.restaurant_name + "(" + rest.city + ")"}</Text>
                      {/* <Text style={styles.moredetail} Component={TouchableOpacity}
                        >More detail</Text> */}
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
              style={{ marginHorizontal: -6, marginTop: -9, marginBottom: -14 }}
            >
              
              <FlatGrid
                itemDimension={global.CONSTANT.WIDTH / 3 - 30}
                items={this.state.foodCourt}
                renderItem={({ item }) => (
                  <View style={{position: "relative"}}
                  >
                    <TouchableOpacity
                      onPress={()=>{getFCourtDetail(item.id)}}
                    >
                      {/* <Thumbnail url={"https://www.grubhouse.co.uk/upload/" + item.image } /> */}
                      
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
    // marginHorizontal: 2,
    // marginTop: 2
  },
  imageChoco: {
    height: 243,
    width: global.CONSTANT.WIDTH,
    resizeMode: "cover"
    // marginHorizontal: 2,
    // marginTop: 2
  },
  image1: {
    height: 121,
    width: global.CONSTANT.WIDTH / 2 - 60,
    resizeMode: "cover"

    // marginTop: 2
  },
  image2: {
    height: 124,
    width: global.CONSTANT.WIDTH / 3 - 3,
    resizeMode: "cover",
    marginVertical: -4.5
    // marginTop: -4,
    // marginBottom: -5
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
    // borderRadius: 20
    // marginLeft: 30
    // marginTop: global.CONSTANT.STATUSBAR + 20
  }
  // image: {
  //   height: 100
  // },

  // overlay: {
  //   height: 401,
  //   width: 261
  //   // marginLeft: 5
  // },
  // overlayTitle: {
  //   fontSize: 10,
  //   fontWeight: "bold",
  //   marginTop: 350
  // },
  // grid: {
  //   // margin: 6,
  //   marginTop: global.CONSTANT.STATUSBAR
  // },
  // overlay1: {
  //   height: 200,
  //   width: 128,
  //   marginVertical: 0.5,
  //   marginLeft: -8
  // },
  // overlay2: {
  //   height: 180,
  //   width: 130,
  //   // marginHorizontal: 8,
  //   marginVertical: 0.5
  // },
  // roastedText: {
  //   fontSize: 18,
  //   color: "#fff",
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   marginHorizontal: 2
  // },
  // icon: {
  //   // alignContent: "center",
  //   marginTop: 5
  // },
  // likeText: {
  //   fontSize: 20,
  //   color: global.COLOR.PRIMARY,
  //   fontWeight: "normal",
  //   textAlign: "center"
  // },
  // image: {
  //   height: 200,
  //   width: 130,
  //   marginVertical: 0.5
  //   // marginLeft: -8
  // },
  // image1: {
  //   height: 401,
  //   width: 258,
  //   marginLeft: 8
  // }
});
