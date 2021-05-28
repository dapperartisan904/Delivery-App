import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import { Icon, Divider, Avatar } from "react-native-elements";
import global from "../../global";
import { ScrollView } from "react-native-gesture-handler";
import { getNotifications, getMyfavourite } from "../../utils/Api";
import * as Animatable from "react-native-animatable";

export default class menu extends Component {
  static navigationOptions = {
    title: "Your Account",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      notification: this.props.navigation.state.params.notifications
    };
  }

  //  Logout Functionality
  handleLogout = () => {
    Alert.alert(
      "Grub House",
      "Are you sure you want to logout!",
      [
        {
          text: "Yes ",
          onPress: () => {
            AsyncStorage.multiRemove([global.API_TOKEN]);
            this.props.navigation.navigate("Auth");
          }
        },
        {
          text: "Cancel"
          // onPress: () => {
          //   BackHandler.exitApp();
          // }
        }
      ],
      { cancelable: false }
    );
  };

  notificationPage = ()=> {
    
  }
  notiNum = ()=>{
    var num = 0;
    this.state.notification.map((noti, index)=>{
      num += noti.is_read == 0?1:0
    })
    // console.log(num)
    if(num>0){
      return <Text style={styles.newText}>{num}</Text>
    } 
  }

  setStateFromChild = (data, index)=>{
    // console.log(this.state, "asdfadsf")
    this.setState({
      [index]: data
    })
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={styles.profileContainer}>
          <Avatar rounded size={80} source={{uri: "https://www.grubhouse.co.uk/upload/"+global.USER.details.client_info.avatar}} />
          <Text style={styles.nameText}>{global.USER.details.client_info.first_name}</Text>
          <Animatable.View animation="slideInDown">
            <Animatable.Image
              // animation="slideInDown"
              source={global.ASSETS.GRUBICON}
              style={styles.logo}
            />

            <Animatable.Image
              // animation="slideInDown"
              source={global.ASSETS.GRUB}
              style={styles.grub}
            />
            <Animatable.Image
              // animation="slideInDown"
              source={global.ASSETS.HOUSE}
              style={styles.grub}
            />
          </Animatable.View>
        </View>
        <View style={{ marginTop: 40 }}>
          <TouchableOpacity 
            // onPress={() => getNotifications()} 
            onPress={()=>{this.props.navigation.navigate("Followers", {
              data: this.state.notification,
              upDateParent: this.setStateFromChild
            })}}
            style={styles.row}>
            <View><Text style={styles.text}>NOTIFICATIONS</Text></View>
            <View>{this.notiNum()}</View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={()=>getMyfavourite(0)}
            // onPress={this.notificationPage()
            // }
          >
            <Text style={styles.text}>YOUR FAVOURITES</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.text}>PAYMENT DETAILS</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.text}>RESERVATIONS</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.text}>PIGGY BANKS</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.text}>ORDERS</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("LoyaltyPoints")}
          >
            <Text style={styles.text}>LOYALTY POINTS</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Membership")}
          >
            <Text style={styles.text}>MEMBERSHIP</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity onPress={this.handleLogout}>
            <Text style={styles.text}>LOG OUT</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  newText: {
    backgroundColor: "red",
    padding: 2,
    borderRadius: 4,
    color: "white",
    marginTop: 20,
    width: 30,
    textAlign: "center"
  },
  logo: {
    height: 40,
    // width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: global.CONSTANT.STATUSBAR,
    // marginBottom: 10
    // marginTop: -36
  },
  grub: {
    height: 40,
    width: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  row: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 30,
    marginTop: global.CONSTANT.STATUSBAR + 20
  },
  nameText: {
    // margin: 10,
    fontWeight: "bold",
    fontSize: 23,
    marginTop: 5,
    marginHorizontal: 16,
    color: "black"
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    marginHorizontal: 34,
    marginTop: 23
  },
  divider: {
    height: 1,
    backgroundColor: global.COLOR.PRIMARY,
    marginHorizontal: 30,
    marginTop: 20
  }
});
