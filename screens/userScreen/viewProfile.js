import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Switch,
  Image,
  FlatList,
  AsyncStorage
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
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import { Thumbnail } from 'react-native-thumbnail-video';
import { 
  uploadAvatar, 
  uploadBg, 
  addFoodCourt, 
  getFoodCourtMe, 
  getFCourtDetail, 
  getMyfavourite, 
  getSubInformation ,
  toggleNotification
} from "../../utils/Api"
import { Video } from 'expo-av';

export default class viewProfile extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      info: this.props.navigation.state.params.info
    };
  }
  
  render() {
    return (
      <View style={styles.bgContainer}>
        <ScrollView>
          <View style={styles.mainFieldContainer}>
            <Text style={{width: "100%", textAlign: "center", fontSize: 27, marginTop: 15, marginBottom: 15}}>Public Profile</Text>
            <View style={styles.avatarContainer}>
                <Avatar
                  rounded
                  size={100}
                  source={{uri: "https://www.grubhouse.co.uk/upload/"+this.state.info.avatar}}
                />
                <Text style={{marginLeft: 30, fontSize: 20, textTransform: "capitalize"}}>{this.state.info.first_name+" "+this.state.info.last_name}</Text>
            </View>
            <View style={styles.infoField}>
              <Icon
                name="map-marker-outline"
                color="#fff"
                type="material-community"
                size={20}
                iconStyle={styles.infoIcon}
                Component={TouchableOpacity}
              />
              <Text style={styles.mainInfo}>{this.state.info.street+", "+this.state.info.city+", "+this.state.info.state+", "+this.state.info.country_code}</Text>
              
              </View>
              <View style={styles.divider}></View>
              <View style={styles.infoField}>
              <Icon
                name="phone-outline"
                color="#fff"
                type="material-community"
                size={20}
                iconStyle={styles.infoIcon}
                Component={TouchableOpacity}
              />
              <Text style={styles.mainInfo}>{this.state.info.contact_phone}</Text>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.infoField}>
              <Icon
                name="email-outline"
                color="#fff"
                type="material-community"
                size={20}
                iconStyle={styles.infoIcon}
                Component={TouchableOpacity}
              />
              <Text style={styles.mainInfo}>{this.state.info.email_address}</Text>
            </View>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.props.navigation.state.params.comment}
            renderItem={({ item: d }) => (
              <View style={styles.offerContainer}>
                <View>
                  <Image source = {{uri: "https://www.grubhouse.co.uk/upload/"+d.image}}
                    style={styles.images}
                  />
                </View>
                <View style={{margin: 15, backgroundColor: "#fff", zIndex: 999}}>
                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "relative"}}>
                    <Text style={styles.offerTitle}>{d.food_name}</Text>
                  </View>
                  <View style={{marginTop: 5}}><Text style={styles.contentText}>{d.comment}</Text></View>
                  {/* <View><Text style={styles.contentText}>asdasdasdasdasdasd</Text></View> */}
                </View>
              </View>
            )}
          />
          
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentText:{
    fontSize: 14,
    color: "gray"
  },
  images: {
    width: 80,
    height: 80,
    margin: 10
  },
  offerContainer:{
    marginTop: 20,
    paddingHorizontal: 5,
    flexDirection: "row",
    borderColor: "rgb(213,215,221)",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 1.2,
    shadowRadius: 3.30,
    elevation: 3,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10
  },
  divider:{
    backgroundColor: "gray",
    height: 1,
    marginBottom: 15,
    marginLeft: 45
  } ,
  mainInfo: {
    fontSize: 16
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: global.COLOR.PRIMARY,
    padding: 11,
    marginRight: 18
  },
  infoField:{
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
    marginLeft: 50
  },
  avatarContainer: {
    height: 130,
    borderBottomColor: "gray",
    borderBottomWidth: 2,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  mainFieldContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingLeft: 30,
    paddingBottom: 10,
    paddingRight: 30,
    paddingTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowOpacity: 0.39,
    shadowRadius: 1.30,
    elevation: 5,
  },
  bgContainer: {
    flex: 1,
    width: null
  }
});