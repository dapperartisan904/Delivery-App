import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Animated,
  FlatList,
  SafeAreaView,
  Share,
  Alert,
  BackHandler,
  Platform,
  Image,
} from "react-native";
import combo from "../../assets/combo.png";
import { Icon, Button } from "react-native-elements";
import global from "../../global";
import { Divider } from "react-native-paper";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
// import {Image} from "react-native-expo-image-cache";
import {
  inserFavorite,
  getRestaurantInfo,
  LoadCart,
  GetCartCount,
  AddToCart,
  ClearCart,
  GetOpenTime,
  CheckCart,
  goDetailById,
  gerMerchantMenu
} from "../../utils/Api"
import { Input } from "react-native-elements";
import * as Linking from 'expo-linking'
import RBSheet from "react-native-raw-bottom-sheet";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Geocoder from 'react-native-geocoding';
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Dropdown } from 'react-native-material-dropdown-v2';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeCount, changeCart } from '../../store/actions/actions';
// import Share from 'react-native-share';
import * as ImageManipulator from 'expo-image-manipulator';

let confirmDialog = ''
class detailsScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
    this.HPosition = []
    this.VPosition = []
    this.cusineImages = []
    this.dropdownRef = ''
    this.confirmSheet = ''
    this.cuisineIndex = 0
    this.cuisineImagegFlag = []
    //// console.log("==============================================================================")
    //// console.log(this.props.count)
    this.state = {
      merchant: {
        restaurant_name: "merchant profile",
        address: '',
        rating: {
          ratings: 0,
          votes: 0
        },
        image: "",
        slug: "",
        delivery_time: ""
      },
      itemList: [],
      selectedCategory: '',
      favorite: 0,
      dataVSourceCords: [],
      dataHSourceCords: [],
      selectedIndex: 0,
      searchBar: false,
      searchText: "",
      searched: [],
      sticky: [4],
      basketNum: 1,
      shareFlag: true,
      toCart: '',
      prevMerchantId: 0,
      preorderStatus: true
    };
  }
  showSearch = () => {
    this.setState({ searchBar: true })
  }

  toggleFavorite = (merchant_id, liked) => {
    inserFavorite(merchant_id, liked, this.state.searchAddress).then((res) => {

      this.setState({ favorite: this.state.favorite == 1 ? 0 : 1 })
    })
  }

  prettyPrice = (prices) => {
    var p = ''
    var i = 0
    prices.map((price, index) => {
      p += price.replace("&nbsp;", " ")
      // //// console.log(prices)
      if (i != prices.length - 1)
        p += "|"
      i++
    })
    return p
  }

  measureComponent = component => {
    return new Promise((resolve, reject) => {
      component.measure((x, y, width, height, pageX, pageY) => {
        resolve({ x, y, width, height, pageX, pageY })
      })
    })
  }

  async componentDidMount() {
    this.setInitialData()
  }
  async setInitialData() {
    this.props.navigation.setParams({
      handleThis: this.showSearch,
      smsTo: this.sendSMS
    });
    var tempItem = []
    this.setState({
      merchant: this.props.navigation.state.params.merchant,
      itemList: tempItem,
      selectedCategory: "",
      selectedItems: [],
      searched: tempItem,
      packages: [],
      discount: this.props.navigation.state.params.data.discount,
      offers: this.props.navigation.state.params.data.offers,
    })
    if (typeof this.props.navigation.state.params.data === "undefined" || !this.props.navigation.state.params.data) {

      this.setState({
        merchant: this.props.navigation.state.params.merchant,
        itemList: tempItem,
      })
    }
    else {
      var packages = []
      this.setState({ favorite: typeof this.props.navigation.state.params.data.menu.favorite === "undefined" ? 0 : this.props.navigation.state.params.data.menu.favorite ? 1 : 0 })
      if (typeof this.props.navigation.state.params.data.packages_origin !== "undefined" && this.props.navigation.state.params.data.packages_origin) {
        this.props.navigation.state.params.data.packages_origin.map((pack, index) => {
          var items = []
          var price = 0
          this.props.navigation.state.params.data.package_item_origin.map((item, jIndex) => {
            if (item.category.indexOf(pack.subcat_id) >= 0) {
              items.push(item)
              price += Number(item.price)
            }
          })
          pack.sub_item = items
          pack.price = price
          packages.push(pack)
        })
      }
      for (var i = 0; i < this.props.navigation.state.params.data.menu.list.length; i++) {
        tempItem.push(this.props.navigation.state.params.data.menu.list[i])
      }
      for (i = 0; i < tempItem.length; i++) {
        for (var j = 0; j < tempItem[i].item.length; j++) {
          await this.imageCompressor(tempItem[i].item[j].photo)
        }
      }
      this.setState({
        merchant: this.props.navigation.state.params.merchant,
        itemList: tempItem,
        selectedCategory: this.props.navigation.state.params.data.menu.list[0].category_name,
        selectedItems: tempItem[0].item,
        searched: tempItem,
        packages: packages,
        sticky: packages.length > 0 ? [4] : [2],
        discount: this.props.navigation.state.params.data.discount,
        minimum_amount: this.props.navigation.state.params.data.minimum_amount
      })
    }
    //// console.log(this.props.navigation.state.params.data.discount, "discount")
    this.setState({ dataVSourceCords: [], dataHSourceCords: [] })
    var flag = false
    this.animation.addListener(({ value }) => {
      if (Platform.OS === "ios") {
        this.HPosition.map((hi, i) => {
          hi.measure((x, y, width, height, pageX, pageY) => {
            if (this.state.dataHSourceCords.length < this.HPosition.length)
              this.setState({ dataHSourceCords: [...this.state.dataHSourceCords, { x: x, pageY: pageY }] })
          })
        })
        var index = -1
        this.VPosition.map((vi, i) => {
          vi.measure((x, y, width, height, pageX, pageY) => {

            if (typeof this.state.dataVSourceCords[i + 1] != "undefined") {
              if ((this.state.dataVSourceCords[i + 1].y >= value + 140 && value + 140 >= y) || (this.state.dataVSourceCords[this.state.dataVSourceCords.length - 1].y <= value + 140 && i == this.state.dataVSourceCords.length - 1)) {
                index = i
                flag = true
                this.hScroller.scrollTo({
                  x: this.state.dataHSourceCords[index].x,
                  animated: false,
                })
                if (typeof this.state.itemList[index] != "undefined") {
                  if (this.state.itemList[index].category_name != this.state.selectedCategory) {
                    this.setState({ selectedCategory: this.state.itemList[index].category_name })
                    //this.selectCategory(this.state.itemList[index].category_name)
                  }
                }
              }
            }
            if (typeof this.state.dataVSourceCords[this.state.dataVSourceCords.length - 1] !== "undefined")
              if (this.state.dataVSourceCords[this.state.dataVSourceCords.length - 1].y <= value + 140 && i == this.state.dataVSourceCords.length - 1) {
                index = i
                flag = true
                this.hScroller.scrollTo({
                  x: this.state.dataHSourceCords[index].x,
                  animated: false,
                })
                if (typeof this.state.itemList[index] != "undefined") {
                  if (this.state.itemList[index].category_name != this.state.selectedCategory) {
                    this.setState({ selectedCategory: this.state.itemList[index].category_name })
                    //this.selectCategory(this.state.itemList[index].category_name)
                  }
                }
              }


            if (this.state.dataVSourceCords.length < this.VPosition.length)
              this.setState({ dataVSourceCords: [...this.state.dataVSourceCords, { y: y, pageY: pageY }] })
          })
        })
      } else {
        var index = -1
        this.state.dataVSourceCords.map((vItem, i) => {
          if (value + 180 >= vItem.y) {
            index = i
            flag = true
          }
        })

        if (this.state.selectedIndex != index || index == 0) {
          this.hScroller.scrollTo({
            x: typeof this.state.dataHSourceCords[index] == "undefined" ? 0 : this.state.dataHSourceCords[index].x - 5,
            animated: true,
          }
          )
          if (typeof this.state.itemList[index] != "undefined") {
            this.selectCategory(this.state.itemList[index].category_name)
          }
        }
      }
    })
    this.getTime()
  }
  getTime = () => {
    GetOpenTime(this.props.navigation.state.params.merchant.id).then(res => {
      console.warn("get open time response====================================================================================================", res)
      if (!res.code) {
        return this.getTime()
      }
      if (!res.details) {
        Alert.alert("GRUBHOUSE", this.props.navigation.state.params.merchant.name + " is not opened now")
        this.setState({ preorderStatus: false })
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
        msg += this.props.navigation.state.params.merchant.name + " is not opened now "
        var flag = false

        if (res.pre_order) {
          msg += "\nBut is accepting preorders"
        }

        // console.log(res)
        if (res.details) {
          var openTime = Number(res.details[dateIndex[cDay]]?.split(":")[0])
          var closeTime = Number(res.details[dateIndex[cDay]]?.split(":")[0])
          // console.log(openTime, cTime, closeTime)
          if (openTime > closeTime) {
            if (openTime > cTime)
              Alert.alert("GRUBHOUSE", msg)
          } else if (openTime < closeTime) {
            if (openTime > cTime || cTime > closeTime)
              Alert.alert("GRUBHOUSE", msg)
          } else if (!res.details[dateIndex[cDay]]) {
            Alert.alert("GRUBHOUSE", msg)
            // console.log("2")
          }
        } else {
          Alert.alert("GRUBHOUSE", msg)
        }
      }
      CheckCart().then(res => {
        if (!res || !res.merchant) {
          this.cartConfirm()
        } else {
          // Alert.alert("GRUBHOUSE", "alert")
          if (this.props.navigation.state.params.merchant.id != res.merchant[0].merchant_id) {
            this.setState({ prevMerchantId: res.merchant[0].merchant_id })
            this.setState({ cartFlag: true, merchant_name: res.merchant[0].restaurant_name }, () => {
              this.confirmCheckSheet.open()
            })
          } else {
            this.cartConfirm()
          }
        }
      })
    })
  }
  cartConfirm = () => {
    LoadCart(this.props.navigation.state.params.merchant.id).then(res => {
      // console.log(res, "in detailsscreen page")
      if (res == "undefined" || typeof res == "undefined") {
        return this.cartConfirm()
      }
      this.changeCartRedux(res)
    })
    GetCartCount(this.props.navigation.state.params.merchant.id).then(res => {
      this.changeTotalRedux(res)
      // this.props.dispatch(changeCount(res))
    })
    this.setState({ merchant_name: this.props.navigation.state.params.merchant.name })
  }
  addItemToCart(item) {
    //// console.log(item, "in additemtocart function")
    if (this.state.previousCart) {
      this.confirmCheckSheet.open()
      return false
    }
    AddToCart(item).then(res => {
      //// console.log(res)
      LoadCart(this.props.navigation.state.params.merchant.id).then(res => {
        this.changeCartRedux(res)
      })
      GetCartCount(this.props.navigation.state.params.merchant.id).then(res => {
        this.changeTotalRedux(res)
      })
    })
  }
  changeCartRedux = (data) => {
    let { ChangeCart } = this.props
    // console.log("changed data", data, "changed data")
    ChangeCart(data)
  }
  changeTotalRedux = (data) => {
    let { ChangeCount } = this.props
    // console.log("changed data", data, "changed data")
    ChangeCount(data)
  }
  sendSMS = async () => {

    try {
      const result = await Share.share({
        message: "Check out " + this.state.merchant.name + "\nhttps://www.grubhouse.co.uk/menu-" + this.state.merchant.slug,
        title: "Share with friend",
        url: "https://reactnativemaster.com/react-native-camera-expo-example/"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          // alert("shared with activity")
        } else {
          // shared
          // alert("share")
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        // alert("Post cancelled")
      }
    } catch (error) {
      alert(error.message);
    }

  }

  selectCategory = (d) => {
    this.setState({ selectedCategory: d })
  }

  hSelectCategory = (d, index) => {
    this.HPosition.map((hi, i) => {
      hi.measure((x, y, width, height, pageX, pageY) => {
        if (this.state.dataHSourceCords.length < this.HPosition.length)
          this.setState({ dataHSourceCords: [...this.state.dataHSourceCords, { x: x, pageY: pageY }] })
      })
    })

    this.VPosition.map((vi, i) => {
      vi.measure((x, y, width, height, pageX, pageY) => {

        if (this.state.dataVSourceCords.length < this.VPosition.length)
          this.setState({ dataVSourceCords: [...this.state.dataVSourceCords, { y: y, pageY: pageY }] })
      })
    })

    this.vScroller.scrollTo({
      y: this.state.dataVSourceCords[index].y - 75,
      animated: false,
    })
    this.hScroller.scrollTo({
      x: this.state.dataHSourceCords[index].x,
      animated: false,
    })
    this.setState({ selectedCategory: d })
  }

  filter = (value) => {

    var temp = []
    if (value != "") {
      var flag = false
      this.state?.itemList?.map((cat, index) => {
        if (cat?.category_name?.toLowerCase().indexOf(value?.toLowerCase()) >= 0) {
          temp.push(cat)
          flag = true
        }
        if (!flag) {
          for (var i = 0; i < cat?.item?.length; i++) {
            if (cat?.item[i]?.item_name.toLowerCase().indexOf(value?.toLowerCase()) >= 0) {
              temp.push(cat)
            }
          }
        }
        flag = false
      })
    } else {
      temp = this.state?.itemList
    }
    this.setState({ searched: temp })
  }

  getInfo = async () => {
    // console.log(global.LOCATION)
    getRestaurantInfo(this.state.merchant.id, global.LOCATION)
  }

  addItemToCart(item) {
    //// console.log(item, "in additemtocart function")
    if (this.state.previousCart) {
      this.confirmCheckSheet.open()
      return false
    }
    AddToCart(item).then(res => {
      //// console.log(res)
      LoadCart(this.props.navigation.state.params.merchant.id).then(res => {
        // console.log(res, "in detailsscreen page")
        this.changeCartRedux(res)
      })
      GetCartCount(this.props.navigation.state.params.merchant.id).then(res => {
        this.changeTotalRedux(res)
        // this.props.dispatch(changeCount(res))
      })
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleGoBack);
    this.changeTotalRedux()
  }

  handleGoBack = () => {
    // console.log(this.props.count.cart)
    // 
    if (this.props.count.count.basket_total != "£0.00") {
      this.confirmSheet.open()
    } else {
      this.props.navigation.goBack(null)
    }
    return true
  }

  deliveryOptions = (serviceType) => {
    // console.log("delivery option", serviceType)
    switch (serviceType) {
      case "2":
        return <View
          style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
          Component={TouchableOpacity}
        >
          <Image source={global.ASSETS.DELIVERY_OPTION} style={{ width: 40, height: 25, resizeMode: "cover" }} />
        </View>
        break;
      case "3":
        return <View
          style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
          Component={TouchableOpacity}
        >
          <Image source={global.ASSETS.PICKUP_OPTION} style={{ width: 35, height: 25, resizeMode: "cover" }} />
        </View>
        break;

      case "4":
        return <View
          style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
          Component={TouchableOpacity}
        >
          <Image source={global.ASSETS.DELIVERY_PICKUP_DINEIN_OPTION} style={{ width: 70, height: 25, resizeMode: "cover" }} />
        </View>
        break;

      case "5":
        return <View
          style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
          Component={TouchableOpacity}
        >
          <Image source={global.ASSETS.DELIVERY_DINEIN_OPTION} style={{ width: 60, height: 25, resizeMode: "stretch" }} />
        </View>
        break;

      case "6":
        return <View
          style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
          Component={TouchableOpacity}
        >
          <Image source={global.ASSETS.PICKUP_DINEIN_OPTION} style={{ width: 60, height: 25, resizeMode: "stretch" }} />
        </View>
        break;

      case "7":
        return [
          <View
            style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
            Component={TouchableOpacity}
          >
            <Image source={global.ASSETS.DINEIN_OPTION} style={{ width: 35, height: 25, resizeMode: "cover" }} />
          </View>
        ]
        break;

      default:
        return <View
          style={{ marginLeft: 10, justifyContent: "center", flexDirection: "row", alignItems: "center" }}
          Component={TouchableOpacity}
        >
          <Image source={global.ASSETS.DELIVERY_PICKUP_OPTION} style={{ width: 60, height: 25, resizeMode: "stretch" }} />
        </View>
        break;
    }
  }

  imageCompressor = async (imageUri) => {

  }
  render() {
    let { count, ChangeCount } = this.props

    return (
      <SafeAreaView style={styles.bgContainer}>
        {this.state.selectedPackage && <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown
          height={global.CONSTANT.HEIGHT}
          duration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 1)"
            },
            draggableIcon: {
              height: 0,
              backgroundColor: "rgba(0, 0, 0, 0)"
            }
          }}

        >
          <View
            style={{ width: "100%", position: "relative", backgroundColor: "white" }}
          >
            <Image
              source={{ uri: this.state.selectedPackage.photo }}
              style={{ width: global.CONSTANT.WIDTH, height: global.CONSTANT.WIDTH, resizeMode: "cover" }}
            />
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10, zIndex: 10, width: 24, height: 24, borderRadius: 24, backgroundColor: "gray" }}
              onPress={() => { }}
            >
              <Icon
                name="close"
                color="#fff"
                type="material-community"
                size={24}
                Component={TouchableOpacity}
                onPress={() => { }}
              />
            </TouchableOpacity>

          </View>
          <View style={{ width: "100%", paddingBottom: 50, position: 'absolute', bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
            <View style={styles.rbSheetContainer}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <View>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", }}
                  >{this.state.selectedPackage.subcategory_name}</Text>
                </View>
                <View style={{ width: "45%" }}>
                  <Dropdown
                    ref={v => this.dropdownRef = v}
                    icon='chevron-down'
                    iconColor='#E1E1E1'
                    label='Price'
                    value={this.state.selectedPackage.data.length == 1 ? this.state.selectedPackage.data[0].value : null}
                    data={this.state.selectedPackage.data}
                    onChangeText={(ev, index) => {
                      this.setState({ selectedIndex: index });
                    }}
                  />
                </View>
              </View>

              <View style={{ width: "100%", height: 50, justifyContent: "flex-start" }}>
                <Text
                  style={{ fontSize: 14, color: "gray" }}
                >{this.state.selectedPackage.subcategory_description}</Text>
              </View>
              <View style={{ height: 80 }}>
                <FlatList
                  data={this.state.selectedPackage.sub_item}
                  renderItem={({ item: d }) => (
                    <View style={{ width: "50%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text
                        style={{ fontSize: 14, color: "gray" }}
                      >{d.sub_item_name}</Text>
                      <Text style={{ fontSize: 14, color: "gray" }}>£{Number(d.price).toFixed(1)}</Text>

                    </View>
                  )}
                />
              </View>
              <View style={{ width: "50%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <TouchableOpacity
                  onPress={() => { this.setState({ basketNum: this.state.basketNum - 1 < 0 ? 0 : this.state.basketNum - 1 }) }}
                >
                  <Text style={{ color: global.COLOR.PRIMARY, width: 25, height: 25, fontSize: 15, borderRadius: 13, borderColor: global.COLOR.PRIMARY, borderWidth: 1, paddingTop: 1, paddingBottom: 1, textAlign: "center" }} Component={TouchableOpacity}>-</Text>
                </TouchableOpacity>
                <Text style={{ color: global.COLOR.PRIMARY, fontSize: 19 }}>{this.state.basketNum}</Text>
                <TouchableOpacity
                  onPress={() => { this.setState({ basketNum: this.state.basketNum + 1 }) }}
                >
                  <Text style={{ color: global.COLOR.PRIMARY, width: 25, height: 25, fontSize: 15, borderRadius: 13, borderColor: global.COLOR.PRIMARY, borderWidth: 1, paddingTop: 1, paddingBottom: 1, textAlign: "center" }}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ width: "90%", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 40, borderRadius: 8, backgroundColor: global.COLOR.PRIMARY }}
                onPress={() => {
                  // console.log(this.state.toCart, "selected items")
                  // console.log(this.state.selectedPackage.prices, this.state.selectedPackage.data.indexOf({value:this.dropdownRef.value()}))
                  // console.log(this.state.selectedPackage.prices[this.state.selectedPackage.data.indexOf({value:this.dropdownRef.value()})])
                  if (this.dropdownRef.value()) {
                    this.addItemToCart({
                      merchant_id: this.state.merchant.id,
                      item_id: this.state.toCart.item_id,
                      qty: this.state.basketNum,
                      price: this.state.selectedPackage.prices[this.state.selectedIndex]
                    })
                    this.RBSheet.close()
                    this.setState({ selectedIndex: 0 })
                  } else {
                    alert("Please select the price")
                  }

                }}
              >
                <Text style={{ fontSize: 18, color: "white" }}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>}
        <RBSheet
          ref={ref => {
            this.confirmSheet = ref;
            // confirmDialog = ref
          }}
          height={300}
          duration={250}
        >
          <View style={{ height: "100%", width: "80%", alignSelf: "center", paddingVertical: 10, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", }}
                >Continue with your previous cart?</Text>
              </View>
              <Divider style={{ width: "100%", height: 1 }} />
              <View style={{ marginVertical: 20, flexDirection: "column", }}>
                <Text
                  style={{ fontSize: 18, color: "gray" }}
                >You still have items in your cart from</Text>
                <Text
                  style={{ fontSize: 18, color: "gray" }}
                > {this.state.merchant_name}</Text>
              </View>
            </View>
            <Button
              containerStyle={{ marginBottom: 5 }}
              onPress={() => { this.confirmSheet.close(); this.props.navigation.goBack(null) }}
              title={"Continue"}
            />
            <Button
              buttonStyle={{ backgroundColor: "white" }}
              titleStyle={{ color: global.COLOR.PRIMARY }}
              containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
              onPress={() => {
                this.confirmSheet.close();

                ClearCart(this.state.merchant.id)
                this.props.navigation.goBack(null)
              }}
              title={"Clear Basket"}
            />
          </View>
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.confirmCheckSheet = ref;
            // confirmDialog = ref
          }}
          closeOnPressMask={false}
          height={300}
          duration={250}
        >
          <View style={{ height: "100%", width: "80%", alignSelf: "center", paddingVertical: 10, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", }}
                >You still have previous cart!</Text>
              </View>
              <Divider style={{ width: "100%", height: 1 }} />
              <View style={{ marginVertical: 20, flexDirection: "column", }}>
                <Text
                  style={{ fontSize: 18, color: "gray" }}
                >You still have items in your cart from</Text>
                <Text
                  style={{ fontSize: 18, color: "gray" }}
                > {this.state.merchant_name}</Text>
              </View>
            </View>
            <Button
              containerStyle={{ marginBottom: 5 }}
              onPress={() => {
                goDetailById(this.state.prevMerchantId).then(rest => {
                  var merchant = {
                    id: rest.merchant_id,
                    image: rest.logo != "" ? "https://www.grubhouse.co.uk/upload/" + rest.logo : "https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
                    name: rest.restaurant_name,
                    address: rest.street,
                    review: rest.ratings == null ? "0" : Number(rest.ratings).toFixed(2),
                    delivery_time: rest.delivery_estimation == "" ? "15~25min" : rest.delivery_estimation,
                    type: "Breakfast and Brunch",
                    amount: (rest.delivery_charges * 1).toFixed(2),
                    // distance:this.getDistance(rest.latitude, rest.lontitude),
                    open_time: "5:00am",
                    close_time: "10:00pm",
                    service: rest.service,
                    rating: {
                      ratings: rest.ratings,
                      votes: 0
                    },
                  }

                  this.confirmCheckSheet.close();
                  gerMerchantMenu(this.state.prevMerchantId).then((response) => {
                    this.props.navigation.navigate("DetailsScreen", {
                      merchant: merchant,
                      data: response.details
                    })
                    this.setInitialData()
                  })
                })
              }}
              title={"Go back to previous cart"}
            />
            <Button
              buttonStyle={{ backgroundColor: "white" }}
              titleStyle={{ color: global.COLOR.PRIMARY }}
              containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
              onPress={() => {
                this.confirmCheckSheet.close();

                ClearCart(this.state.merchant.id)
                // this.props.navigation.goBack(null)
              }}
              title={"Clear Basket From " + this.state.merchant_name}
            />
          </View>
        </RBSheet>
        <ScrollView
          stickyHeaderIndices={this.state.sticky}
          ref={(ref) => { this.vScroller = ref }}
          nestedScrollEnabled={true}
          style={styles.crispyFlatlist, { flex: 0 }}
          collapsible={false}
          contentInsetAdjustmentBehavior="automatic"
          onScroll={
            Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: this.animation,
                    },
                  },
                },
              ], { useNativeDriver: false })
          }
          scrollEventThrottle={50}
        >
          <ImageBackground
            source={{ uri: this.state.merchant.image }}
            style={styles.imageContainer}
            imageStyle={styles.image}
          >
            <View style={styles.iconContainer}>
              <Icon
                name="chevron-left"
                reverse
                color="#fff"
                type="material-community"
                size={24}
                iconStyle={styles.icon}
                Component={TouchableOpacity}
                onPress={() => this.handleGoBack()}
              />
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Icon
                  name="briefcase-upload-outline"
                  reverse
                  color="#fff"
                  type="material-community"
                  size={24}
                  iconStyle={styles.icon}
                  onPress={this.sendSMS}
                  Component={TouchableOpacity}
                />
                <Icon
                  name={this.state.favorite == 1 ? "heart" : "heart-outline"}
                  reverse
                  color="#fff"
                  type="material-community"
                  size={24}
                  iconStyle={styles.heartIcon}
                  Component={TouchableOpacity}
                  onPress={() => { this.toggleFavorite(this.state.merchant.id, this.state.favorite) }}
                />
              </View>
            </View>
          </ImageBackground>
          {/* card container */}
          <View style={styles.cardContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginHorizontal: 5,
              }}
            >
              <View style={{ width: "100%" }}>
                <Text style={styles.almiraText}>{this.state.merchant.name}</Text>
                <Text style={{ color: "gray" }}>{this.state.merchant.address}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >

              <TouchableOpacity
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <Icon
                  name="currency-gbp"
                  color="gray"
                  type="material-community"
                  size={20}
                  iconStyle={styles.starIcon}
                />
                <Text style={styles.typeRating}>{this.state.minimum_amount ? Number(this.state.minimum_amount).toFixed(2) : 0} minimum</Text>

              </TouchableOpacity>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <Icon
                  name="timer"
                  color="gray"
                  type="material-community"
                  size={20}
                  iconStyle={styles.starIcon}
                />
                <Text style={styles.typeRating} numberOfLines={1}>{this.state.merchant.delivery_time}</Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <Icon
                  name="currency-gbp"
                  color="gray"
                  type="material-community"
                  size={20}
                  iconStyle={styles.starIcon}
                />

                <Text style={{
                  fontSize: 14,
                  color: "gray",
                  marginVertical: 4,
                }}>{this.state.merchant.amount ? Number(this.state.merchant.amount).toFixed(2) : 0}</Text>
                {
                  this.deliveryOptions(this.state.merchant.service)
                }
              </View>
            </View>
            <View style={styles.divider}></View>
            {
              this.state.offers && <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                  marginVertical: 5,
                  marginRight: 50,
                }}
              >
                <View style={{ width: "10%", margin: 10 }}>
                  <Icon
                    name="tag-outline"
                    color="red"
                    type="material-community"
                    size={24}
                  // iconStyle={styles.icon}
                  />
                </View>
                <View style={{ width: "90%", alignItems: "center", flexDirection: "row", justifyContent: "flex-start" }}>
                  {/* <Text style={{fontSize: 16}}>{this.state.discount[0]?.voucher_name}</Text> */}
                  {/* <Text style={{color: "gray", fontSize: 14}}>Save {this.state.discount?this.state.discount[0].type =="fixed amount"?"£":null:null}{this.state.discount?Number(this.state.discount[0].amount).toFixed(0):""}{this.state.discount?this.state.discount[0].type !="fixed amount"?"%":null:null}</Text> */}
                  <Text style={{ fontSize: 16 }}>{this.state.offers ? this.state.offers[0] : null}</Text>
                </View>
              </View>
            }

            {
              this.state.offers && <View style={styles.divider}></View>
            }
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                marginVertical: 5,
                height: 30,
                marginRight: 50,
                marginBottom: 30
              }}
            >
              <View style={{ width: "10%", margin: 10, height: 30 }}>
                <Icon
                  name="map-marker"
                  color="#013220"
                  type="material-community"
                  size={24}
                // iconStyle={styles.icon}
                />
              </View>
              <TouchableOpacity style={{ width: "80%", }}
                onPress={() => { this.getInfo() }}
              >
                <Text style={{ fontSize: 16 }}>More Info</Text>
                <Text
                  style={{ color: "gray", fontSize: 14 }}
                  numberOfLines={1}
                > Map, allergens, opening times and rating</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "10%", margin: 10, height: 30 }}
              >
                <Icon
                  name="chevron-right"
                  color="gray"
                  type="material-community"
                  size={24}
                // iconStyle={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {
              !this.state.preorderStatus ? <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "black",
                  borderRadius: 10
                }}
              >
                <View style={{ width: "10%", margin: 10, height: 30 }}>
                </View>
                <View style={{ width: "80%", flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{ color: "white", fontSize: 14 }}
                    numberOfLines={1}
                  >Currently not accepting orders</Text>
                </View>
              </View> : null
            }
          </View>
          {
            typeof this.state.packages != "undefined" ? this.state.packages.length > 0 ? [<View style={{ flexDirection: "row", marginTop: 25, marginBottom: 20, justifyContent: "flex-start", alignItems: "center", width: "100%", height: 60, paddingLeft: 20 }}>
              <Text style={{
                fontWeight: "bold",
                fontSize: 20,
              }}>Party Packages</Text>
              <Image
                source={global.ASSETS.PARTY_PACKAGE}
                style={{ marginLeft: 10, width: 70, height: 70, resizeMode: "cover" }}
              />
            </View>,
            <View style={styles.crispyFlatlist, { paddingLeft: 6, paddingRight: 6, marginBottom: 10 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.packages}
                renderItem={({ item: d }) => (
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      var temp = []
                      if (d.prices)
                        d.prices.map((op, index) => {
                          temp.push({
                            value: op.replace("&nbsp;", " ")
                          })
                        })
                      this.setState({
                        selectedPackage: {
                          photo: d.photo ? "https://www.grubhouse.co.uk/upload/" + d.photo : "https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
                          subcategory_name: d.subcategory_name,
                          price: d.price,
                          data: temp,
                          prices: d.origin_price,
                          // original: d.original_price,
                          subcategory_description: d.subcategory_description,
                          sub_item: d.sub_item
                        }
                      }, () => {
                        this.setState({ toCart: d })
                        this.RBSheet.open()
                      });
                    }}
                  >
                    <Image
                      source={{ uri: d.photo ? "https://www.grubhouse.co.uk/upload/" + d.photo : "https://www.grubhouse.co.uk/assets/images/lastsec.jpg" }}
                      style={styles.packageImages}
                    />
                    <Text
                      style={styles.partyText}
                      numberOfLines={2}
                    >{d.subcategory_name}</Text>
                    <Text
                      style={{ width: 140, color: "gray", fontSize: 14, paddingLeft: 10, paddingRight: 5 }}
                      numberOfLines={2}
                    >{d.subcategory_description}</Text>
                    <Text style={styles.amountText}>£{Number(d.price).toFixed(1)}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>] : null : null
          }
          {
            this.state.itemList.length > 0 ? <SafeAreaView style={styles.crispyFlatlist, { flex: 0, width: "100%", marginTop: 20 }}>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                scrollEventThrottle={50}
                ref={c => (this.hScroller = c)}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ textAlignVertical: "center", paddingLeft: 10, borderBottomWidth: 1, borderColor: "#c9c9c9", borderTopWidth: 1, backgroundColor: "white" }}
                collapsible={false}
              >
                {
                  this.state.searched.map((d, index) => {
                    return <SafeAreaView
                      ref={ref => { this.HPosition[index] = ref }}
                      style={this.state.selectedCategory == d.category_name ? styles.selectedV : styles.unSelectedV}
                      onLayout={(event) => {
                        //this.HPosition[index].measure((x, y, width, height, pageX, pageY) => {
                        //  this.setState({dataHSourceCords: [...this.state.dataHSourceCords, {x: x, pageX: pageX}]})
                        //})
                        if (Platform.OS === "android") {
                          const layout = event.nativeEvent.layout;
                          if (this.state.dataHSourceCords.length != this.state.itemList.length)
                            this.setState({ dataHSourceCords: [...this.state.dataHSourceCords, layout] })
                        }

                      }}
                    >
                      {/* <Text style={styles.popularText}>Most Popular</Text> */}
                      <Text
                        onPress={() => this.hSelectCategory(d.category_name, index)}
                        style={this.state.selectedCategory == d.category_name ? styles.selected : styles.unSelected} >
                        {d.category_name}
                      </Text>
                    </SafeAreaView>
                  })
                }
                <View style={{ width: 300 }}></View>
              </ScrollView>
              <Input
                leftIcon={{ type: "material-community", name: "magnify", color: "#89cff0" }}
                placeholder="Search for a dish"
                placeholderTextColor="rgb(118, 118, 118)"
                inputContainerStyle={styles.inputFiedContainer}
                keyboardType="default"
                inputStyle={{ color: "rgb(118, 118, 118)" }}
                onChangeText={value => { this.setState({ searchText: value }); this.filter(value) }}
              />
            </SafeAreaView> : null
          }

          {
            this.state.searched.map((d, i) => {
              return <View
                style={{ flexDirection: "column", width: "100%" }}
                ref={ref => { this.VPosition[i] = ref }}
                onLayout={(event) => {
                  //this.VPosition[i].measure((x, y, width, height, pageX, pageY) => {
                  // this.setState({dataVSourceCords: [...this.state.dataVSourceCords, {y: y, pageX: pageX}]})
                  // })
                  if (Platform.OS === "android") {
                    const layout = event.nativeEvent.layout;
                    if (this.state.dataVSourceCords.length != this.state.itemList.length)
                      this.setState({ dataVSourceCords: [...this.state.dataVSourceCords, layout] })
                  }

                }}

              >
                <View style={{ backgroundColor: "rgb(240, 240, 240)", borderColor: "white", borderTopWidth: 1, borderBottomWidth: 1 }}>
                  <Text style={styles.drinkText}>{d.category_name}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center", width: "100%" }}>
                  {
                    d.item.map((cuisine, index) => {
                      return [<TouchableOpacity
                        style={{ flexDirection: "row", borderBottomColor: "gray", width: "90%", alignItems: "center" }}
                        onPress={() => {
                          var temp = []
                          if (cuisine.prices)
                            cuisine.prices.map((op, index) => {
                              temp.push({
                                value: op.replace("&nbsp;", " ")
                              })
                            })
                          this.setState({
                            selectedPackage: {
                              photo: cuisine.photo ? cuisine.photo : "https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
                              subcategory_name: cuisine.item_name,
                              price: typeof cuisine.prices[0] !== "undefined" ? cuisine.prices[0].replace("&nbsp;", "  ").replace("£", "  ") : 0,
                              data: temp,
                              prices: cuisine.origin_price,
                              subcategory_description: cuisine.item_description,
                              sub_item: []
                            }
                          }, () => {
                            this.setState({ toCart: cuisine })

                            if (this.state.preorderStatus) {
                              this.RBSheet.open()
                            } else {
                              Alert.alert("GRUBHOUSE", "Currently not accepting orders")
                            }
                          });
                        }}
                      >
                        <View style={{ flex: 1, paddingTop: 10 }}>
                          <Text
                            style={styles.missText, { width: 140 }}
                            numberOfLines={1}
                          >{cuisine.item_name}</Text>
                          <View style={{ marginBottom: 10 }}>
                            <Text
                              style={styles.amountText}
                              numberOfLines={3}
                            >
                              {cuisine.item_description}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.amountText}>{typeof cuisine.prices[0] !== "undefined" ? this.prettyPrice(cuisine.prices) : null}</Text>
                          </View>
                        </View>
                        <Image
                          resizeMode={'cover'}
                          source={{ uri: cuisine.photo }}
                          style={styles.images}
                          transition
                        />
                      </TouchableOpacity>,
                      index + 1 == d.item.length ? null : <View style={styles.divider}></View>
                      ]
                    })
                  }
                </View>
              </View>
            })
          }
          <View style={{ height: 400 }}>
          </View>
        </ScrollView>
        {
          this.props.count.count.basket_total != "£0.00" && <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => {
                if (typeof this.props.count != "undefined" && typeof this.props.count?.cart?.data?.total != "undefined")
                  this.props.navigation.navigate("CustomerBasket", {
                    cart: this.props.count,
                    changePrentCart: this.changeCartRedux,
                    changeParentTotal: this.changeTotalRedux,
                    merchant: this.state.merchant
                  })
              }}
              style={styles.cartContainer}
            >
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>£ {Number(this.props.count?.cart?.data?.total?.subtotal).toFixed(2)}</Text>
                <Divider style={styles.divider1} />
                <Text style={styles.itemText}>{this.props.count.count.basket_count}</Text>
              </View>
              <View style={styles.cartContainer}>
                <Icon
                  name="cart"
                  color="#fff"
                  type="material-community"
                  size={24}
                />
                <Text style={styles.itemText}>VIEW CART</Text>
              </View>
            </TouchableOpacity>
          </View>
        }

      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  count: state.count,
  cart: state.cart
});

const mapDispatchToProps = dispatch => {
  return {
    ChangeCount: (v) => dispatch(changeCount(v)),
    ChangeCart: (v) => dispatch(changeCart(v)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(detailsScreen)

const styles = StyleSheet.create({
  cartContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  divider1: {
    height: 16,
    width: 2,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
    // justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginTop: 10
  },
  cartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  bottomContainer: {
    height: 60,
    backgroundColor: global.COLOR.PRIMARY,
    justifyContent: "center",
  },
  linkContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  rbSheetContainer: {
    padding: 10,
    width: "100%",
    flexDirection: "column",
    alignItems: "center"
  },
  selectedV: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    backgroundColor: global.COLOR.PRIMARY,
    borderRadius: 19,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    marginTop: 18,

  },
  unSelectedV: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    flexDirection: "row",

  },

  selected: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginRight: 8,
    marginLeft: 8
  },
  unSelected: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    color: global.COLOR.PRIMARY,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  crispyFlatlist: {
    marginTop: 10,
    position: "relative",
    marginBottom: -20,
  },
  inputFiedContainer: {
    marginTop: global.CONSTANT.STATUSBAR,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "rgb(232, 232, 232)",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1.30,
    elevation: 1,
    // borderWidth: 1,
    // borderColor: "gray",
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "100%",
    zIndex: 30
    // borderRadius: 20
    // marginLeft: 30
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 260,
    padding: 2,
    marginBottom: 0,
  },
  image: {
    borderRadius: 20,
    resizeMode: "cover",
    height: 200,
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 1,
    borderColor: "#000",
    resizeMode: "cover",
  },
  imageShare: {
    height: 45,
    width: 45,
  },
  icon: {
    color: "#000",
    borderBottomWidth: 0,
    padding: 13,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "gray",

  },
  iconContainer: {
    marginTop: global.CONSTANT.STATUSBAR + 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 0
  },
  heartIcon: {
    color: "red",
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "gray",

    padding: 13
  },
  cardContainer: {
    backgroundColor: "#fff",
    // height: 180,
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: -98,
    shadowColor: "#000",
    shadowOffset: {
      width: 1.5,
      height: 1.5,
    },
    shadowOpacity: 1.2,
    shadowRadius: 3.30,
    elevation: 5,

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
    maxWidth: 70
    // width: 70
  },
  drinkText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlignVertical: "center",
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 15,
    marginBottom: 15
  },
  images: {
    height: 100,
    width: 100,
    borderRadius: 5
  },

  packageImages: {
    height: 140,
    width: 140,
    borderRadius: 8,
    marginRight: 10,
  },
  missText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 10,
    width: "100%",
    marginBottom: 10
  },
  partyText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 10,
    width: 130,
    marginBottom: 10

  },
  addressText: {
    fontSize: 16,
    fontWeight: "normal",
    marginHorizontal: 10,
    color: "gray",
  },
  amountText: {
    fontSize: 14,
    color: "gray",
    marginHorizontal: 10,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "gray",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 6
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
    height: 25,
    width: 22,

  },
});

