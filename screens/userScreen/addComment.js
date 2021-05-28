import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard
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
import { getPushNotificationPermissions, registerForPushNotificationsAsync, sendNotification } from "../../utils/NotificationApi";
import parse from "../../utils/parse";
import stringify from "../../utils/stringify";

export default class addComment extends Component {
  static navigationOptions = {
    title: "Comment",
    headerStyle: {
      backgroundColor: "#fff",
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
    },
  };
  constructor(props) {
    super(props);

    this.state = {
      star: [
        1,2,3,4,5
      ],
      rate: 0,
      visible: false,
      imageUri: '',
      fc_id: this.props.navigation.state.params.fc_id,
      data: [],
      visible: false,
      modalContent: '',
      content: {
        content: "",
        avatar: "",
        name: ""
      },
      keyboardSpace: 0
    };
  }
  onaddComment = ()=>{
    addCommentApi({
      fc_id: this.state.fc_id,
      comment: this.state.comment 
    }).then(res=>{
      sendNotification(res.details.expoToken[0].expo_token, {
        title: "Notification",
        body: global.USER.details.client_info.first_name+" have commented your food court",
        by_id: this.state.fc_id,
        by_type: "comment"
      }, {
        client_id: res.details.expoToken[0].client_id,
        client_name: res.details.expoToken[0].client_name
      })
      this.getDataHide()
      this.setState({comment: ""})
    })
  }
  componentDidMount=()=>{
    this.getData()
    if(Platform.OS == "ios"){
      const showEvt = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
      Keyboard.addListener(showEvt, this.updateKeyboardSpace);
      const hideEvt = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
      Keyboard.addListener(hideEvt, this.resetKeyboardSpace);
    }
    
  }
  componentWillUnmount(){
    if(Platform.OS == "ios"){
      const showEvt =  Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
      Keyboard.removeListener(showEvt, this.updateKeyboardSpace);
      const hideEvt =  Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
      Keyboard.removeListener(hideEvt, this.resetKeyboardSpace);
    }
    
  }
  updateKeyboardSpace = (event)=>{
    const screenHeight = Dimensions.get('window').height;
    const newKeyboardSpace = screenHeight - event.endCoordinates.screenY;
    // console.log(newKeyboardSpace)
    this.setState({keyboardSpace: newKeyboardSpace})
  }
  resetKeyboardSpace = ()=>{
    this.setState({keyboardSpace: 0})
    // console.log(0)
  }
  getData=()=>{
    getComments(this.state.fc_id).then(res=>{
      this.setState({data: res.details})
    })
  }
  getDataHide=()=>{
    getCommentsHide(this.state.fc_id).then(res=>{
      this.setState({data: res.details})
    })
  }
  dialogHide = ()=> {
    this.setState({visible: false,})
  }
  modalShow =(content, avatar, name) =>{
    this.setState({
      content: {
        content: content,
        avatar: avatar,
        name: name
      },}, ()=>{
        this.setState({visible: true})
      })
  }
  render() {
    return (
      <SafeAreaView style={styles.bgContainer}>
        <Dialog
          width={global.CONSTANT.WIDTH-80}
          // height={150}
          visible={this.state.visible}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              <DialogButton
                text="O K"
                onPress={this.dialogHide}
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
            >{this.state.content.content}</Text>
          </DialogContent>
        </Dialog>

        <ScrollView style={styles.commentContainer}>
          {this.state.data.length>=1?this.state.data.map((comment, index)=>{
            
            return <Card style={styles.commentField} key={index}>
                    <Avatar
                      source={{ uri: "https://www.grubhouse.co.uk/upload/"+comment.avatar}}
                      size="small"
                      rounded
                    />
                    <Text style={styles.clientName}>
                      {comment.first_name}:
                    </Text>
                    <Text
                      style={styles.content}
                      numberOfLines={3}
                    >
                      {parse(comment.comment)}
                    </Text>
                    <Icon 
                      name="eye"
                      // reverse
                      color="gray"
                      type="material-community"
                      size={20}
                      iconStyle={styles.icon1}
                      Component={TouchableOpacity}
                      onPress={()=>{this.modalShow(parse(comment.comment), comment.avatar, comment.first_name)}}
                    />
                  </Card>
          }):null}
          
        </ScrollView>
        <Card style={styles.refresh} >
            <Icon 
              name="reload"
              // reverse
              color="#fff"
              type="material-community"
              size={20}
              iconStyle={styles.icon1}
              Component={TouchableOpacity}
              onPress={this.getData}
            />
          </Card>
        <View 
          style={{
            height: 55,
            width: "100%",
            borderRadius: 5,
            backgroundColor: global.COLOR.PRIMARY,
            color: "#fff",
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: this.state.keyboardSpace
          }}>
          <View style={{width: "8%"}}>
            <Avatar
              source={{ uri: "https://www.grubhouse.co.uk/upload/"+global.USER.details.client_info.avatar }}
              size="small"
              rounded
            />
          </View>
          <View style={{width: "86%"}}>
            <TextInput 
              placeholder='Add a comment'
              onChangeText={(v) => { this.setState({ comment: v }) }}
              style={styles.inputText}
              value={this.state.comment}
            />
            </View>
          <View style={{
            borderRadius: 30, 
            borderColor: "#fff",
            borderWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: 'center',
            width: 30,
            height: 30,
            backgroundColor: "white"
          }}>
              <Icon 
                name="email-plus"
                // reverse
                color="white"
                type="material-community"
                size={20}
                iconStyle={styles.icon1}
                Component={TouchableOpacity}
                onPress={this.onaddComment}
              />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  refresh:{
    position: "absolute",
    right: 20,
    bottom: 75,
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: "white",
    color: "#fff",
    paddingTop: 2,
    paddingLeft:2,
    borderColor: global.COLOR.PRIMARY,
    borderWidth: 1
  },
  icon1:{
    color: global.COLOR.PRIMARY,
    // borderRadius: 30,
    width: 30,
    height: 30,
    padding: 5
  },
  clientName:{
    marginLeft: 15
  },
  content:{
    width: "65%",
    color: "gray",
  },
  contentComment:{
    color: "gray"
  },
  bgContainer:{
    width: "100%",
    height: "100%",
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#FFF"
  },
  addCommentField:{
    height: 55,
    width: "100%",
    borderRadius: 5,
    backgroundColor: global.COLOR.PRIMARY,
    color: "#fff",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  commentField:{
    height: 70,
    width: "98%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    margin: 5,
    padding: 5
  },
  commentContainer: {
    width: "100%",
  },
  inputText: {
    width: "90%",
    marginLeft: 20,
    color: "black",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    height: 40,
    alignItems: "flex-start",
    textAlignVertical: "center",
    padding: 5,
    backgroundColor: "#fdefdf"
  }
});
