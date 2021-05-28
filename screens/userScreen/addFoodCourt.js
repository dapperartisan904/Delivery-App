import React, { Component } from "react";
import Axios from "axios";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  CheckBox
} from "react-native";
import {
  Card,
  Form,
  Item,
  Input,
  Picker,
} from "native-base"
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
import {uploadAvatar, addFoodCourtApi, uploadFile} from "../../utils/Api"
import SearchableDropdown from 'react-native-searchable-dropdown';
import { rest } from "lodash";
import ProgressCircle from 'react-native-progress-circle'
import parse from "../../utils/parse";
import stringify from "../../utils/stringify";
import { Video } from 'expo-av';
var items = [];
export default class addFoodCourt extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.getPermissionAsync();

    this.state = {
      star: [
        1,2,3,4,5
      ],
      rate: 1,
      visible: false,
      videoVisible: false,
      imageUri: '',
      uploadFile: "",
      scroll: true,
      items: items,
      dish: [],
      food_name: "",
      progressPercent: 0,
      videoFile:"",
      approvedFlag: false
    };
  }

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
  componentDidMount(){
    var temp = []
    var dishTemp = []
    // console.log(this.props.navigation.state.params.data, "adfasdfadsfasdfadsf")
    if(this.props.navigation.state.params.data.merchant){
      this.props.navigation.state.params.data.merchant.map((res, id)=>{
        if(res.restaurant_name){
          temp.push({
            id: res.merchant_id,
            name: res.restaurant_name
          })
        }
      })
      this.setState({items: temp})
    }
    if(this.props.navigation.state.params.data.merchant[0].menu){
      this.props.navigation.state.params.data.merchant[0].menu.list.map((item, index)=>{
        item.item.map((dish, j)=>{
          if(dish.item_name){
            dishTemp.push({
              id: dish.item_id,
              name:dish.item_name
            })
          }
        })
      })
    }
    this.setState({
      dish: dishTemp
    })
  }
  selectRate=(index)=>{
    this.setState({rate: index+1})
  }

  dialogHide = ()=> {
    this.setState({
      visible: false,
      videoVisible: false
    })
  }
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
    // console.log(result)

    if (!result.cancelled) {
      this.setState({
        uploadFile: result,
        videoFile: ''
      });
    }
    this.dialogHide()
    // this.chooseUpload();
  };

  _pickImageFromLibrary=async()=>{
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(result)

    if (!result.cancelled) {
      this.setState({
        uploadFile: result,
        videoFile: ''
      });
      // uploadAvatar(result.uri)
    }
    this.dialogHide()
  }

  _pickVideoFromLibrary=async()=>{
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(result)
    this.dialogHide()

    if (!result.cancelled) {
            var data = new FormData();
            var unix = Math.round(+new Date()/1000);
            var timestamp = unix+"000";
            
            var data = new FormData();
            data.append("api_key", " admin@1474?");
            data.append("client_id", global.USER.details.client_info.client_id)
            data.append('file', {
              uri: result.uri, 			// this is the path to your file. see Expo ImagePicker or React Native ImagePicker
              type: result.type=="image"?"image/jpg":"video/mp4",  // example: image/jpg
              name: "foodcourt"+timestamp+".mp4"   // example: upload.jpg
            })
            data.append("user_token", global.USER.details.client_info.token)
            
            await Axios.post('UploadFile', data, {
                onUploadProgress: (progressEvent) => {
                          // console.log("asdff")
                        if (progressEvent.lengthComputable) {
                          //  // console.log(progressEvent.loaded + ' ' + progressEvent.total);
                          //  this.updateProgressBarValue(progressEvent);
                          this.setState({progressPercent: progressEvent.loaded/progressEvent.total})
                        }
               }   
            }).then(res=>{
              // console.log(res.data.details)
              this.setState({
                videoFile: res.data.details,
                uploadFile: result
              })
            });
  }
  }
  shareVideo = ()=>{
    if(this.state.food_name==""){
      alert("Please Insert the dish name")
    } else if(this.state.location==""){
      alert("Please insert your location")
    } else if (this.state.price ==0){
      alert("Please insert the price of dish")
    } else if (this.state.uploadFile == ""){
      alert("Please select food court image")
    } else{
      
      addFoodCourtApi({
        location: this.state.location,
        merchant_id: this.state.merchant_id,
        food_name: this.state.food_name,
        rating: this.state.rate,
        description: stringify(this.state.description),
        price: 0,
        file_type: this.state.uploadFile.type
      },this.state.videoFile).then(res=>{
        if(res.code==1){
          alert("Food court is inserted")
        } else {
          alert("Upload is failed, try again please")
        }
      })
    }
  }

  share=()=>{
    if(this.state.food_name==""){
      alert("Please Insert the dish name")
    } else if(this.state.location==""){
      alert("Please insert your location")
    } else if (this.state.price ==0){
      alert("Please insert the price of dish")
    } else if (this.state.uploadFile == ""){
      alert("Please select food court image")
    } else{
      uploadFile(this.state.uploadFile, "foodcourt").then(res=>{
        // console.log(res, "response data from upload file")
          addFoodCourtApi({
          location: this.state.location,
          merchant_id: this.state.merchant_id,
          food_name: this.state.food_name,
          rating: this.state.rate,
          description: stringify(this.state.description),
          price: 0,
          file_type: this.state.uploadFile.type,
          approved: this.state.approved?"approved":"disapproved"
        },res.details).then(res=>{
          if(res.code==1){
            alert("Food court is inserted")
          } else {
            alert("Upload is failed, try again please")
          }
        })
      })
    }
  }
  selectLocation=(text)=>{
    // console.log(text)
    this.setState({
      location: text.name,
      merchant_id: text.id
    })
    var dishTemp = []

    this.props.navigation.state.params.data.merchant.map((res, id)=>{
      // console.log(res)
      if(res.merchant_id == text.id){
        // console.log(text.id, res)

        if(typeof res.menu != "undefined")
        res.menu.list.map((item, index)=>{
          item.item.map((dish, j)=>{
            if(dish.item_name){
              dishTemp.push({
                id: dish.item_id,
                name:dish.item_name
              })
            }
          })
        })
      }
    })
    // console.log(text)
    this.setState({dish: dishTemp})
  }
  selectDish=(text)=>{
    this.setState({
      food_name: text.name,
      item_id: text.id
    })
    // console.log(text)
  }
  render() {
    return (
      // back ground container
      <View style={styles.bgContainer}>
        <SafeAreaView>
        <ScrollView keyboardShouldPersistTaps="always">
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
          visible={this.state.videoVisible}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              {/* <DialogButton
                text="Camera"
                onPress={()=>{this._pickImage("camera")}}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton> */}
              <DialogButton
                text="Gallery"
                onPress={this._pickVideoFromLibrary}
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
            >Please select video in your gallery to upload</Text>
          </DialogContent>
        </Dialog>
        <View style={styles.header}>
          <View style={styles.closeContainer}>
            <Icon 
              name="close"
              // reverse
              color="#fff"
              type="material-community"
              size={20}
              iconStyle={styles.icon1}
              onPress={()=>{
                this.props.navigation.goBack(null)
              }}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={{color: "#fff", fontSize: 18, textAlign: "center"}}>
              About your dish
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 18}}>
              Add a photo of your dish
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
            style={styles.btn}
            Component={TouchableOpacity}
            onPress={()=>{this.setState({visible: true})}}
            >
              <Icon 
                name="camera"
                // reverse
                color="#fff"
                type="material-community"
                size={30}
                iconStyle={styles.icon1}
              />
              <Text style={{fontSize: 16, color: "#fff", textAlign: "center"}}>
                Camera or Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.btn} 
            Component={TouchableOpacity}
            onPress={()=>{this.setState({videoVisible: true})}}
            >
              {this.state.progressPercent?
                  <ProgressCircle
                    percent={this.state.progressPercent*100}
                    radius={30}
                    borderWidth={8}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff"
                  >
                    <Text style={{ fontSize: 18 }}>{(this.state.progressPercent*100).toFixed(0)}%</Text>
                </ProgressCircle>:[<Icon 
                name="youtube"
                // reverse
                color="#fff"
                type="material-community"
                size={30}
                iconStyle={styles.icon1}
              />,
              <Text style={{fontSize: 16, color: "#fff"}}>
                Video access
              </Text>]}
              
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={{marginBottom: 0}} 
            onPress={()=>{this.setState({visible: false, imageUri: ""})}}
          >
            <Text style={{fontSize: 14, color: "blue"}}>
              {this.state.uploadFile!=""?"File is attached":""}
            </Text>
          </TouchableOpacity>
          {this.state.uploadFile!=""?this.state.videoFile?<Video
                                              source={{ uri:  this.state.uploadFile.uri}}
                                              rate={1.0}
                                              volume={1.0}
                                              isMuted={false}
                                              resizeMode="cover"
                                              shouldPlay
                                              isLooping
                                              style={styles.image2} 
                                          />:<Image source={{ uri:  this.state.uploadFile.uri}} style={styles.image2} />:null}
          <View style={{marginBottom: 10}}
          >
            <Text style={{fontSize: 18, color: "gray"}}>
              Tag where your dish is from
            </Text>
          </View>
          <View style={{marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#6599D9"}}>
              <SafeAreaView>

              <SearchableDropdown
              onTextChange={text => this.setState({location: text})}
              onItemSelect={item => this.selectLocation(item)}
              containerStyle={{ padding: 5, zIndex: 20 }}
              listProps={ {nestedScrollEnabled: true} }
              textInputStyle={{
                padding: 4,
                color: "gray", 
                backgroundColor: "#F3F3F3",
              }}
              itemStyle={{
                padding: 4,
                marginTop: 2,
                backgroundColor: "#F5F5F5",
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: '#222' }}
              itemsContainerStyle={{ maxHeight: 250 }}
              items={this.state.items}
              defaultIndex={1}
              placeholder="Choose restaurant | home chef dish is from"
              resetValue={false}
              underlineColorAndroid="transparent"
            />
              </SafeAreaView>

          </View>
          <View style={{marginBottom: 10}}>
            <Text style={{fontSize: 18, color: "gray"}}>
              Name of your dish
            </Text>
          </View>
          <View style={{marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#6599D9"}}>
              <SafeAreaView>
            <SearchableDropdown
              onTextChange={text => this.setState({food_name: text})}
              onItemSelect={item => this.selectDish(item)}
              containerStyle={{ padding: 5, zIndex: 20 }}
              listProps={ {nestedScrollEnabled: true} }
              textInputStyle={{
                padding: 4,
                color: "gray", 
                // borderBottomColor: "#1A73E8",
                // borderBottomWidth: 1,
                backgroundColor: "#F3F3F3",
              }}
              itemStyle={{
                padding: 4,
                marginTop: 2,
                backgroundColor: "#F5F5F5",
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: '#222' }}
              itemsContainerStyle={{ maxHeight: 250 }}
              items={this.state.dish}
              defaultIndex={1}
              placeholder="Name"
              resetValue={false}
              underlineColorAndroid="transparent"
            />
            </SafeAreaView>
            </View>
          <View style={{marginBottom: 2}}>
            <Text style={{fontSize: 18}}>
              Rate from 1 to 5
            </Text>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 16}}>
              Note for me
            </Text>
          </View>
          <View style={{marginBottom: 5, flexDirection: "row"}}>
            {this.state.star.map((item, index)=>{
              return <Icon
                key={index}
                name="star"
                type="material-community"
                color={this.state.rate>index?"#FBBC3A":"gray"}
                onPress={()=>{this.selectRate(index)}}
              />
            })}
            
          </View>
          <View style={styles.ratingContainer}>
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={{fontSize: 18, color: "gray"}}>
              Leave a comment(optional)
            </Text>
          </View>
          <View style={{marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#6599D9"}}>
            <TextInput style={styles.input}
                placeholder='Description'
                onChangeText={(v) => { this.setState({ description: v }) }}
                inputStyle={styles.inputText}
                value={this.state.description}
              />
          </View>
          <View style={{marginBottom: 20, display: "flex", flexDirection:"row", justifyContent: "center", alignItems:"center"}}>
            <CheckBox
              value={this.state.approvedFlag}
              onValueChange={()=>{this.setState({approvedFlag: !this.state.approvedFlag})}}
              style={styles.checkbox}
            />
            <Text>Approved</Text>
          </View>
          
          {this.state.uploadFile!=""?<TouchableOpacity 
            style={styles.btnShare} 
            Component={TouchableOpacity}
            onPress={this.state.videoFile?this.shareVideo:this.share}
            >
            <Text style={{fontSize: 18, color: "#fff"}}>
              Share
            </Text>
          </TouchableOpacity>:null}
          
        </View>
        </ScrollView>
        </SafeAreaView>
      </View>
       
    );
  }
}

const styles = StyleSheet.create({
  image2 :{
    width: 150,
    height: 150,
    marginBottom: 30,
    alignSelf: "center"
  },
  ratingContainer:{
    marginBottom: 20
  },
  inputText: {
    color: "white", 
    backgroundColor: "#1A73E8",
    borderBottomColor: "#1A73E8",
    borderBottomWidth: 1,
    fontSize: 20
  },
  btn: {
    borderRadius: 5,
    backgroundColor: "#1A73E8",
    width: "40%",
    flexDirection: "column",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "space-around",
    alignItems: "center",
    height: 100
  },
  btnShare: {
    borderRadius: 5,
    backgroundColor: "#1A73E8",
    width: "100%",
    flexDirection: "column",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "space-around",
    alignItems: "center"
  },
  btnContainer:{
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: 25
  },
  mainContainer:{
    padding: 25
  },
  closeBtn:{
    
  },
  title: {

  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  closeContainer: {
    position: "absolute",
    top: 58,
    left: 30
  },
  header: {
    flexDirection: "row",
    height: 110,
    backgroundColor: "#1A73E8",
    color: "#fff",
    alignItems: "flex-end",
    paddingBottom: 30
  },
  bgContainer:{
    flexDirection: "column"
  }
});
