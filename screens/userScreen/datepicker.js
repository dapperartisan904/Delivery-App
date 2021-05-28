import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity,TextInput,ImageBackground,ScrollView,FlatList, } from "react-native";
import global from "../../global";
import { Button,Input } from "react-native-elements";
import * as Animatable from "react-native-animatable";
// import DateTimePicker from '@react-native-community/datetimepicker';
import Api from '../../utils/Api';

export default class sendGift extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateshow:false,
            timeshow:false,
            datetitle:"Click here",
            timetitle:"Click here",
            fAdress:'',
            fNoti:'',
        }
    }
    static navigationOptions = {
        title: "Send Gift",
        headerStyle: {
        backgroundColor: "#fff"
        },

        headerTintColor: "#000",

        headerTitleStyle: {
        // fontWeight: "bold"
        fontFamily: global.FONT.Simonetta_Regular
        }
    };
    showDatepicker = () => {
        this.setState({
            timeshow:false,
            dateshow:true,
        })
    }
    showTimepicker = () => {
        this.setState({
            dateshow:false,
            timeshow:true,
        })
    }
    onChangeData = (value) => {
      this.setState({
        datetitle:value.getFullYear()+"-"+(value.getMonth()+1)+"-"+value.getDate(),
        dateshow:false,
      })
    }

    onChangeTime=(value)=>{
      this.setState({
        timetitle:value.getHours()+" : "+value.getMinutes(),
        timeshow:false,
      })
    }
    onChangeNoti = (text) =>{
      this.setState({
        fNoti:text,
      })
    }
    onChangeAddress = (text)=>{
      this.setState({
        fAdress:text,
      })
    }
    render() {
     return (
      // background container
      <ScrollView style={styles.bgContainer}>
        <View style={styles.bgContainer}>
            <View style={styles.upperContainer}></View>
            <View style={styles.bottomContainer}>
                <View style={styles.headerTextContainer}>
                  <ImageBackground source={global.ASSETS.GIFTPNG} style={styles.textContainer}>
                    <View style={{marginTop:30,}}>
                      <Text style={styles.headerText}>Enter your friends</Text>
                      <Text style={styles.headerText}>address you want to</Text>
                      <Text style={styles.headerText}>send the food to.</Text>
                    </View>
                  </ImageBackground>
                </View>
                <View>
                  <Text style = {{fontSize:16,marginLeft:30,fontWeight:'bold',}}>Address:</Text>
                </View>
                <View>
                  <Input
                      placeholder="Input your friend's address"
                      placeholderTextColor="gray"
                      inputContainerStyle={styles.inputFiedContainer}
                      keyboardType="default"
                      onChangeText = {text => this.onChangeAddress(text)}
                      inputStyle={styles.inputText}
                  />
                </View>
                <View style = {styles.pickersection}>
                  <Text style = {styles.picktitles}>Time you want order delivered to this address:</Text>
                  <Text onPress={this.showTimepicker} style={styles.picker} >{this.state.timetitle}</Text>
                  {/* Time picker */}
                  {this.state.timeshow&&
                      <DateTimePicker
                      testID="dateTimePicker"
                      value={new Date()}
                      mode='time'
                      is24Hour={true}
                      display="default"
                      onChange={(event, value) => {
                        // console.log(value)
                        this.setState({
                            dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                        });

                        if (event.type === "set")this.onChangeTime(value)
                            
                    }}
                  />
                  }
                </View>
                <View style = {styles.pickersection}>
                  <Text style = {styles.picktitles}>Date order should be sent:</Text>
                  <Text onPress={this.showDatepicker}  style={styles.picker}>{this.state.datetitle}</Text>
                    {/* Date Picker */}
                    {this.state.dateshow&&<DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode='date'
                        is24Hour={true}
                        display="spinner"
                        format="YYYY-MM-DD"
                        minDate="1980-05-01"
                        maxDate="2060-06-01"
                        onDateChange={(date) => {
                          // console.log(date);
                          this.setState({ datetitle: date });
                        }}
                        onChange={(event, value) => {
                          // console.log(value)
                          this.setState({
                              dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                          });
                          
                          // if (event.type === "set") this.onChangeData(value)
                      }}
                    />}
                </View>
               
                <View>
                  <View style = {{marginLeft:"10%",fontSize:18, marginTop:20,}}>
                    <Text >Note for friend</Text>
                  </View>
                  <View>
                    <TextInput
                      multiline = {true}
                      style={styles.textareas}
                      onChangeText={text => this.onChangeNoti(text)}
                      // value={value}
                    />
                  </View>
                  
                </View>
                <View style={styles.buttonFlexContainer}>
                  <Animatable.View animation="flipInY">
                    <Button
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.buttonStyle}
                        title="Find Restaurant"
                        titleStyle={styles.buttonTitle}
                        
                        TouchableComponent={TouchableOpacity}
                        onPress={
                          this.state.fAdress&&this.state.fNoti&&this.state.datetitle!="Click here"&&this.state.timetitle!="Click here"?()=>this.props.navigation.navigate("AddressSearch"):()=>false
                          
                        }
                    />
                  </Animatable.View>
              </View>
            </View>
        </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pickersection:{
    flexDirection: "row",
    marginTop:15,
    justifyContent: "space-around",
    marginLeft:"5%",
  },
  picktitles:{
    textAlign:"center",
    fontSize:15,
    flex:0.5,
    fontFamily: global.FONT.Simonetta_Regular,
  },  
  inputText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    textAlign:"center",
  },
  textareas:{
    borderColor: 'gray',
    borderWidth: 1 ,
    height:150,
    borderRadius:10,
    textAlignVertical: 'top',
    marginLeft:"5%",
    marginRight:"5%",
    paddingTop:10,
    paddingBottom:5,
    paddingLeft:8,
    paddingRight:8,
    fontSize:18,

  },
  textContainer: {
    height: 200,
    // width: 400
  },
  headerTextContainer:{
    height: 200,
  },
  headerText:{
    textAlign:"center",
    fontSize:40,
    fontFamily:global.FONT.ITALIC,
  },

  inputFiedContainer: {
    // borderWidth: 1,
    marginLeft:"5%",
    marginRight:"5%",
    borderColor: "gray",
    width: "80%",
    borderBottomWidth:2,
    // marginTop: 5
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  picker:{
    fontSize:20,
    flex:0.5,
    alignContent:"center",
    textAlign:"center",
  },
  bgContainer: {
    flex: 0.8,
    width: null
  },
  upperContainer: {
    flex: 0.3,
    backgroundColor: "#fff"
  },
  bottomContainer: {
    flex: 0.7,
    backgroundColor: "#FFFFFF"
  },
  image: {
    height: 150,
    width: 300,
    resizeMode: "cover",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: -100
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "rgba(0,0,0,0.08)"

    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 40,
    width: 200,
   
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    
  },
  buttonFlexContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom:50,
  },
  giftText: {
    fontSize: 20,
    fontFamily: global.FONT.Simonetta_Regular,
    textAlign: "center",
    marginHorizontal: 14,
    marginVertical: 20
  }
});
