import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Icon, Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import global from "../../global";
import ImageOverlay from "react-native-image-overlay";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";
import RBSheet from "react-native-raw-bottom-sheet";
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogHeader } from 'react-native-popup-dialog';
import {uploadAvatar, addFoodCourtApi, uploadFile} from "../../utils/Api"
import { Card } from 'react-native-shadow-cards';
import { addCommentApi, getComments, getCommentsHide } from "../../utils/Api"

export default class offerDetail extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.bgContainer}>
        <Card style={{ padding: 10, marginLeft: 'auto', marginRight: "auto", width: "98%", marginTop: 10 }}>
          <Image
            source={{uri : "https://www.grubhouse.co.uk/upload/"+this.props.navigation.state.params.merchant[0].logo}} 
            style={styles.image} 
            Component={TouchableOpacity}
          />
          <View style={{marginTop: 15}}>
            <Text style={{fontSize: 20}}>{this.props.navigation.state.params.merchant[0].restaurant_name}</Text>
            <Text style={{color: "gray"}}>{this.props.navigation.state.params.merchant[0].street+", "+this.props.navigation.state.params.merchant[0].city+", "+this.props.navigation.state.params.merchant[0].state}</Text>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <Icon
                  name="star"
                  color={global.COLOR.PRIMARY}
                  type="material-community"
                  size={20}
                  iconStyle={styles.starIcon}
                />
                <Text style={styles.ratingText}>&nbsp;{this.props.navigation.state.params.merchant[0].rating.ratings}&nbsp;</Text>
                <Text style={styles.typeRating}>({this.props.navigation.state.params.merchant[0].rating.votes})</Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"  }}
              >
                <Icon
                  name="currency-gbp"
                  color="gray"
                  type="material-community"
                  size={20}
                  iconStyle={styles.starIcon}
                />

                <Text style={styles.typeRating}>{Number(this.props.navigation.state.params.merchant[0].delivery_charges).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </Card>
        <ScrollView
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
        { this.props.navigation.state.params.offers.map((offer, index)=>{
          
          return   <View style={styles.offerContainer}>
                    <View>
                      <Image source = {{uri: "https://www.grubhouse.co.uk/upload/"+offer.image}}
                        style={styles.images}
                      />
                    </View>
                    <View style={{margin: 15, backgroundColor: "#fff", zIndex: 999}}>
                      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.offerTitle}>{offer.offer_name}</Text>
                        <Text style={{borderRadius: 2, fontSize: 12, color: "#fff", padding: 2,  backgroundColor: offer.status=="publish"?"#1A73E8":"#F77D0E"}}>{offer.status}</Text>
                      </View>
                      <View style={{marginBottom: 10}}><Text style={styles.contentText}>Save {Number(offer.offer_percentage).toFixed(0)}% when over £{Number(offer.offer_price).toFixed(0)}</Text></View>
                      <View>
                        <Text style={styles.contentText}>From:&nbsp;{offer.valid_from}</Text><Text style={styles.contentText}>To:{offer.valid_to}</Text></View>
                    </View>
                  </View>
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer:{
    width: "100%",
    height: "100%",
    paddingTop: 7,
    paddingHorizontal: 20,
    flexDirection: "column",
    backgroundColor: "#FFF"
  },
  contentText:{
    fontSize: 14,
    color: "gray"
  },
  offerTitle:{
    fontSize: 16,
  },
  offerContainer:{
    marginTop: 20,
    paddingHorizontal: 5,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "rgb(213,215,221)"
  },
  image: {
    height: 200,
    width: "100%",
  },
  images: {
    width: 80,
    height: 80,
    margin: 10
  }
});
