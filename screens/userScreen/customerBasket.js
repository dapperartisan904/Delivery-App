import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView, Image, Switch, FlatList, Alert } from "react-native";
import { Icon, Avatar, Divider, Button, ButtonGroup, Tooltip } from "react-native-elements";
import global from "../../global";
import Counter from "react-native-counters";
import { TextInput } from "react-native-paper";
import ButtonToggleGroup from 'react-native-button-toggle-group';
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Polyline, Circle } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import RBSheet from "react-native-raw-bottom-sheet";
import { Card } from 'react-native-shadow-cards';
import { connect } from 'react-redux';
import { changeCount, changeCart } from '../../store/actions/actions';
import { RemoveItem, LoadCart, GetCartCount, goDetailById, gerMerchantMenu, AddDeliveryAddress, GetRecentAddress } from "../../utils/Api"
import AnimatedPolyline from "react-native-maps-animated-polyline";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import DatePicker from '@dietime/react-native-date-picker';
import ScrollPicker from 'react-native-picker-scrollview';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import * as Location from "expo-location";
import { Platform } from "react-native";
import * as Permissions from "expo-permissions";
import Axios from "axios";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class customerBasket extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.myLatLongs = []
    // this.myLatLongs.push(
    //   {
    //     latitude: global.LOCATION.latitude,
    //     longitude: global.LOCATION.longitude,
    //   }
    // )
    if (global.LOCATION.latitude && global.LOCATION.longitude) {
      this.myLatLongs.push(
        {
          latitude: global.LOCATION.latitude,
          longitude: global.LOCATION.longitude,
        }
      )
    }
    this.toolTip = []

    this.interval = ''

    this.completed = 0,
      this.coords = []
    this.anim_coords = []
    this.AddNoteSheet = ""
    this.Timpicker = ''
    this.DeliveryAddress = ''
    this.selectionTime = []
    var newDate = new Date();
    this.selectionYear = [
      2021,
      2022,
      2023,
      2024,
      2025,
      2026,
      2027,
      2028,
      2029,
      2030
    ]
    this.timeIndex = 0
    this.yearIndex = newDate.getFullYear()
    this.yearIndex = this.selectionYear.indexOf(this.yearIndex)
    this.selectionMonth = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ]
    this.monthIndex = newDate.getMonth()
    this.selectionDate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    this.dateIndex = newDate.getDate()
    this.dateString = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]
    var currentDate = new Date()
    this.animPolyCoords = []
    this.x = 0
    this.y = 0
    this.animNum = 0;
    this.setTimer = ''
    this.year = this.selectionYear[this.yearIndex]
    this.month = this.selectionMonth[this.monthIndex]
    this.date = this.selectionDate[this.dateIndex - 1]
    this.dataIndex = this.selectionDate.indexOf(this.date)
    this.total = 0
    this.state = {
      switchValue: true,
      selectedIndex: 0,
      selectedDeliveryType: 0,
      confirmState: true,
      cart: this.props.navigation.state.params.cart,
      merchant: this.props.navigation.state.params.merchant,
      services: [],
      merchant_info: {
        latitude: 0,
        longitude: 0
      },
      user_info: {
        latitude: global.LOCATION.latitude || 51.5287352,
        longitude: global.LOCATION.longitude || -0.3817858
      },
      delviery_time: '',
      note: "",
      date: new Date(),
      schedulePicker: false,
      timePicker: false,
      time: "",
      filterDAtext: "",
      visible: false,
      fullAddress: "",
      buildingName: "",
      houseNumber: '',
      streetAddress: '',
      postCode: '',
      recentAddress: '',
      destinationAddress: '',
      filteredAddress: [],
      selectedDeliveryAddress: "",
      res_tip: 0,
      tip_more: 0,
      discount: {
        discount_amount: 0,
        discount_type: "fixed"
      },
      myLatLongs: [],
      offers: [
        {
          rawOver: 0,
          rawPercent: 0,
          available: []
        }
      ],
      switchTipValue: false,
      total: 0,
      appliedDiscount: 0
    }
  }

  calculateTotal = (TipFlag) => {
    this.setState({ appliedDiscount: 0 })
    this.total = Number(typeof this.state.cart.cart.data.total != "undefined" ? this.state.cart.cart.data.total.subtotal : 0)

    var max = 0
    var flag = false
    var discount_amount = this.state.discount.discount_amount
    if (this.state.discount.discount_type == "fixed amount") {
      if ((this.total - discount_amount) >= 3) {
        this.total = this.total - discount_amount
        this.setState({ appliedDiscount: this.state.appliedDiscount + discount_amount })
      }
    } else {
      this.total = this.total * (100 - discount_amount) / 100
      this.setState({ appliedDiscount: this.state.appliedDiscount + this.total * discount_amount / 100 })
    }
    var maxOffer = 0;
    var maxOfferPercent = 0;
    // console.log(this.state.offers)
    if (this.state.offers.length >= 1) {
      this.state.offers.map((item, index) => {
        if (item.rawPercent != 100) {
          console.warn(this.state.services[this.state.selectedIndex].toLowerCase())
          if (item.available.indexOf(this.state.services[this.state.selectedIndex].toLowerCase()) >= 0) {
            if (maxOfferPercent < Number(item.rawPercent)) {
              max = index
              flag = true
              maxOfferPercent = Number(item.rawPercent)
              maxOffer = this.total * maxOfferPercent / 100
            }
          }
        }
      })
    }

    if (flag) {
      if (typeof this.state.offers[max] != "undefined") {
        this.total = this.total * (100 - maxOfferPercent) / 100
        this.setState({ appliedDiscount: maxOffer })
      }
    }
    if (Number(this.state.res_tip)) {
      this.total = Number(this.total + 0.5 + Number(this.state.res_tip))

    } else {
      this.total = Number(this.total + 0.5)
    }
    if (this.state.services[this.state.selectedIndex] == "Delivery") {
      this.total += Number(this.state.merchant_info.delivery_charges)
    }
    this.setState({ total: this.total })
  }


  checkMinimum = () => {
    if (this.state.services[this.state.selectedIndex] == "Delivery") {
      var minimumOrder = Number(this.state.merchant_info.delivery_minimum_order)
      var serviceType = "delivery"
    } else {
      var minimumOrder = Number(this.state.merchant_info.pickup_minimum_order)
      var serviceType = "pickup"
    }

    if (minimumOrder > this.state.total && minimumOrder > 0) {
      Alert.alert("GRUBHOUSE", "The minimum " + serviceType + " order is £" + minimumOrder)
    } else {
      if (this.state.services[this.state.selectedIndex] == 'Delivery') {
        this.RBSheet.open()
      } else {
        this.confirm()
      }
    }
  }
  confirm = () => {
    var distance = this.getDistance({
      latitude: this.myLatLongs[0].latitude,
      longitude: this.myLatLongs[0].longitude,
    })
    if (this.state.merchant_info.unit != 'miles') {
      distance = distance / 0.621371
    }
    if (this.state.merchant_info.delivery_distance < distance && this.state.services[this.state.selectedIndex] == "Delivery" && this.state.merchant_info.delivery_distance > 0) {
      this.dialogTooFarShow()
      return false
    }
    var orderData = {
      merchant_id: this.state.merchant.id,
      json_details: this.state.cart,
      delivery_type: this.state.services[this.state.selectedIndex],
      delivery_asap: this.state.selectedDeliveryType == 0 ? 1 : null,
      delivery_instruction: this.state.note,
      delivery_at: this.state.user_info,
      subAddress: global.LOCATION.address,
      delivery_date: this.state.date,
      delivery_time: this.state.time,
      delivery_select_time: this.state.delviery_time,
      transaction_type: this.state.services[this.state.selectedIndex].toLowerCase(),
      save_address: 1,
      total_price: this.total,
      from: this.state.merchant_info.complete_address,
      to: this.state.selectedDeliveryAddress ? this.state.selectedDeliveryAddress.address : global.LOCATION.address,
      res_tip: this.state.res_tip,
      tip_more: this.state.tip_more
    }

    this.props.navigation.navigate("Bills", {
      allData: orderData
    })
  }

  toggleTipSwitch = (val) => {
    // console.log( "tip mode")
    // console.log(this.state.merchant_info.enabled_tip)
    if (this.state.merchant_info.enabled_tip != "2") {
      Alert.alert("GRUBHOUSE", "Restaurant Tip is disabled now")
      return false
    }
    this.setState({
      switchTipValue: this.state.switchTipValue ? false : true,
    }, () => {
      if (!this.state.switchTipValue) {
        this.setState({ res_tip: 0 }, () => {
          this.calculateTotal(true)
        })
      }
      if (this.state.switchTipValue) {
        this.TipSheet.open()
      }
    });

  };
  updateIndex = () => {
    this.setState({ selectedIndex: this.state.selectedIndex == 0 ? 1 : 0 }, () => {
      LoadCart(this.state.merchant.id, this.state.services[this.state.selectedIndex]).then(res => {
        this.props.navigation.state.params.changePrentCart(res)
        this.setState({
          cart: {
            cart: res
          }
        })
      })
      this.calculateTotal(false)
    })
  }
  async componentDidMount() {
    this.total = 0
    this.setState({ tip_more: 0, res_tip: 0 })
    // this.toggleTipSwitch(this.props.navigation.state.params.cart.cart.merchant_settings.enabled_tip ==2?true:false)

    GetRecentAddress().then((res) => {
      // console.log(res.date, "in comdidmount")
      // this.setState({recentAddress: res, filteredAddress:res.data})
      // console.log(res, "adatadadffsd")
    })
    var temp = []
    for (var i = 0; i < 24; i++) {
      if (i < 10) {
        temp.push("0" + i + ":00-0" + i + ":30")
        if ((i + 1 > 9)) {
          temp.push("0" + i + ":30-" + (i + 1) + ":00")
        } else {
          temp.push("0" + i + ":30-0" + (i + 1) + ":00")
        }
      } else {
        temp.push(i + ":00-" + i + ":30")
        temp.push(i + ":30-" + (i + 1) + ":00")
      }
    }
    this.selectionTime = temp
    this.setState({ time: temp[0] })
    // console.log(this.state.cart)
    var temp = []
    for (var i in this.props.navigation.state.params.cart.cart.services) {
      temp.push(this.props.navigation.state.params.cart.cart.services[i])
    }
    // console.log(this.props.navigation.state.params.cart.cart.services)
    this.setState({ services: temp })
    // console.log(this.state.merchant)

    var data = new FormData();
    data.append("api_key", " admin@1474?");
    data.append("client_id", global.USER.details.client_info.client_id)
    data.append("merchant_id", this.state.merchant.id)
    // console.log(id)
    const DATA = await Axios({
      method: "post",
      url: "GetRestaurantInfoSelf",
      data,
      validateStatus: (status) => {
        return true;
      },
    }).then(
      function (response) {
        if (response.data.details) {

          this.setState({ merchant_info: response.data.details }, () => {
            this.reSelectTime()
          })
          this.myLatLongs.push({
            latitude: Number(response.data.details.latitude ? response.data.details.latitude : 0),
            longitude: Number(response.data.details.lontitude ? response.data.details.lontitude : 0),
          })
          this.setState({
            currentLocation:
            {
              latitude: Number(response.data.details.latitude ? response.data.details.latitude : 0),
              longitude: Number(response.data.details.lontitude ? response.data.details.lontitude : 0),
            }
          })
          this.mapRef.fitToCoordinates(this.myLatLongs, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: true })
          this.setState({ myLatLongs: this.myLatLongs })
          // this.animNum = 0
          // this.animPolyCoords = []
          // this.animatedPoly(this.myLatLongs)
          // this.animatePolyline();
          // this._animate(this.myLatLongs);
          var total = (this.state.cart.cart.data.total.total + Number(response.data.details.delivery_charges) + 0.5) % 1
          var offers = typeof response.data.details.offers != "undefined" ? response.data.details.offers : false
          var discounts = typeof response.data.details.discount != "undefined" ? response.data.details.discount : false

          var max = 0
          var flag = false
          if (discounts) {
            this.setState({ discount: discounts[max] }, () => {
              this.calculateTotal(false)
            })
          }
          max = 0
          flag = false
          if (offers) {
            offers.map((item, index) => {
              if (item.rawPercent != 100) {
                if (item.available.indexOf(this.state.services[this.state.selectedIndex].toLowerCase()) >= 0) {
                  if (offers[max].available.indexOf(this.state.services[this.state.selectedIndex].toLowerCase()) >= 0) {
                    if (offers[max].rawOver <= item.rawOver && this.total >= item.rawOver) {
                      max = index
                      flag = true
                    }
                  } else if (item.available.indexOf(this.state.services[this.state.selectedIndex].toLowerCase()) >= 0) {
                    max = index
                    flag = true
                  }

                }
              }
            })
          }
          this.setState({ offer: offers[max], offers: offers }, () => {
            this.calculateTotal(false)
          })
          // console.log(offers[max], "max offer", this.state.services[this.state.selectedIndex].toLowerCase())
        } else {
          alert("Error")
        }
      }.bind(this)
    );
    // console.log(this.myLatLongs)
    // console.log(this.state.cart.cart.tip_list)
    for (var i in this.state.cart.cart.tip_list) {
      // console.log(this.state.cart.cart.tip_list[i])
    }


  }
  _animate = () => {

  }
  dialogHide = () => {
    this.setState({
      visible: false,
    })
  }
  dialogShow = () => {
    this.DeliveryAddress.close()
    this.setState({
      visible: true,
    })
  }


  Tiplist = () => {
    // console.log(this.state.cart.cart.tip_list)
    var temp = []
    for (var i in this.state.cart.cart.tip_list) {
      if (this.state.cart.cart.tip_list[i] == "none") {
        continue
      }
      temp.push(<Card
        style={{ width: 100, margin: 10 }}
        onPress={() => { console.log(this.state.cart.cart.tip_list[i]) }}
      >
        <Text style={{ fontSize: 18, color: "gray", textAlign: "center" }} onPress={() => { console.log(this.state.cart.cart.tip_list[i]) }}>{this.state.cart.cart.tip_list[i]}</Text>
        <Text style={{ fontSize: 18, color: "gray", textAlign: "center" }} onPress={() => { console.log(2) }}>+ Add</Text>
      </Card>)
    }
    return temp
  }

  removeItemFromCart = async (item) => {
    await RemoveItem(this.state.merchant.id, item).then(res => {
      // console.log(res)
    })
    LoadCart(this.state.merchant.id).then(res => {
      // console.log(res, "load cart when remove item.")
      if (typeof res.data == "undefined") {
        this.props.navigation.navigate("DetailsScreen")
        return false
      }
      this.props.navigation.state.params.changePrentCart(res)
      this.setState({
        cart: {
          cart: res
        }
      })
    })
    GetCartCount(this.state.merchant.id).then(res => {
      // this.changeTotalRedux(res)
      this.props.navigation.state.params.changeParentTotal(res)
      // this.setState({cart: {
      //   total: res
      // }})
      // this.props.dispatch(changeCount(res))
    })
  }

  onChangeDateTime = (v) => {
    // console.log(v)
  }

  filterDeliveryAddress = async () => {
    // var searchTxt = v.toLowerCase()
    // this.setState({filterDAtext: v})
    // console.log(v)
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // geolocation.requestAuthorization()
    if (status !== "granted") {
      return false
    }
    if (Platform.OS == "ios") {

      Axios.defaults.baseURL = "";
      await Axios({
        method: "get",
        url: "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + this.state.filterDAtext + "|country:UK&key=AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0",
      }).then(res => {
        // console.log(res.data.results)
        var temp = []
        if (res.data.results.length == 0) {
          // alert("Post code is incorrect, Please insert the valide post code")
          this.setState({ filteredAddress: [] })
          // console.log("remove filtered")
          return false
        }
        res.data.results.map((add, index) => {
          temp.push({
            address: add.formatted_address,
            latitude: add.geometry.location.lat,
            longitude: add.geometry.location.lng,
            route: add.address_components[1].short_name,
            street: add.address_components[2].short_name,
            city: add.address_components[3].short_name,
            country_code: add.address_components[6].short_name,
            post_code: add.address_components[0].short_name,
          })
        })
        // console.log(temp, "temp")
        this.setState({ filteredAddress: temp })
      });

      Axios.defaults.baseURL = "http://grubhouse.co.uk/mobileappv2/api/";
    } else {
      Location.setApiKey("")
      Axios.defaults.baseURL = "";
      await Axios({
        method: "get",
        url: "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + this.state.filterDAtext + "|country:UK&key=AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0",
      }).then(res => {
        // console.log(res.data.results)
        if (res.data.results.length == 0) {
          // alert("Post code is incorrect, Please insert the valide post code")
          this.setState({ filteredAddress: [] })
          return false
        }
        var temp = []
        res.data.results.map((add, index) => {
          temp.push({
            address: add.formatted_address,
            latitude: add.geometry.location.lat,
            longitude: add.geometry.location.lng,
            route: add.address_components[1].short_name,
            street: add.address_components[2].short_name,
            city: add.address_components[3].short_name,
            country_code: add.address_components[6].short_name,
            post_code: add.address_components[0].short_name,
          })
        })
        // console.log(temp, "temp")
        this.setState({ filteredAddress: temp })
      });

      Axios.defaults.baseURL = "http://grubhouse.co.uk/mobileappv2/api/";
    }

  }

  addDeliveryAddress = async () => {

    if (!this.state.postCode) {
      Alert.alert("GRUBHOUSE", "Please insert the post code")
      return false
    }
    if (!this.state.houseNumber) {
      Alert.alert("GRUBHOUSE", "Please insert house number")
      return false
    }
    if (!this.state.buildingName) {
      Alert.alert("GRUBHOUSE", "Please insert building name")
      return false
    }
    var query = this.state.houseNumber + "+" + this.state.buildingName + "+" + this.state.streetAddress + "+" + this.state.postCode + "UK"
    // console.log(query)

    Location.setApiKey("")
    Axios.defaults.baseURL = "";
    await Axios({
      method: "get",
      url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&radius=500&key=AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0",
    }).then(res => {
      // console.log(res.data.results)
      var temp = []
      res.data.results.map((add, index) => {
        temp.push({
          address: add.formatted_address,
          latitude: add.geometry.location.lat,
          longitude: add.geometry.location.lng,
        })
      })
      // console.log(temp, "temp")
      if (temp.length == 0) {
        Alert.alert("GRUBHOUSE", "Please insert valid address!")
        return false
      }
      this.dialogHide()
      this.setState({ selectedDeliveryAddress: temp[0] })
      this.selectDeliveryAddress(temp[0])
    }).catch(err => {
      alert("There was a net issue, Please try again.")
    });
    Axios.defaults.baseURL = "http://grubhouse.co.uk/mobileappv2/api/";
  }

  selectDeliveryAddress = async (add) => {
    // console.log(this.state.merchant_info, "merchant")
    this.setState({ selectedDeliveryAddress: add })
    this.myLatLongs = []
    this.myLatLongs.push({
      latitude: add.latitude,
      longitude: add.longitude,
    })
    var distance = this.getDistance({
      latitude: add.latitude,
      longitude: add.longitude,
    })
    if (this.state.merchant_info.unit != 'miles') {
      distance = distance / 0.621371
    }
    // console.log(distance, this.state.merchant_info.delivery_distance, "distance")
    if (this.state.merchant_info.delivery_distance < distance && this.state.services[this.state.selectedIndex] == "Delivery" && this.state.merchant_info.delivery_distance > 0) {
      this.dialogTooFarShow()
    }
    // console.log(distance)
    this.setState({
      user_info: {
        latitude: add.latitude,
        longitude: add.longitude,
      }
    })
    this.myLatLongs.push({
      latitude: Number(this.state.merchant_info.latitude ? this.state.merchant_info.latitude : 0),
      longitude: Number(this.state.merchant_info.lontitude ? this.state.merchant_info.lontitude : 0),
    })
    this.mapRef.fitToCoordinates(this.myLatLongs, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: true })
    this.setState({ myLatLongs: this.myLatLongs })
  }
  animatedPoly = async (coords) => {

    this.x = (coords[0].latitude - coords[1].latitude) / 3;
    this.y = (coords[0].longitude - coords[1].longitude) / 3;
    this.animPolyCoords = []
    this.animPolyCoords.push(coords[0])
    // console.log(coords, "coords+========================================================================", this.y, this.y)
    for (var i = 0; i < 3; i++) {
      this.animPolyCoords.push({
        latitude: this.animPolyCoords[i].latitude - this.x * i,
        longitude: this.animPolyCoords[i].longitude - this.y * i
      })
    }

    // console.log(this.animPolyCoords, "temp data")
    // console.log(this.animPolyCoords, "poly coords")
  }

  setFullAddress = async (v) => {
    let location = await Location.geocodeAsync(v)
    let address = await Location.reverseGeocodeAsync({
      latitude: location[0].latitude,
      longitude: location[0].longitude
    })

    if (address.length) {
      this.setState({
        postCode: address[0].postalCode,
        streetAddress: address[0].street,
        city: address[0].city,
        countryCode: address[0].isoCountryCode
      })
      // console.log(address[0])
    }
  }


  calculatorTip = (per) => {
    var result = this.state.tip_more
    var tip_result = Number(Number(result) + Number(this.state.res_tip) + Number(this.state.res_tip) * Number(per))
    this.setState({ tip_more: tip_result.toFixed(2) })
    this.calculateTotal(this.state.switchTipValue)
  }
  rad = (x) => {
    return x * Math.PI / 180;
  };
  getDistance = (rest) => {
    // latitude: Number(this.state.merchant_info.latitude?this.state.merchant_info.latitude:0),
    // longitude: Number(this.state.merchant_info.lontitude?this.state.merchant_info.lontitude:0),
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(rest.latitude - Number(this.state.currentLocation.latitude));
    // console.log(dLat)
    dLat = isNaN(dLat) ? 0 : dLat;
    var dLong = this.rad(rest.lontitude - Number(this.state.currentLocation.longitude));
    dLong = isNaN(dLong) ? 0 : dLong;
    // console.log(this.rad(rest.lontitude - Number(this.state.currentLocation.longitude)))
    // console.log(dLong)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(rest.latitude)) * Math.cos(this.rad(rest.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    // console.log(a)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // console.log(c)
    var d = R * c;
    // console.log(d)
    var distance = (d / 1000).toFixed(1)
    return distance * 0.621371
  }
  dialogTooFarHide = () => {
    this.setState({ visibleTooFar: false })
  }

  dialogTooFarShow = () => {
    this.setState({ visibleTooFar: true })
  }
  updateSchedulerTime = (v) => {
    var cDate = new Date(v)
    var day = cDate.getDay()
    // console.log(day, "day of week")
  }
  selectDate = () => {
    var date = new Date(this.month + "/" + this.date + "/" + this.year)
    // console.log(this.month + "/" + this.date + "/" + this.year)
    var dayWeek = date.getDay()
    var selectedTime = this.state.time.split("-")
    var openTimeF = this.state.merchant_info.stores_open_starts[this.dateString[dayWeek]]
    var closeTimeF = this.state.merchant_info.stores_open_ends[this.dateString[dayWeek]]
    // console.log(selectedTime, openTime, closeTime)
    if (openTimeF) {
      var openTime = new Date(this.year, this.month - 1, this.date, openTimeF.split(":")[0], openTimeF.split(":")[1])
      var closeTime = new Date(this.year, this.month - 1, this.date, closeTimeF.split(":")[0], closeTimeF.split(":")[1])
      var sOpenTime = new Date(this.year, this.month - 1, this.date, selectedTime[0].split(":")[0], selectedTime[0].split(":")[1])
      var cOpenTime = new Date(this.year, this.month - 1, this.date, selectedTime[1].split(":")[0], selectedTime[1].split(":")[1])
      if (openTime > closeTime) {
        var temp = closeTime
        closeTime = openTime
        openTime = temp
        temp = openTimeF
        openTimeF = closeTimeF
        closeTimeF = temp
      }
      openTime = openTime.getTime()
      closeTime = closeTime.getTime()
      cOpenTime = cOpenTime.getTime()
      sOpenTime = sOpenTime.getTime()
      // console.log(sOpenTime + 'sopen', openTime + "open", cOpenTime + "copen", closeTime + "close")
      if (sOpenTime < openTime || cOpenTime > closeTime) {
        // console.log("it is not valid")
        Alert.alert("GRUBHOUSE", "Please select another time, At that day we are open from " + openTimeF + " to " + closeTimeF)
      } else {
        this.setState({ delviery_time: sOpenTime })
        this.Timpicker.close();
      }
    } else {
      Alert.alert("GRUBHOUSE", "Please check our opening time")
    }
  }

  reSelectTime = () => {
    var date = new Date(this.month + "/" + this.date + "/" + this.year)
    var dayWeek = date.getDay()
    // console.log(this.state.time)
    // var selectedTime = this.state.time.split("-")
    // console.log(this.state.merchant_info.stores_open_starts, this.state.merchant_info.stores_open_ends)
    var openTime = typeof this.state.merchant_info.stores_open_starts[this.dateString[dayWeek]] != "undefined" ? this.state.merchant_info.stores_open_starts[this.dateString[dayWeek]] : 0
    var closeTime = typeof this.state.merchant_info.stores_open_ends[this.dateString[dayWeek]] != "undefined" ? this.state.merchant_info.stores_open_ends[this.dateString[dayWeek]] : 0

    if (openTime) {
      var temp = []
      // console.log(Number(openTime.split(":")[0]), Number(closeTime.split(":")[0]), "time log")
      var start = Number(openTime.split(":")[0])
      var end = Number(closeTime.split(":")[0])
      if (start > end) {
        // console.log("start > end", start + ">" + end)
        start = Number(closeTime.split(":")[0])
        end = Number(openTime.split(":")[0])
      }
      // console.log(start, end, 'time log again.')
      for (var i = start; i <= end; i++) {
        // console.log(i, "time")
        if (i < 10) {
          temp.push("0" + i + ":00-0" + i + ":30")
          if ((i + 1 > 9)) {
            temp.push("0" + i + ":30-" + (i + 1) + ":00")
          } else {
            temp.push("0" + i + ":30-0" + (i + 1) + ":00")
          }
        } else {
          temp.push(i + ":00-" + i + ":30")
          temp.push(i + ":30-" + (i + 1) + ":00")
        }
      }
      this.selectionTime = temp
      this.setState({ time: temp[0] })
    }
    else {
      this.date = this.date + 1
      if (this.date > 31) this.date = 1

      var dayTemp = []
      this.selectionDate.map((d, index) => {
        var tempDate = new Date(this.month + "/" + d + "/" + this.year)
        var tempDayWeek = tempDate.getDay()
        // console.log(this.state.time)
        // var selectedTime = this.state.time.split("-")
        var tempOpenTime = typeof this.state.merchant_info.stores_open_starts[this.dateString[tempDayWeek]] != "undefined" ? this.state.merchant_info.stores_open_starts[this.dateString[tempDayWeek]] : 0
        var tempCloseTime = typeof this.state.merchant_info.stores_open_ends[this.dateString[tempDayWeek]] != "undefined" ? this.state.merchant_info.stores_open_ends[this.dateString[tempDayWeek]] : 0
        if (tempOpenTime) {
          dayTemp.push(d)
        }
      })
      // console.log(dayTemp)
      this.selectionDate = dayTemp
      this.reSelectTime()

    }
  }

  addNewItem = (id) => {
    // console.log(id)
    goDetailById(id).then(rest => {
      var merchant = {
        id: rest.merchant_id,
        image: rest.logo != "" ? "https://www.grubhouse.co.uk/upload/" + rest.logo : "https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
        name: rest.restaurant_name,
        address: rest.street,
        review: rest.ratings == null ? "0" : Number(rest.ratings).toFixed(2),
        delivery_time: rest.delivery_estimation == "" ? "15~25min" : rest.delivery_estimation,
        type: "Breakfast and Brunch",
        amount: (rest.delivery_charges * 1).toFixed(2),
        distance: this.getDistance(rest.latitude, rest.lontitude),
        open_time: "5:00am",
        close_time: "10:00pm",
        service: rest.service,
        rating: {
          ratings: rest.ratings,
          votes: 0
        },
      }
      gerMerchantMenu(id).then((response) => {
        this.props.navigation.navigate("DetailsScreen", {
          merchant: merchant,
          data: response.details
        })
      })
    })
  }
  render() {
    return (
      // background container
      <SafeAreaView style={styles.bgContainer}>
        {/* upper Container */}
        <Dialog
          width={global.CONSTANT.WIDTH - 20}
          // height={global.CONSTANT.HEIGHT-100}
          visible={this.state.visibleTooFar}
          onTouchOutside={() => this.dialogTooFarHide()}
        >
          <DialogContent
            style={{ marginTop: 'auto', padding: 5 }}
          >
            <View style={{ width: "80%", alignSelf: "center", paddingVertical: 10, justifyContent: "center" }}>
              <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                <View>
                  <Image
                    source={global.ASSETS.DELIVERY}
                    style={{ width: 100, height: 100, resizeMode: "cover" }}
                  />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", }}
                  >That restaurant's too far away</Text>
                </View>
                <Divider style={{ width: "100%", height: 1 }} />
                <View style={{ marginVertical: 20, height: 100, width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 16 }}
                  >{"They don't deliver to \"" + this.state.selectedDeliveryAddress.address + "\", but it's easy to find one that does"}</Text>
                </View>
              </View>
              <Button
                containerStyle={{ marginBottom: 5 }}
                onPress={() => {
                  this.dialogTooFarHide()
                  this.props.navigation.navigate("Nearby")
                }}
                title={"Nearby Restaurants"}
              />
              <Button
                buttonStyle={{ backgroundColor: "white" }}
                titleStyle={{ color: global.COLOR.PRIMARY }}
                containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
                onPress={() => {
                  this.dialogTooFarHide()
                  this.DeliveryAddress.open()
                }}
                title={"Enter New Address"}
              />
            </View>
          </DialogContent>
        </Dialog>
        <Dialog
          width={global.CONSTANT.WIDTH - 20}
          // height={global.CONSTANT.HEIGHT-100}
          visible={this.state.visible}
          onTouchOutside={() => this.dialogHide()}
          footer={
            <DialogFooter>
              <DialogButton
                text="Add"
                style={{ borderColor: "gray", borderRightWidth: 1 }}
                onPress={() => this.addDeliveryAddress()}
                textStyle={{ fontSize: 14, color: global.COLOR.PRIMARY }}
              >
              </DialogButton>
              <DialogButton
                text="Cancel"
                onPress={() => this.dialogHide()}
                textStyle={{ fontSize: 14, color: "gray" }}
              >
              </DialogButton>

            </DialogFooter>
          }
        >
          <DialogContent
            style={{ marginTop: 'auto', padding: 5, borderColor: "gray", borderBottomWidth: 1 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                marginRight: 50,
                width: "100%"
              }}
            >
              <View style={{ width: "50%", height: "80%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>Address</Text>
              </View>
              <View style={{ width: "20%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >
                <Text>* Required</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                width: "100%",
                position: "relative"
              }}
            >
              <TouchableOpacity style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >
                <TextInput
                  placeholder='PostCode'
                  onChangeText={(v) => { this.setState({ postCode: v }) }}
                  style={{ width: "100%", height: 50, fontSize: 16 }}
                />
                <Text style={{ position: "absolute", right: 5, top: 15 }}>*</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                width: "100%"
              }}
            >
              <TouchableOpacity style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >
                <TextInput
                  placeholder='* Flat or house number'
                  onChangeText={(v) => { this.setState({ houseNumber: v }) }}
                  style={{ width: "100%", height: 50, fontSize: 16 }}
                />
                <Text style={{ position: "absolute", right: 5, top: 15 }}>*</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                width: "100%"
              }}
            >
              <TouchableOpacity style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >
                <TextInput
                  placeholder='* Street address'
                  onChangeText={(v) => { this.setState({ streetAddress: v }) }}
                  style={{ width: "100%", height: 50, fontSize: 16 }}
                />
                <Text style={{ position: "absolute", right: 5, top: 15 }}>*</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                width: "100%"
              }}
            >
              <TouchableOpacity style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >
                <TextInput
                  placeholder='* Area Name'
                  onChangeText={(v) => { this.setState({ buildingName: v }) }}
                  style={{ width: "100%", height: 50, fontSize: 16 }}
                />
                <Text style={{ position: "absolute", right: 5, top: 15 }}>*</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                width: "100%",
                position: "relative"
              }}
            >
              <TouchableOpacity style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >

                <TextInput
                  placeholder='Full Address'
                  onChangeText={(v) => { this.setState({ fullAddress: v }); this.setFullAddress(v) }}
                  style={{ width: "100%", height: 50, fontSize: 16 }}
                />
                <Text style={{ position: "absolute", right: 5, top: 15 }}>*</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
        <RBSheet
          ref={ref => {
            this.PromoSheet = ref;
          }}
          height={300}
          duration={250}
        >
          <View style={{ height: "100%", width: "80%", alignSelf: "center", paddingVertical: 10, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", }}
                >Please insert promo code</Text>
              </View>
              <Divider style={{ width: "100%", height: 1 }} />
              <View style={{ marginVertical: 20, height: 100, width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <TextInput
                  placeholder='Enter Promo Code'
                  onChangeText={(v) => { this.setState({ promo: v }) }}
                  style={{ width: "90%", height: 40 }}
                  value={this.state.promo}
                />
              </View>
            </View>
            <Button
              containerStyle={{ marginBottom: 5 }}
              onPress={() => {
                this.PromoSheet.close();
              }}
              title={"Add"}
            />
            <Button
              buttonStyle={{ backgroundColor: "white" }}
              titleStyle={{ color: global.COLOR.PRIMARY }}
              containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
              onPress={() => {
                this.PromoSheet.close();
                this.setState({ promo: "" })
              }}
              title={"Clear"}
            />
          </View>
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.AddNoteSheet = ref;
          }}
          height={300}
          duration={250}
        >
          <View style={{ height: "100%", width: "80%", alignSelf: "center", paddingVertical: 10, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", }}
                >Please insert note</Text>
              </View>
              <Divider style={{ width: "100%", height: 1 }} />
              <View style={{ marginVertical: 20, height: 100, width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <TextInput
                  placeholder='Enter Note'
                  onChangeText={(v) => { this.setState({ note: v }) }}
                  style={{ width: "90%", height: "100%" }}
                  value={this.state.note}
                />
              </View>
            </View>
            <Button
              containerStyle={{ marginBottom: 5 }}
              onPress={() => {
                this.AddNoteSheet.close();
              }}
              title={"Add"}
            />
            <Button
              buttonStyle={{ backgroundColor: "white" }}
              titleStyle={{ color: global.COLOR.PRIMARY }}
              containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
              onPress={() => {
                this.AddNoteSheet.close();
                this.setState({ note: "" })
              }}
              title={"Clear"}
            />
          </View>
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.Timpicker = ref;
          }}
          height={400}
          duration={250}
          closeOnPressMask={false}
          closeOnPressBack={false}
        >
          <View style={{ height: "100%", width: "100%", alignSelf: "center", justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20, width: "100%", textAlign: "center" }}>Please select date and time</Text>
            <View style={{ height: 200, width: "100%", flexDirection: "row", alignItems: "center" }}>
              {/* <DatePicker
                value={new Date()}
                style={{width: "30%"}}
                onChange={(v)=>{
                  var Sdate = new Date(v).toDateString()
                  this.setState({date: Sdate})
                }}
              /> */}
              <View style={{ width: "60%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <ScrollPicker
                  ref={(sp) => { this.sp = sp }}
                  style={{ width: "100%" }}
                  dataSource={this.selectionDate}
                  selectedIndex={this.selectionDate.indexOf(this.date)}
                  itemHeight={50}
                  wrapperHeight={100}
                  wrapperColor={'#ffffff'}
                  highlightColor={'#d8d8d8'}
                  renderItem={(data, index, isSelected) => {
                    return (
                      <View>
                        <Text style={{ fontSize: 18, color: index == this.dateIndex - 1 ? "black" : "gray" }} >{data}</Text>
                      </View>
                    )
                  }}
                  onValueChange={(data, selectedIndex) => {
                    this.date = data
                    // console.log(data)
                    this.dateIndex = this.selectionDate.indexOf(data) + 1
                    this.reSelectTime()
                  }}
                />

                <ScrollPicker
                  ref={(sp) => { this.sp = sp }}
                  style={{ width: "100%", paddingTop: 70 }}
                  dataSource={this.selectionMonth}
                  selectedIndex={this.monthIndex}
                  itemHeight={50}
                  wrapperHeight={150}
                  wrapperColor={'#ffffff'}
                  highlightColor={'black'}
                  renderItem={(data, index, isSelected) => {
                    return (
                      <View>
                        <Text style={{ fontSize: 18, color: index == this.monthIndex ? "black" : "gray" }}  >{data}</Text>
                      </View>
                    )
                  }}
                  onValueChange={(data, selectedIndex) => {
                    this.month = data
                    this.monthIndex = this.selectionMonth.indexOf(data)
                    this.reSelectTime()
                  }}
                />
                <ScrollPicker
                  ref={(sp) => { this.sp = sp }}
                  style={{ width: "100%" }}
                  dataSource={this.selectionYear}
                  selectedIndex={this.yearIndex}
                  itemHeight={50}
                  wrapperHeight={150}
                  wrapperColor={'#ffffff'}
                  highlightColor={'#d8d8d8'}
                  renderItem={(data, index, isSelected) => {
                    return (
                      <View>
                        <Text style={{ fontSize: 18, color: index == this.yearIndex ? "black" : "gray" }} >{data}</Text>
                      </View>
                    )
                  }}
                  onValueChange={(data, selectedIndex) => {
                    // console.log(data)
                    this.year = data
                    this.yearIndex = this.selectionYear.indexOf(data)
                    this.reSelectTime()
                  }}
                />
              </View>
              <View style={{ width: "40%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <ScrollPicker
                  ref={(sp) => { this.sp = sp }}
                  style={{ width: "100%" }}
                  dataSource={this.selectionTime}
                  selectedIndex={this.timeIndex}
                  itemHeight={50}
                  wrapperHeight={150}
                  wrapperColor={'#ffffff'}
                  highlightColor={'#d8d8d8'}
                  renderItem={(data, index, isSelected) => {
                    return (
                      <View>
                        <Text style={{ color: index == this.timeIndex ? "black" : "gray" }}>{data}</Text>
                      </View>
                    )
                  }}
                  onValueChange={(data, selectedIndex) => {
                    // console.log(data, selectedIndex)
                    this.timeIndex = this.selectionTime.indexOf(data)
                    this.setState({ time: data })
                  }}
                />
              </View>



            </View>

            <Button
              containerStyle={{ marginBottom: 5 }}
              onPress={() => {
                this.selectDate()
              }}
              title={"OK"}
            />
            <Button
              buttonStyle={{ backgroundColor: "white" }}
              titleStyle={{ color: global.COLOR.PRIMARY }}
              containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
              onPress={() => {
                this.Timpicker.close();
                this.setState({ selectedDeliveryType: 0 })
                // this.setState({note: ""})
              }}
              title={"Cancel"}
            />
          </View>
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.DeliveryAddress = ref;
          }}
          height={global.CONSTANT.HEIGHT - 100}
          width={global.CONSTANT.WIDTH}
          duration={250}
          closeOnDragDown
          closeOnPressMask={true}
          closeOnPressBack={true}
        >
          <View style={{ height: "100%", width: "100%", alignSelf: "flex-end", paddingVertical: 10, justifyContent: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                marginRight: 50,
                width: "100%"
              }}
            >
              <TouchableOpacity style={{ width: "10%", height: 60, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
              >
                <Icon
                  name="magnify"
                  color="#013220"
                  type="material-community"
                  size={24}
                />
              </TouchableOpacity>
              <View style={{ width: "90%", height: 60, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", position: "relative" }}>
                <View style={{ position: "absolute", zIndex: 20, top: 0, height: 200 }}
                >
                  {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
                  <GooglePlacesAutocomplete
                    placeholder='Search Delivery Address'
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      // console.log(data, details);
                      // console.log("maps.googleapis.com/maps/api/geocode/json?place_id="+data.place_id+"&key="+(Platform.OS == "ios"?"AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0":"AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"))
                      Axios.defaults.baseURL = "";
                      Axios({
                        method: "get",
                        url: "https://maps.googleapis.com/maps/api/geocode/json?place_id=" + data.place_id + "&key=" + (Platform.OS == "ios" ? "AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0" : "AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"),
                      }).then(res => {
                        // console.log(res.data.results)
                        var temp = []
                        if (res.data.results.length == 0) {

                          return false
                        }
                        var add = {
                          address: data.description,
                          latitude: res.data.results[0].geometry.location.lat,
                          longitude: res.data.results[0].geometry.location.lng,
                          route: "",
                          street: data.terms[0].value,
                          city: data.terms[1].value,
                          country_code: data.terms[3].value,
                          post_code: data.terms[2].value,
                        }
                        // console.log(add)
                        this.selectDeliveryAddress(add)
                        this.DeliveryAddress.close()
                      });

                      Axios.defaults.baseURL = "http://grubhouse.co.uk/mobileappv2/api/";
                    }}
                    query={{
                      key: "AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0",
                      language: 'en',
                      types: ["geocode", "address", "establishment"]
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 60,
                marginRight: 50,
                width: "100%",
                borderColor: "gray",
                borderBottomWidth: 1
              }}
            >
              <TouchableOpacity style={{ width: "10%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                onPress={() => { this.dialogShow() }}
              >
                <Icon
                  name="plus-circle-outline"
                  color="#013220"
                  type="material-community"
                  size={24}
                />
              </TouchableOpacity>
              <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
              >
                <Text style={{ fontSize: 16, color: "gray" }}>Add new address manually</Text>
                {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
              </View>
            </View>
            <ScrollView style={{ height: "auto" }}>
              {
                this.state.filteredAddress.map((add, index) => {
                  return <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                      height: 60,
                      marginRight: 50,
                    }}
                  >
                    <View style={{ width: "20%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                      <Icon
                        name="map-marker"
                        color="gray"
                        type="material-community"
                        size={24}
                      />
                    </View>
                    <TouchableOpacity style={{ width: "80%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                      onPress={() => {
                        this.selectDeliveryAddress(add)
                        this.DeliveryAddress.close()
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "gray" }}>{add.address}</Text>
                      {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
                    </TouchableOpacity>

                    <View style={{ width: "10%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                    >
                      {/* <Icon
                                name="check"
                                color="gray"
                                type="material-community"
                                size={24}
                                // iconStyle={styles.icon}
                              /> */}
                    </View>
                  </View>
                })
              }
              {
                this.state.filteredAddress.length == 0 ? <Text style={{ fontSize: 16, color: "gray", paddingLeft: 50 }}>There is no result</Text> : null
              }
            </ScrollView>

          </View>
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.TipSheet = ref;
          }}
          height={300}
          duration={250}
        >
          <View style={{ height: "100%", width: "80%", alignSelf: "center", paddingVertical: 10, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", }}
                >Please insert Tip</Text>
              </View>
              <Divider style={{ width: "100%", height: 1 }} />
              <View style={{ marginVertical: 20, height: 100, width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <TextInput
                  placeholder='Enter Tip'
                  onChangeText={(v) => { this.setState({ res_tip: v }) }}
                  style={{ width: "90%", height: 40 }}
                  value={this.state.res_tip}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <Button
              containerStyle={{ marginBottom: 5 }}
              onPress={() => {
                this.TipSheet.close();
                this.calculateTotal(true)
              }}
              title={"Okay"}
            />
            <Button
              buttonStyle={{ backgroundColor: "white" }}
              titleStyle={{ color: global.COLOR.PRIMARY }}
              containerStyle={{ marginBottom: 15, borderColor: global.COLOR.PRIMARY, borderWidth: 1 }}
              onPress={() => {
                this.TipSheet.close();
                this.setState({ res_tip: 0 }, () => {
                  this.calculateTotal(true)
                })
                this.toggleTipSwitch()

              }}
              title={"Cancel"}
            />
          </View>
        </RBSheet>
        <View style={Platform.OS == "ios" ? styles.upperContainer : styles.androidContainer}>
          <TouchableOpacity style={styles.orderContainer}>
            <Text style={styles.orderText}>CART</Text>
            <Icon
              name="cart"
              color={"grey"}
              type="material-community"
              size={28}
              iconStyle={{ marginTop: 4 }}
            />
          </TouchableOpacity>
          <View style={styles.toggleContainer}>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={this.state.selectedIndex}
              buttonStyle={{ borderRadius: 20 }}
              innerBorderStyle={{ width: 0 }}
              // disabledSelectedStyle={{borderRadius: 20}}
              disabledStyle={{ borderRadius: 20 }}
              buttons={this.state.services}
              containerStyle={{ borderRadius: 20, width: "60%" }}
            />
          </View>

          <ScrollView>
            {/* <MapView
              ref={(ref) => { this.mapRef = ref }}
              showsMyLocationButton
              style={{ height: 240, width: global.CONSTANT.WIDTH, marginTop: 10 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: this.state.user_info.latitude,
                longitude: this.state.user_info.longitude,
                latitudeDelta: 0.3022,
                longitudeDelta: 0.0021,
              }}

            >

              <Marker
                coordinate={this.state.user_info}

                Component={TouchableOpacity}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Icon
                  name="record-circle-outline"
                  color="black"
                  type="material-community"
                  size={20}
                  style={styles.mapMarker}
                />
              </Marker>

              <Marker
                coordinate={{
                  latitude: Number(this.state.merchant_info.latitude ? this.state.merchant_info.latitude : 0),
                  longitude: Number(this.state.merchant_info.lontitude ? this.state.merchant_info.lontitude : 0),
                }}
                Component={TouchableOpacity}
                anchor={{ x: 0.5, y: 0.9 }}
              >
                <Icon
                  name="map-marker-radius"
                  type="material-community"
                  size={30}
                  color="red"
                  style={styles.mapMarker}
                />
              </Marker>
            </MapView> */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                height: 120,
                marginRight: 50,
                alignItems: "center"
              }}
            >

              <View style={{ width: "20%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Icon
                  name="map-marker-radius"
                  type="material-community"
                  size={30}
                  color="gray"
                />
                <Icon
                  name="dots-vertical"
                  color="gray"
                  type="material-community"
                  size={20}
                  style={{ marginVertical: 20 }}
                />
                <Icon
                  name="record-circle-outline"
                  color="gray"
                  type="material-community"
                  size={20}
                  style={styles.mapMarker}
                />
              </View>
              <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <TouchableOpacity style={{ width: "80%", height: "30%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                >
                  <Text
                    style={{ fontSize: 13 }}
                    numberOfLines={1}
                  >{this.state.merchant_info.complete_address}</Text>
                  {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: "30%",
                    width: "80%",
                    marginTop: 10
                  }}
                >
                  <TouchableOpacity style={{ flexDirection: "row", width: "100%", justifyContent: "flex-start", alignItems: "center" }}
                    onPress={() => {
                      GetRecentAddress().then((res) => {
                        // console.log(res, "in comdidmount")
                        if (typeof res.data != "undefined")
                          this.setState({ recentAddress: res, filteredAddress: res.data })
                        // console.log(res, "adatadadffsd")
                      })
                      this.DeliveryAddress.open()
                    }}
                  >
                    <Text
                      style={{ fontSize: 13 }}
                      numberOfLines={1}
                    >{this.state.selectedDeliveryAddress ? this.state.selectedDeliveryAddress.address : global.LOCATION.address}</Text>
                    {/* <Text style={{color: "gray", fontSize: 16}}>London</Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: "row", width: "20%", justifyContent: "center", alignItems: "center" }}
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

              </View>
            </View>

            <Divider style={styles.divider} />
            <View
              style={styles.rowContainer}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>When</Text>
              <ButtonGroup
                onPress={() => {
                  this.setState({ selectedDeliveryType: this.state.selectedDeliveryType ? 0 : 1 }, () => {
                    // console.log(this.state.selectedDeliveryType)
                    if (this.state.selectedDeliveryType == 1) {
                      this.setState({ schedulePicker: true })
                      this.Timpicker.open()
                    } else {
                      this.setState({ schedulePicker: false })
                    }
                  })

                }}
                selectedIndex={this.state.selectedDeliveryType}
                buttonStyle={{ borderRadius: 20 }}
                innerBorderStyle={{ width: 0 }}
                selectedButtonStyle={{ backgroundColor: "grey" }}
                disabledSelectedStyle={{ borderRadius: 20 }}
                disabledStyle={{ borderRadius: 20, backgroundColor: "white" }}
                buttons={['Now', 'Schedule']}
                containerStyle={{ borderRadius: 20, width: "60%" }}
              />

            </View>
            <Divider style={styles.divider} />
            <View
              style={{

                // borderWidth: 1
              }}
            >

            </View>
            {/* <Divider style={styles.divider} /> */}

            <View
              style={styles.rowCardContainer}
            >
              <View style={styles.headerContainer}>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Items</Text>
                </View>
                <View>
                  <Text
                    style={{ fontSize: 14, color: global.COLOR.PRIMARY }}
                    onPress={() => this.addNewItem(this.state.merchant.id)}
                  >+ Add items</Text>
                </View>
              </View>
              {
                typeof this.state.cart.cart.data != "undefined" ? this.state.cart.cart.data.item.map((item, index) => {
                  return <View style={styles.tbPRowContainer}>
                    <View style={{ width: "20%" }}>
                      <Text>{item.qty}</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text>{item.item_name}</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={{ textAlign: "right" }}>£{item.normal_price}</Text>
                    </View>
                    <View style={{ width: "10%" }}>
                      <Tooltip
                        // backgroundColor={"rgba(0, 0, 0, 0)"}
                        ref={(ref) => { this.toolTip[index] = ref }}
                        popover={
                          <Text
                            style={{ width: "100%", textAlign: "center" }}
                            onPress={() => {
                              this.removeItemFromCart(index)
                              this.toolTip[index].toggleTooltip(false)
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
                    </View>
                  </View>
                }) : null
              }

            </View>
            <Collapse>
              <CollapseHeader>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "93%" }}>
                  <Divider style={styles.divider} />
                  <Icon
                    name="chevron-right"
                    color="gray"
                    type="material-community"
                    size={24}
                  // iconStyle={styles.icon}
                  />
                </View>
              </CollapseHeader>
              <CollapseBody style={{ paddingHorizontal: 20 }}>
                <View style={styles.tbRowContainer}>
                  <View style={{ width: "20%" }}>
                    <Text>Subtotal</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={{ textAlign: "right" }}>£{typeof this.state.cart.cart.data.total != "undefined" ? this.state.cart.cart.data.total.subtotal : 0}</Text>
                  </View>
                </View>
              </CollapseBody>
            </Collapse>
            <View
              style={styles.rowTipContainer}
            >
              <Image
                source={global.ASSETS.DELIVERY}
                style={{ width: 70, height: 70, resizeMode: "cover" }}
              />
              <View style={{ width: "70%" }}>
                <Text style={{ fontSize: 18 }} numberOfLines={2} >Support your local restaurant and home chef</Text>
                <Text style={{ fontSize: 14, color: "gray" }}>Add a bit extra</Text>
              </View>

            </View>
            <View
              style={styles.rowContainer}
            >
              <Text style={{ fontSize: 18, color: "gray" }}>Restaurant tip</Text>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>{Number(this.state.res_tip) && this.state.switchTipValue > 0 ? "£" + Number(this.state.res_tip).toFixed(2) : null}</Text>
                <Switch
                  thumbColor={this.state.switchTipValue ? "#009FFF" : "red"}
                  onValueChange={this.toggleTipSwitch}
                  value={this.state.switchTipValue}
                />
              </View>

            </View>
            <Divider style={styles.divider} />

            <View
              style={styles.rowCardContainer}
            >
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row", borderWidth: 1, borderRadius: 19, borderColor: global.COLOR.PRIMARY, padding: 5 }}
                  onPress={() => {
                    this.AddNoteSheet.open()
                  }}
                >
                  <Icon
                    name={this.state.note ? "clipboard-check-outline" : "clipboard-outline"}
                    color={global.COLOR.PRIMARY}
                    type="material-community"
                    size={20}
                  />
                  <Text style={{ color: global.COLOR.PRIMARY }}> Add Note</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <Divider style={{marginBottom: 30}} /> */}
            {
              typeof this.state.cart.cart.data != "undefined" ? <View
                style={styles.rowCardContainer}
              >
                <View style={styles.headerContainer}>
                  <TouchableOpacity
                    style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%" }}
                    onPress={() => { this.PromoSheet.open() }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", borderRadius: 15, backgroundColor: "black", paddingHorizontal: 15, paddingVertical: 5 }}>Got promo code?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tbRowContainer}>
                  <View style={{ width: "40%" }}>
                    <Text style={{ color: "gray" }}>Subtotal</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={{ textAlign: "right", color: "gray" }}>£{typeof this.state.cart.cart.data.total != "undefined" ? this.state.cart.cart.data.total.subtotal : 0}</Text>
                  </View>
                </View>
                <View style={styles.tbRowContainer}>
                  <View style={{ width: "40%" }}>
                    <Text>Tip</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={{ textAlign: "right" }}>£{this.state.switchTipValue ? (Number(Number(this.state.res_tip) + Number(this.state.tip_more)).toFixed(2)) : 0}</Text>
                  </View>
                </View>
                {
                  this.state.appliedDiscount ? <View style={styles.tbRowContainer}>
                    <View style={{ width: "40%" }}>
                      <Text style={{ color: "blue" }}>Discount amount</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={{ textAlign: "right", color: "blue" }}>£{this.state.appliedDiscount.toFixed(2)}</Text>
                    </View>
                  </View> : null
                }
                <View style={styles.tbRowContainer}>
                  <View style={{ width: "40%" }}>
                    <Text>Delivery Fee</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={{ textAlign: "right" }}>£{this.state.services[this.state.selectedIndex] == "Delivery" ? Number(this.state.merchant_info.delivery_charges ? this.state.merchant_info.delivery_charges : 0).toFixed(2) : 0}</Text>
                  </View>
                </View>
                <View style={styles.tbRowContainer}>
                  <View style={{ width: "30%" }}>
                    <Text>Service Charge</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={{ textAlign: "right" }}>£{Number(0.50).toFixed(2)}</Text>
                  </View>
                </View>
                <Divider style={{ width: "100%", height: 1 }} />
                <View style={styles.tbRowContainer}>
                  <View style={{ width: "20%" }}>
                    <Text>Total</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text style={{ textAlign: "right" }}>£{Number(this.state.total).toFixed(2)}</Text>
                  </View>
                </View>
              </View> : null
            }

          </ScrollView>
        </View>
        <View style={styles.backCheckContainer}>
          <TouchableOpacity
            style={styles.checkoutContainer}
            onPress={() => {
              this.checkMinimum()
            }}
          >
            <Icon
              name="clipboard-check-outline"
              color={global.COLOR.PRIMARY}
              type="material-community"
              size={20}
            />
            <View>
              <Text style={styles.checkoutText}>CONFIRM</Text>
            </View>
            <View>
            </View>

          </TouchableOpacity>
        </View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={300}
          duration={250}
        >
          <View style={{ height: "100%", width: "80%", alignSelf: "center" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <View style={{ height: 60, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", }}
                >"Leave at door" delivery is required</Text>
              </View>
              <Divider style={{ width: "100%", height: 1 }} />
              <View style={{ marginVertical: 20, flexDirection: "column", }}>
                <Text
                  style={{ fontSize: 18, color: "gray" }}
                >To help everyone stay safe at this time, no-contact deliveries are required in your area.</Text>
                <Text
                  style={{ fontSize: 18, color: "gray" }}
                >Your order will be conveniently left at your door</Text>
              </View>
            </View>
            <Button
              onPress={() => {
                this.RBSheet.close();
                // this.props.navigation.navigate("Bills")
                this.confirm()
              }}
              title={"Next"}
            />
          </View>
        </RBSheet>
      </SafeAreaView>
    );
  }
}


// const mapStateToProps = state => ({
//   count: state.count,
//   cart: state.cart
// });

// const mapDispatchToProps = dispatch => {
//   return {
//     ChangeCount: (v) => dispatch(changeCount(v)),
//     ChangeCart: (v) => dispatch(changeCart(v)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(customerBasket)
export default customerBasket


const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    width: "25%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  tbRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "gray",
    // borderBottomWidth: 1,
    height: 50
  },
  tbPRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "gray",
    // borderBottomWidth: 1,
    height: 50
  },
  rowCardContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 15,
    borderColor: "gray",
    alignSelf: "center",
    width: "90%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 60,
    borderColor: "gray",
    alignSelf: "center",
    width: "90%",
  },
  rowTipContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 15,
    height: 60,
    borderColor: "gray",
    alignSelf: "center",
    width: "90%",
  },
  rowTipsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    borderColor: "gray",
    alignSelf: "center",
    width: "90%",
    padding: 6
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 40,
    marginBottom: 7
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },
  upperContainer: { flex: 0.96 },
  androidContainer: {
    flex: 0.96,
    marginTop: 30
  },
  grubContainer: {
    justifyContent: "space-evenly",
    marginHorizontal: 10,
  },
  deliveryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  prrofText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detailText: {
    color: "gray",
  },
  avatar: {
    alignSelf: "center",
    marginLeft: 200,
  },
  orderBackContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 6,
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  orderText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 10,
    color: "grey",
  },
  adminContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 60,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },

  youText: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  leftText: {
    fontSize: 14,
    marginHorizontal: 6,
    marginTop: 20,
    width: 100,
  },
  rightText: {
    fontSize: 14,
    marginLeft: 20,
    marginTop: 20,
    // width: 100
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "gray",
    marginHorizontal: 20,
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 0.1,
    borderColor: "#000",
  },
  offerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginVertical: 10,
    margin: 16,
  },
  offerText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 5,
  },
  percentageText: {
    backgroundColor: global.COLOR.PRIMARY,
    color: "#fff",
    height: 20,
    width: 20,
    textAlign: "center",
    borderRadius: 40,
  },
  checkoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 10,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  totalText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  backCheckContainer: {
    backgroundColor: global.COLOR.PRIMARY,
    flex: 0.1,
    // marginTop: 20
  },
  orderIcon: {
    height: 24,
    width: 20,
    resizeMode: "contain",
    marginTop: 10,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  notificationText: {
    fontSize: 16,
    alignSelf: "center",
  },
  toggleContainer: {
    // width: "40%"
    flexDirection: "row",
    justifyContent: "center",
    // margin: 10,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
