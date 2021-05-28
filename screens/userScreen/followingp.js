import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, Image, TouchableOpacity } from "react-native";
import { Avatar, Icon, Input } from "react-native-elements";
import global from "../../global";
import { ScrollView } from "react-native-gesture-handler";
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import { toggleFollowApi, getPublicProfile } from "../../utils/Api"
import MaterialTabs from 'react-native-material-tabs';
import { getPushNotificationPermissions, registerForPushNotificationsAsync, sendNotification } from "../../utils/NotificationApi";

export default class followingP extends Component {
  static navigationOptions = {
    title: "User",
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
      following: this.props.navigation.state.params.following,
      followers: this.props.navigation.state.params.followers,
      users: this.props.navigation.state.params.users,
      filteredFollowingData: this.props.navigation.state.params.following,
      filteredFollowersData: this.props.navigation.state.params.followers,
      filteredUsersData: this.props.navigation.state.params.users,
      selectedTab: this.props.navigation.state.params.selectedIndex
    };
  }

  handleSearch=(v)=>{
    var temp = []
    this.state.following&&this.state.following.map((man, index)=>{
      var first_name = man.first_name.toLowerCase()
      var last_name = man.last_name.toLowerCase()
      if(first_name.indexOf(v.toLowerCase())>=0 || last_name.indexOf(v.toLowerCase())>=0){
        temp.push(man)
      }
    })
    this.setState({filteredFollowingData: temp})
    temp = []
    this.state.followers&&this.state.followers.map((man, index)=>{
      var first_name = man.first_name.toLowerCase()
      var last_name = man.last_name.toLowerCase()
      if(first_name.indexOf(v.toLowerCase())>=0 || last_name.indexOf(v.toLowerCase())>=0){
        temp.push(man)
      }
    })
    this.setState({filteredFollowersData: temp})
    temp = []
    this.state.users&&this.state.users.map((man, index)=>{
      var first_name = man.first_name.toLowerCase()
      var last_name = man.last_name.toLowerCase()
      if(first_name.indexOf(v.toLowerCase())>=0 || last_name.indexOf(v.toLowerCase())>=0){
        temp.push(man)
      }
    })
    this.setState({filteredUsersData: temp})
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "94%",
          backgroundColor: "#000",
          marginTop: 8,
          alignSelf: "center"
        }}
      />
    );
  }

  toggleFollow = async (client_id, item, flag)=>{

    await toggleFollowApi(client_id, flag).then(res=>{
      this.setState({
        following: res.details.following,
        followers: res.details.follower,
        users: res.details.users,
        filteredFollowingData: res.details.following,
        filteredFollowersData: res.details.follower,
        filteredUsersData: res.details.users,
      })
      this.props.navigation.state.params.setData(res.details)
    })
    // console.log("end")
    var expoToken = item.expo_token?item.expo_token:""
      // console.log(expoToken)
      switch(flag){
        case 'remove':
          if(item.notification_flag==1)
          sendNotification(expoToken, {
            title: "Notification",
            body: "You are removed from following by "+global.USER.details.client_info.first_name
          }, item)
          break;
        
        case 'fRemove':
          if(item.notification_flag==1)
            sendNotification(expoToken, {
              title: "Notification",
              body: global.USER.details.client_info.first_name+" doesn't follow you"
            }, item)
          
          break;
   
        case 'follow':
          if(item.notification_flag==1)
          sendNotification(expoToken, {
            title: "Notification",
            body: global.USER.details.client_info.first_name+" follows you"
          }, item)
          break;
   
        default:

      }
  }
  componentWillMount () {
    this.setState({
      following: this.props.navigation.state.params.following,
      followers: this.props.navigation.state.params.followers,
      users: this.props.navigation.state.params.users,
      filteredFollowingData: this.props.navigation.state.params.following,
      filteredFollowersData: this.props.navigation.state.params.followers,
      filteredUsersData: this.props.navigation.state.params.users,
      selectedTab: this.props.navigation.state.params.selectedIndex
    });
  }
  render() {
    return (
      <View style={styles.bgContainer}>
        <MaterialTabs
          items={['Followers', 'Following', 'All Users']}
          selectedIndex={this.state.selectedTab}
          onChange={index => this.setState({ selectedTab: index })}
          style={{backgroundColor: global.COLOR.PRIMARY}}
          barColor={global.COLOR.PRIMARY}
        />
        <View>
          <Input
            placeholder="Search "
            placeholderTextColor="#000"
            inputContainerStyle={styles.inputFiedContainer}
            keyboardType="default"
            inputStyle={styles.inputText}
            onChangeText={v=>this.handleSearch(v)}
          />
        </View>
        <Dialog
          width={300}
          height={150}
          visible={false}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              <DialogButton
                text="Camera"
                // onPress={()=>{this._pickImage("camera")}}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
              <DialogButton
                text="Gallery"
                // onPress={this._pickImageFromLibrary}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
              
            </DialogFooter>
          }
        >
          <DialogContent
            style={{marginTop: 'auto', padding: 5}}
          >
            <Text
              style={{fontSize: 17, color: "blue"}}
            >Please select Camera or Gallery to get your picture</Text>
          </DialogContent>
        </Dialog>
        {this.state.selectedTab==1&&<FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent = { this.FlatListItemSeparator }
          keyExtractor={(item, index) => index.toString()}
          data={this.state.filteredFollowingData}
          renderItem={({ item: d }) => (
            <View style={styles.flatlistContainer}>
              <TouchableOpacity 
                style={styles.avatarContainer}
              >
              {d.avatar?<Avatar rounded size={60} source={{ uri: "https://www.grubhouse.co.uk/upload/"+d.avatar }} />:<Avatar rounded size={60} title={d?.first_name[0]+d?.last_name[0]} />}
                <Text style={styles.nameText} numberOfLines={1}>
                  {d?.first_name}&nbsp;&nbsp;{d?.last_name}
                </Text>
              </TouchableOpacity>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}
              >
              </View>
            </View>
          )}
        />}
        {this.state.selectedTab==0&&<FlatList
          ItemSeparatorComponent = { this.FlatListItemSeparator }
          showsVerticalScrollIndicator={false}
          data={this.state.filteredFollowersData}
          renderItem={({ item: d }) => (
            <View style={styles.flatlistContainer}>
              <TouchableOpacity
                style={styles.avatarContainer}>
                {d.avatar?<Avatar rounded size={60} source={{ uri: "https://www.grubhouse.co.uk/upload/"+d.avatar }} />:<Avatar rounded size={60} title={d?.first_name[0]+d?.last_name[0]} />}
                <Text style={styles.nameText}>{d?.first_name}&nbsp;&nbsp;{d?.last_name}</Text>
              </TouchableOpacity>
            </View>
          )}
        />}
        {this.state.selectedTab==2&&<FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent = { this.FlatListItemSeparator }
          keyExtractor={(item, index) => index.toString()}
          data={this.state.filteredUsersData}
          renderItem={({ item: d }) => (
            <View style={styles.flatlistContainer}>
              <TouchableOpacity style={styles.avatarContainer}>
              {d.avatar?<Avatar rounded size={60} source={{ uri: "https://www.grubhouse.co.uk/upload/"+d.avatar }} />:<Avatar rounded size={60} title={d?.first_name[0]+d?.last_name[0]} />}
                <Text style={styles.nameText} numberOfLines={1}>
                  {d?.first_name}&nbsp;&nbsp;{d?.last_name}
                </Text>
              </TouchableOpacity>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}
              >
                <TouchableOpacity style={styles.removeContainer}
                >
                  <Text style={styles.removeText}>Follow</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginHorizontal: 10,
    marginTop: 10
  },
  nameText: {
    fontSize: 16,
    alignSelf: "center",
    marginHorizontal: 10,
    width: 150
  },
  removeText: {
    fontSize: 14,
    alignSelf: "center",
    margin: 6,
    color: "white"
  },
  removeContainer: {
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
  removeContainer1: {
    width: 80,
    backgroundColor: "#fd12de",
    borderRadius: 5,
    height: 30,
    alignItems: "center",
    marginRight: 20
  },
  flatlistContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    alignItems: "center"
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginVertical: 6,
    marginHorizontal: 16
  },
  inputFiedContainer: {
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.03)"
    // marginTop: global.CONSTANT.STATUSBAR + 20
  }
});
