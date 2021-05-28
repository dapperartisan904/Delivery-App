import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Switch,
  Image,
  AsyncStorage,
  Alert
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
  getSubInformation,
  toggleNotification,
  getDetailInfomation,
  toggleFollowApi
} from "../../utils/Api"
import { Video } from 'expo-av';
import { getPushNotificationPermissions, registerForPushNotificationsAsync, sendNotification } from "../../utils/NotificationApi";

export default class normalPProfile extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.getPermissionAsync();

    this.state = {
      name: "lynda_xo",
      location: "London",
      favorite: [],
      followers: [],
      following: [],
      student_hide: true,
      profile_image: "",
      avatar: "https://www.grubhouse.co.uk/upload/"+this.props.navigation.state.params.client.avatar,
      bgVisible: false,
      bgImage: "https://www.grubhouse.co.uk/upload/"+this.props.navigation.state.params.client.bgImage,
      foodCourt: [],
      followingState: false
    };
  }
  
  // Get camera and files permissions
  getPermissionAsync = async () => {
    if (global.CONSTANT.DEVICETYPE == "ios") {
      // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const { status, permissions } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  toggleSwitch = (val) => {

    this.setState({
      switchValue: val,
    });
    toggleNotification(global.USER.details.client_info.client_id, val).then(res=>{
      this.setState({switchValue: res.details})
    })

  };

  chooseUpload = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  _pickImage = async v => {

    let option =
      v == "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    let field = this.state.field;
    let result = await option({
      quality: 0.2,
      allowsEditing: true
    });

    if (!result.cancelled) {

    }
    uploadAvatar(result.uri).then(res=>{
      this.setState({
        avatar: "https://www.grubhouse.co.uk/upload/"+res.details
      })
    })
    this.dialogHide()
    this.chooseUpload();
  };

  _pickImageFromLibrary=async()=>{
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      this.setState({
        avatar: result.uri
      });
      uploadAvatar(result.uri).then(res=>{
        // console.log(res)
        this.setState({
          avatar: "https://www.grubhouse.co.uk/upload/"+res.details
        })
      })
    }
    this.dialogHide()
  }

  openBRsheet = ()=>{
    this.RBSheet.open();
  }

  dialogHide = ()=> {
    this.setState({visible: false, bgVisible: false})
  }
  toggleFollow = async ()=>{
    var flag = "";
    // console.log(this.props.navigation.state.params.client.client_id, global.USER.details.client_info.client_id)
    if(this.props.navigation.state.params.client.client_id == global.USER.details.client_info.client_id){ // from follower, 
      if(this.state.followingState){
        await toggleFollowApi(this.props.navigation.state.params.client.follower_id, "fRemove", "public").then(res=>{
          this.setState({
            following: res.details.following,
            followers: res.details.follower,
          })
          
          if(res.details.followerC){
            this.setState({followingState: true})
          } else {
            console.warn("there is no members that follows this user, fremove")
            this.setState({followingState: false})
          }
          this.props.navigation.state.params.setData({
            following: res.details.followingClt,
            followers: res.details.followerClt,
          })
          // this.props.navigation.state.params.setData(res.details)
        }).catch(err=>{
          Alert.alert("GRUBHOUSE", "There was a net issue, please try again.")
        })
        flag = "fRemove"
      } else {
        await toggleFollowApi(this.props.navigation.state.params.client.follower_id, "follow", "public").then(res=>{
          this.setState({
            following: res.details.following,
            followers: res.details.follower,
          })
          // console.log(res.details)
          if(res.details.followerC){
            this.setState({followingState: true})
          } else {
            console.warn("there is no members that follows this user follow")
            this.setState({followingState: false})
          }
          this.props.navigation.state.params.setData({
            following: res.details.followingClt,
            followers: res.details.followerClt,
          })
          // this.props.navigation.state.params.setData(res.details)
        }).catch(err=>{
          Alert.alert("GRUBHOUSE", "There was a net issue, please try again.")
        })
      }
      flag = "follow"
    } else { // from following
      if(this.state.followingState){
        await toggleFollowApi(this.props.navigation.state.params.client.client_id, "fRemove", "public").then(res=>{
          this.setState({
            following: res.details.following,
            followers: res.details.follower,
          })

          if(res.details.followerC){
            this.setState({followingState: true})
          } else {
            this.setState({followingState: false})
          }
          this.props.navigation.state.params.setData({
            following: res.details.followingClt,
            followers: res.details.followerClt,
          })
          // this.props.navigation.state.params.setData(res.details)
        }).catch(err=>{
          Alert.alert("GRUBHOUSE", "There was a net issue, please try again.")
        })
        flag = "fRemove"
      } else {
        await toggleFollowApi(this.props.navigation.state.params.client.client_id, "follow", "public").then(res=>{
          this.setState({
            following: res.details.following,
            followers: res.details.follower,
          })
          if(res.details.followerC){
              this.setState({followingState: true})
          } else {
            console.warn("there is no members that follows this user follow")
            this.setState({followingState: false})
          }
          this.props.navigation.state.params.setData({
            following: res.details.followingClt,
            followers: res.details.followerClt,
          })
          // this.props.navigation.state.params.setData(res.details)
        }).catch(err=>{
          Alert.alert("GRUBHOUSE", "There was a net issue, please try again.")
        })
        flag = "follow"
      }
      
    }
    // console.log(flag, "flag type of folow button when user click")
        
    var expoToken = this.props.navigation.state.params.client.expo_token?this.props.navigation.state.params.client.expo_token:""
    var client = this.props.navigation.state.params.client
      // console.log(expoToken)
      switch(flag){
        case 'fRemove':
          if(client.notification_flag==1)
            sendNotification(expoToken, {
              title: "Notification",
              body: global.USER.details.client_info.first_name+" doesn't follow you"
            }, client)
          break;
   
        case 'follow':
          if(client.notification_flag==1)
          sendNotification(expoToken, {
            title: "Notification",
            body: global.USER.details.client_info.first_name+" follows you"
          }, client)
          break;
   
        default:
          // console.log("default")
      }
  }
  componentDidMount(){
    this.setState({client: this.props.navigation.state.params.client})
    console.warn(this.props.navigation.state.params.client, "client info")
    if(this.props.navigation.state.params.client.client_id != global.USER.details.client_info.client_id)
    {
      // i am following user.
      getFoodCourtMe(this.props.navigation.state.params.client.client_id).then(res => {
        if (res.details.length > 0) {
          this.setState({ foodCourt: res.details })
        }
      })
      getSubInformation(this.props.navigation.state.params.client.client_id).then(res=>{
        this.setState({
          favorite:res.details.favorite,
          followers: res.details.follower,
          following: res.details.following,
          users: res.details.users,
          switchValue: res.details.notificationFlag[0].notification_flag=="1"?true:false
        })
      })
      console.warn('i am following from following')
      this.setState({followingState: true})
    } else {
      // he is following me
      console.warn('from follower')
      getFoodCourtMe(this.props.navigation.state.params.client.follower_id).then(res => {
        if (res.details.length > 0) {
          this.setState({ foodCourt: res.details })
        }
      })
      getSubInformation(this.props.navigation.state.params.client.follower_id).then(res=>{
        this.setState({
          favorite:res.details.favorite,
          followers: res.details.follower,
          following: res.details.following,
          users: res.details.users,
          switchValue: res.details.notificationFlag[0].notification_flag=="1"?true:false
        })
        if(res.details.follower){
          res.details.follower.map((follower, index)=>{
            console.warn(follower.follower_id, "i am following")
            if(follower.follower_id == global.USER.details.client_info.client_id){
              this.setState({followingState: true})
            }
          })
        } else {
          console.warn("there is no members that follows this user")
          this.setState({followingState: false})
        }
        
      })
    }
    
    // console.log(this.props.navigation.state.params.client, "clientINfo")
  }

  _pickBgImageFromLibrary=async()=>{
    // console.log("asdfasdfddsf")
    this.dialogHide()
    let result = await ImagePicker.launchImageLibraryAsync({
      // base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    
    if (!result.cancelled) {
      uploadBg(result.uri).then(res=>{
        this.setState({
          bgImage: "https://www.grubhouse.co.uk/upload/"+res.details
        })
      })
    }
    
  }

  _pickBgImage = async v => {
    this.dialogHide()
    let option =
      v == "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    let field = this.state.field;
    let result = await option({
      base64: true,
      quality: 0.2,
      allowsEditing: true
    });
    
    if (!result.cancelled) {
      uploadBg(result.uri).then(res=>{
        this.setState({
          bgImage: "https://www.grubhouse.co.uk/upload/"+res.details
        })
      })
    }
    
    // this.chooseUpload();
  };
  setDataFromFollowing=(data)=>{
    this.setState({
      followers: data.follower,
      following: data.following,
      users: data.users,
    })
  }

  
  goMessage = ()=>{
    // console.log(this.props.navigation.state.params.client)
    this.props.navigation.navigate("SendMessage", {
      msg: this.props.navigation.state.params.client,
      reload: ()=>{}
    })
  }

  render() {
    return (
      // back ground container
      <View style={styles.bgContainer}>
        <Dialog
          width={300}
          height={150}
          visible={this.state.visible}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              <DialogButton
                text="Camera"
                onPress={()=>{this._pickImage("camera")}}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
              <DialogButton
                text="Gallery"
                onPress={this._pickImageFromLibrary}
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

        <Dialog
          width={300}
          height={150}
          visible={this.state.bgVisible}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              <DialogButton
                text="Camera"
                onPress={()=>{this._pickBgImage("camera")}}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
              <DialogButton
                text="Gallery"
                onPress={this._pickBgImageFromLibrary}
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
            >Please select Camera or Gallery to get background image</Text>
          </DialogContent>
        </Dialog>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <View style={styles.rbSheetContainer}>
          <TouchableOpacity 
              style={styles.itemContainer}
              Component={TouchableOpacity}
            >
              <View style={styles.groupBtn}>
                <Icon 
                  name="camera"
                  // reverse
                  color="black"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                />
              </View>
              <View 
                style={{width: "80%"}}>
                <Text
                  onPress={()=>{
                    this.RBSheet.close()
                    this.setState({bgVisible:true})
                  }} 
                >
                  Change the background
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.itemContainer}
              Component={TouchableOpacity}
            >
              <View style={styles.groupBtn}>
                <Icon 
                  name="camera"
                  // reverse
                  color="black"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                />
              </View>
              <View 
                style={{width: "80%"}}>
                <Text
                  onPress={()=>{
                    this.RBSheet.close()
                    this.setState({visible:true})
                  }} 
                >
                  Select Profile Picture
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              Component={TouchableOpacity}
              style={styles.itemContainer}
              >
              <View style={styles.groupBtn}>
                <Icon 
                  name="image-album"
                  // reverse
                  color="black"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                />
              </View>
              <View 
                style={{width: "80%"}}
                Component={TouchableOpacity}>
                <Text
                  onPress={()=>{
                    this.RBSheet.close()
                    addFoodCourt()
                  }}
                >
                  Add to Food Court
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <ScrollView>
          {/* image backgroun container */}
          <ImageBackground
            source={{uri: this.state.bgImage}}
            style={styles.imageContainer}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0,0.1)"
              }}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="email-outline"
                  reverse
                  reverseColor="gray"
                  color="#fff"
                  type="material-community"
                  size={15}
                  iconStyle={styles.icon1}
                  Component={TouchableOpacity}
                  onPress={this.goMessage}
                />
                <TouchableOpacity 
                  style={this.state.followingState?styles.followingContainer:styles.followContainer}
                  onPress = {()=>{this.toggleFollow()}}
                >
                  <Text style={this.state.followingState?styles.followingText:styles.followText}>{this.state.followingState?"following":"follow"}</Text>
                </TouchableOpacity>
              </View>
              
              {/* avatar container */}
              <View style={styles.avatarContainer}>
                <Avatar
                  rounded
                  size={100}
                  source={{uri: "https://www.grubhouse.co.uk/upload/"+this.props.navigation.state.params.client.avatar}}
                  editButton={{name: 'mode-edit', type: 'material', color: '#fff', underlayColor: '#000'}}
                  showEditButton= {false}
                />
                <Text style={styles.naameText}>{this.props.navigation.state.params.client.first_name}</Text>
                
              </View>
              <View style={{width: "100%", position: "relative", height: 20}}>
                
              </View>
              {/* favourite back container */}
              <View style={styles.backContainer}>
                <TouchableOpacity
                  style={styles.favourateContainer}
                  // onPress={() => this.props.navigation.navigate("Favourites")}
                  onPress={()=>getMyfavourite(this.props.navigation.state.params.client.client_id, this.props.navigation.state.params.client.first_name)}
                >
                  <Text style={styles.numberText}>{this.state.favorite.length?this.state.favorite.length:0}</Text>
                  <Text style={styles.favourateText}>Favourite</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("FollowingP",{
                    followers: this.state.followers,
                    following: this.state.following,
                    selectedIndex: 0,
                    setData: this.setDataFromFollowing
                  })}
                >
                  <Text style={styles.numberText}>{typeof this.state.followers!="undefined"?this.state.followers.length?this.state.followers.length:0:0}</Text>
                  <Text style={styles.favourateText}>Followers</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("FollowingP", {
                    following: this.state.following,
                    followers: this.state.followers,
                    selectedIndex: 1,
                    setData: this.setDataFromFollowing
                  })}
                >
                  <Text style={styles.numberText}>{typeof this.state.following!="undefined"?this.state.following.length?this.state.following.length:0:0}</Text>
                  <Text style={styles.favourateText}>Following</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          </ImageBackground>
          <FlatGrid
            itemDimension={global.CONSTANT.WIDTH / 3 - 20}
            items={this.state.foodCourt}
            renderItem={({ item: item }) => (
              <TouchableOpacity
                onPress={()=>{getFCourtDetail(item.id)}}
              >
                                {item.file_type =="video"?<Video
                                              source={{ uri:  "https://www.grubhouse.co.uk/upload/"+item.image}}
                                              rate={1.0}
                                              volume={0.0}
                                              isMuted={false}
                                              resizeMode="cover"
                                              shouldPlay
                                              isLooping
                                              style={styles.image} 
                                          />:<Image source={{ uri:  "https://www.grubhouse.co.uk/upload/"+item.image}} style={styles.image} />}
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  followContainer: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgb(114, 172, 226)",
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingVertical: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  followingContainer: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "gray",
    paddingHorizontal: 10,
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  followText: {
    color: "rgb(114, 172, 226)",
    fontSize: 18
  },
  followingText: {
    color: "gray",
    fontSize: 18
  },
  notificationText: {
    fontSize: 16,
    alignSelf: "center",
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  dialogContainer:{
    width: 200,
    height: 150,
    margin: "auto"
  },
  buttonContainer:{
    // flex: 9,
    marginLeft: 35,
    marginRight: 4
  },
  groupBtn: {
    height: 40, 
    width: 40, 
    marginRight: 10,
    borderRadius: 40,
    backgroundColor: "#E5E6EB",
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rbSheetContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    borderRadius: 50,
    justifyContent: "space-around",
    height: "100%"
  },
  bgContainer: {
    flex: 1,
    width: null
  },
  imageContainer: {
    // height: 320
    flex: 0.4
  },
  avatarContainer: {
    alignSelf: "center",
    // marginTop: 30
    // marginTop: "-13%"
    alignItems: "center",
    width: "100%", 
    position: "relative"
  },
  iconContainer: {
    marginTop: global.CONSTANT.STATUSBAR + 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    width: "100%",
    height: 60
    // backgroundColor: "rgba(0, 0, 0,0.1)"
  },
  icon: {
    margin: 3
  },
  naameText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff"
  },
  locationText: {
    color: "#fff",
    textAlign: "center"
  },
  backContainer: {
    borderColor: "#fff",
    borderWidth: 1.5,
    margin: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  favourateContainer: {
    alignSelf: "center",
    marginHorizontal: 14
  },
  numberText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center"
  },
  favourateText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    resizeMode: "contain"
  },
  divider: {
    height: 62,
    width: 1,
    backgroundColor: "#fff"
  },
  image: {
    height: global.CONSTANT.WIDTH / 3 - 7.2,
    width: global.CONSTANT.WIDTH / 3 - 7.2,
    resizeMode: "cover",
    marginVertical: -3.2
  }
  // orderContainer: {
  //   backgroundColor: global.COLOR.PRIMARY,
  //   height: 40,
  //   width: 156,
  //   borderRadius: 10,
  //   // marginBottom: 6,
  //   marginTop: 10
  // }
  // borderBackContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-evenly"
  // },
  // text: {
  //   textAlign: "center",
  //   fontSize: 14,
  //   fontWeight: "bold",
  //   marginTop: 10,
  //   color: "#fff"
  // },

  // likedText: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   margin: 11
  // },
  // overlay2: {
  //   height: 130,
  //   width: 116,
  //   marginTop: 4,
  //   resizeMode: "contain"
  // }
});
