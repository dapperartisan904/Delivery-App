import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import global from "../../global";
import { Icon, Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import urban from "../../assets/urban.png";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

export default class trafficLight extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        {/* upper container */}
        <View style={styles.upperContainer}>
          <View style={styles.rotationContainer}>
            <View style={styles.proccessBar}>
              <ProgressSteps
                activeStep={1}
                progressBarColor="#fff"
                borderWidth={4}
                activeStepIconBorderColor="#fff"
                completedProgressBarColor="red"
                activeStepNumColor="#fff"
                disabledStepNumColor="#000"
                completedCheckColor="#fff"
              >
                <ProgressStep>
                  <View style={{ alignItems: "center" }}></View>
                </ProgressStep>
                <ProgressStep>
                  <View style={{ alignItems: "center" }}></View>
                </ProgressStep>
                <ProgressStep>
                  <View style={{ alignItems: "center" }}></View>
                </ProgressStep>
                <ProgressStep>
                  <View style={{ alignItems: "center" }}></View>
                </ProgressStep>
              </ProgressSteps>
            </View>
            <View>
              <View style={styles.textContainer}>
                <Text style={styles.orderText}>Awaiting Confirmation</Text>
                <Text style={styles.bootomText}>
                  The restaurant will confirm your order soon.
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.orderText}>Order Confirmed</Text>
                <Text style={styles.bootomText}>
                  Thumbs-up from the restaurant.
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.orderText}>On its way</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.orderText}>Enjoy your food</Text>
              </View>
            </View>
          </View>
        </View>

        {/* bottom Container */}
        <View style={styles.bottomContainer}>
          <Divider style={styles.divider} />
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.deliverText}>Delivering around</Text>
            <Text style={styles.timeContainer}>18:15</Text>
          </View>
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Can we help with anything?</Text>
            <Icon
              name="chevron-down"
              color={global.COLOR.PRIMARY}
              type="material-community"
              size={32}
              iconStyle={{ marginTop: 5 }}
              Component={TouchableOpacity}
            />
          </View>
          <Image source={urban} style={styles.image} />
          <Text style={styles.urbanText}>
            The Urban Chocolatier (Urban Park)
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: global.COLOR.PRIMARY
  },
  upperContainer: {
    flex: 0.5,
    backgroundColor: global.COLOR.PRIMARY,
    marginTop: global.CONSTANT.STATUSBAR + 20
    // marginHorizontal: 30
  },
  rotationContainer: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  proccessBar: {
    transform: [{ rotate: "90deg" }],
    // alignSelf: "flex-start",
    // width: 10,
    marginRight: 30,
    marginTop: -20,
    width: 325
  },
  bottomContainer: {
    flex: 0.5,
    backgroundColor: "#fff",
    justifyContent: "space-evenly"
  },
  orderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: global.COLOR.SECONDARYTEXT
    // marginHorizontal: 20
  },
  bootomText: {
    color: global.COLOR.SECONDARYTEXT,
    fontSize: 12
    // marginBottom: 60
  },
  textContainer: {
    marginBottom: 45,
    marginRight: 30,
    marginTop: 10
  },
  divider: {
    height: 3,
    width: 50,
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: global.COLOR.PRIMARY,
    borderRadius: 10
  },
  deliverText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginVertical: 10
  },
  timeContainer: {
    fontSize: 40,
    textAlign: "center"
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  helpText: {
    fontSize: 14,
    color: global.COLOR.PRIMARY,
    margin: 10
  },
  image: {
    alignSelf: "center",
    height: 130,
    width: 130,
    resizeMode: "cover"
    // marginTop: 24
  },
  urbanText: {
    textAlign: "center",
    color: global.COLOR.PRIMARY,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  }
});
