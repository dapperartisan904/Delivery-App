import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import global from "../../global";
import * as MailComposer from "expo-mail-composer"
import { sendSupportEmail } from  "../../utils/Api"

export default class informationSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {
        mailBody:'',
        toemail:'support@grubhouse.co.uk',
        fromemail:"example@example.com",
        title: ''
    }
}
  static navigationOptions = {
    title: "Customer Service",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 22
    },
    headerRight: (
      <Image
        source={global.ASSETS.CUSTOMERSUPPORT}
        style={{ height: 40, width: 60, resizeMode: "cover" }}
      />
    )
  };
  onSubmit = () => {
    sendSupportEmail(this.state.mailBody, this.state.title).then(res=>{
      Alert.alert("GRUBHOUSE", "Successed!")
    })
  }
  onChangeText = (text) => {
    this.setState({
      mailBody:text,
    })
  }
  changeSubject = (txt)=>{
    this.setState({
      title: txt
    })
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View>
          <Text style={styles.suggestionText}>Tell Us What Happened</Text>
          <Text style={styles.regardText}>
            One of our caring supervisor will contact you promptly.
          </Text>
          <Text style={styles.regardText}>
            Please tell us more about your inquiry. The more details you share,
            the better.
          </Text>
          <Text style={styles.regardText1}>To : {this.state.toemail}</Text>
        </View>
        <View style={styles.textinput}>
          <Input
            placeholder="Email Title"
            placeholderTextColor="gray"
            inputContainerStyle={styles.mailsubject}
            keyboardType="default"
            onChangeText = {txt=>this.changeSubject(txt)}
            inputStyle={styles.inputsubject}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            inputContainerStyle={styles.inputFiedContainer}
            keyboardType="default"
            inputStyle={styles.inputText}
            multiline={true}
            onChangeText={text=>this.onChangeText(text)}
            numberOfLines={10}
          />
        </View>
        <View>
          <Text style={styles.numberText}>0/1500 Characters</Text>
        </View>
        <View>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            title="SUBMIT"
            titleStyle={styles.buttonTitle}
            TouchableComponent={TouchableOpacity}
            onPress={()=>this.onSubmit()}
            // onPress={() => this.props.navigation.navigate("ThankYou")}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textinput:{
    textAlign:"center",
    borderColor: "gray",
    // width: 140,
    borderBottomWidth: null
    },  
  
  inputsubject: {
    textAlign:"center",
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  suggestionText: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 20,
    color: "#8D8C92",
    textAlign: "center"
  },
  regardText: {
    fontSize: 20,
    color: "gray",
    alignSelf: "center",
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: 10
  },
  regardText1: {
    fontSize: 20,
    color: "black",
    alignSelf: "center",
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: 10
  },

  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "gray",
    width: "100%",
    height: "100%",
    textAlignVertical: 'top'
    // marginTop: 20
  },
  inputFiedContainer: {
    borderColor: "gray",
    borderBottomWidth: null,
    width: "100%",
    height: "100%",
    textAlignVertical: 'top'
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    // width: 140,
    borderBottomWidth: null,
    marginHorizontal: 10,
    height: 150,
    textAlignVertical: 'top'
  },
  numberText: {
    fontSize: 20,
    color: "gray",
    alignSelf: "flex-end",
    marginBottom: 30,

    marginHorizontal: 10
  },
  buttonContainer: {
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 20
    // marginHorizontal: 70
  },
  buttonStyle: {
    backgroundColor: "transparent",
    height: 60,
    width: 270
    // marginTop: 50
  },
  buttonTitle: {
    color: "#000",
    // fontWeight: "bold",
    fontSize: 26
  }
});
