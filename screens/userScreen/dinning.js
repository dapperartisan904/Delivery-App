import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ImageBackground
} from "react-native";
import global from "../../global";
import { Icon } from "react-native-elements";
import { Divider } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const DATA = [
  {
    id: "1",
    time: "13:45",
    offer: "2 offers"
  },
  {
    id: "2",
    time: "14:00",
    offer: "2 offers"
  },
  {
    id: "3",
    time: "14:15",
    offer: "2 offers"
  },
  {
    id: "4",
    time: "14:30",
    offer: "2 offers"
  },
  {
    id: "5",
    time: "14:45",
    offer: "2 offers"
  }
];

export default class dinning extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    // this.getData();
    this.state = {
      data: DATA
    };
  }
  render() {
    return (
      // background container
      <ScrollView style={styles.bgContainer}>
        <ImageBackground source={global.ASSETS.RESTO} style={styles.image}>
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="material-community"
              size={40}
              iconStyle={styles.backIcon}
              onPress={() =>
                this.props.navigation.navigate("DinningRestaurant")
              }
            />
          </View>
          {/* number container */}
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>3 of 20 {'>'}</Text>
          </View>
        </ImageBackground>

        {/* restaurant container */}
        <View>
          <Text style={styles.nameText}>Plateau Bar & Grill</Text>
          {/* review container */}
          <View style={styles.reviewContainer}>
            {/* flex container */}
            <View style={styles.flexContainer}>
              <Icon
                name="star"
                color="#009FFF"
                type="material-community"
                size={20}
              />
              <Icon
                name="star"
                color="#009FFF"
                type="material-community"
                size={20}
              />
              <Icon
                name="star"
                color="#009FFF"
                type="material-community"
                size={20}
              />
              <Icon
                name="star"
                color="#009FFF"
                type="material-community"
                size={20}
              />
              <Icon
                name="star"
                color="#fff"
                type="material-community"
                size={20}
              />
            </View>
            <View>
              <Text style={styles.ratingText}>871 reviews</Text>
            </View>
            <View>
              <Text style={styles.ratingText}>£25 and under</Text>
            </View>
          </View>
          <View>
            <Text style={styles.ratingText}>European</Text>
          </View>
          <View>
            <Text style={styles.ratingText}>
              4th Flr, Canada Place, London E14 5ER
            </Text>
          </View>
          {/* user container */}
          <View style={styles.userContainer}>
            <View style={styles.flexContainer}>
              <Icon
                name="account-outline"
                color="#000"
                type="material-community"
                size={26}
                iconStyle={styles.icon}
              />
              <Text style={styles.nowText}>2 . Now</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.tableText}>BOOK A TABLE</Text>
        </View>

        {/* table back container */}
        <View style={styles.flatlist}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("TableReservation");
                }}
              >
                <View style={styles.tableBackContainer}>
                  {/* table container */}
                  <View style={styles.tableContainer}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>{d.time}</Text>
                    </View>
                    <View style={styles.offerContainer}>
                      <Text style={styles.offerText}>{d.offer}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <Divider style={styles.divider}></Divider>
        <View style={styles.abilityContainer}>
          <Icon
            name="clock-outline"
            color="#009FFF"
            type="material-community"
            size={30}
          />
          <Text style={styles.abilityText}> Find future availability </Text>
        </View>
        <Divider style={styles.divider}></Divider>
        <View style={styles.abilityContainer}>
          <Icon
            name="star-circle"
            color="#009FFF"
            type="material-community"
            size={30}
          />
          <Text style={styles.abilityText}> Offers </Text>
        </View>
        <View>
          <Text style={styles.courcesText}>
            A Taste of Spring - Set menu : 2/3 cources £16/19
          </Text>
          <Text style={styles.bottomText}>Set menu : 2/3 cources £16/19 </Text>
          <Text style={styles.tableText}>Special note for 30 May</Text>
          <Text style={styles.bottomText}>
            Please note that Saturday brunch menu is available on Saturdays
            untill 3.30pm and the A La Carte menu will resume in the evening.
            {"\n"}
            Thank you
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  numberContainer: {
    backgroundColor: "gray",
    marginTop: global.CONSTANT.STATUSBAR + 100,
    height: 40,
    width: 120,
    borderRadius: 40,
    alignSelf: "center"
  },
  numberText: {
    textAlign: "center",
    marginTop: 8,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  nameText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  ratingText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center"
  },
  reviewContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10
  },
  offerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8
  },
  userContainer: {
    borderWidth: 1,
    borderColor: "gray",
    height: 40,
    width: 120,
    alignSelf: "center",
    borderRadius: 40,
    marginTop: 20
  },
  icon: {
    marginTop: 4
  },
  tableText: {
    fontSize: 16,
    color: "gray",
    margin: 10
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#009FFF",
    borderRadius: 10,
    width: 160,
    marginHorizontal: 10
  },
  timeContainer: {
    backgroundColor: "#009FFF",
    borderRadius: 5,
    height: 50,
    justifyContent: "center"
  },
  offerContainer: {
    height: 40,
    justifyContent: "center"
  },
  timeText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"
  },
  offerText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#009FFF"
  },
  tableBackContainer: {
    // flexDirection: "row",
    justifyContent: "space-between",
    height: 100
  },
  abilityContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 10,
    marginVertical: 10
    // borderWidth: 0.5
  },
  abilityText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: 6
  },
  flatlist: {
    height: 100
  },
  divider: {
    height: 1
  },
  nowText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#009FFF",
    marginTop: 8
  },
  courcesText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10
  },
  bottomText: {
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: "justify"
  },
  backIcon: {
    alignSelf: "flex-start",
    marginTop: global.CONSTANT.STATUSBAR,
    color: "#fff"
  },
  iconContainer: {
    height: 50,
    width: 50
  },
  image: {
    height: 250,
    resizeMode: "contain"
    // width: 300
  }
});
