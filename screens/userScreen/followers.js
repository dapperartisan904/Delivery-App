import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, Image, TouchableOpacity } from "react-native";
import { Avatar, Icon, Input } from "react-native-elements";
import global from "../../global";
import { ScrollView } from "react-native-gesture-handler";
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import { readNotification, getPublicProfile } from "../../utils/Api"
import MaterialTabs from 'react-native-material-tabs';
import { getPushNotificationPermissions, registerForPushNotificationsAsync, sendNotification } from "../../utils/NotificationApi";
import { List } from 'react-native-paper';
import parse from "../../utils/parse";
import stringify from "../../utils/stringify";
const DATA =[
  {
    id: 1,
    name: "longman"
  },
  {
    id: 1,
    name: "longman"
  },
  {
    id: 1,
    name: "longman"
  },
  {
    id: 1,
    name: "longman"
  }
]
export default class followers extends Component {
  static navigationOptions = {
    title: "Notifications",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    },
  };
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.navigation.state.params.data
    };
  }
  componentDidMount () {
    // console.log(this.state.data)
  }
  handlePress = () => {
    this.setState({ expanded: !this.state.expanded})
  };
  getDate=(item_date)=>{
    return item_date
  }
  read = (d)=> {
    readNotification(
      d.id,
    ).then(res=>{
      this.setState({data: res.details.notifications})
      this.props.navigation.state.params.upDateParent(res.details.notifications, "notification")
      switch(d.by_type){
        case "comment":
            this.props.navigation.navigate("AddComment", {
              fc_id: d.by_id,
              image: "image",
            })
        break;
      }
      
    })
  }
  render() {
    return (
      <View style={styles.bgContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d, index: num }) => (
              <TouchableOpacity 
                style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}
                onPress = {()=>{
                  if(d.by_from == "comment"){
                    this.props.navigation.navigate("AddComment", {
                      fc_id: d.by_id,
                      image: "asd.png",
                    })
                  }
                }}
                >
                <View
                  style={styles.horizontalFlatlist}
                >
                  {d.is_read == 0?<Text style={styles.newText}>new</Text>:null}
                  <TouchableOpacity 
                    style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                    onPress = {()=>this.read(d)}
                  >
                  {d.avatar?<Avatar rounded size={55} source={{ uri: "https://www.grubhouse.co.uk/upload/"+d?.trigger_info[0]?.avatar }} />:<Avatar rounded size={55} title={d?.first_name[0]?d?.first_name[0]:"N"+d?.last_name[0]?d?.last_name[0]:"N"} />}
                    <View style={{width: "65%"}}>
                      <Text
                        style={{marginLeft: 20, fontSize: 16, width: "100%"}}
                        numberOfLines={2}>
                        {parse(d.push_message)}
                      </Text>
                      <Text style={{marginLeft: 20, color: "gray", fontSize: 12}}>
                        {d.trig_date}
                      </Text>
                    </View>
                      
                  </TouchableOpacity>
                  {d.follow?<TouchableOpacity style={styles.removeContainer}
                  >
                    <Text style={styles.removeText}>Follow</Text>
                  </TouchableOpacity>:null}
                </View>
                {
                  this.state.data.length != num+1?<View style={{height: 1, width: "100%", backgroundColor: "gray",marginTop: 2, marginBottom: 5}}>
                    </View>:null
                }
                
              </TouchableOpacity>
            )}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newText: {
    position: "absolute", 
    top:4, 
    right: 5, 
    zIndex: 10, 
    backgroundColor: "red", 
    padding: 2, 
    width:30, 
    borderRadius: 2, 
    textAlign: "center", 
    color: "white", 
    fontSize: 11
  },
  horizontalFlatlist: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4
  } ,
  removeText: {
    fontSize: 14,
    alignSelf: "center",
    margin: 6,
    color: "white"
  },
  removeContainer: {
    width: 80,
    backgroundColor: "#fd12de",
    borderRadius: 5,
    height: 30,
    alignItems: "center",
    marginRight: 20
  },
  followContainer: {
    // width: 80,
    flexDirection: "row",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 5,
    height: 30,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: global.COLOR.PRIMARY,
    marginRight: 20
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20
  },
  
});
