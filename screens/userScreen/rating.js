import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, Image } from "react-native";
import global from "../../global";
import { Divider } from "react-native-paper";
import StarRating from "react-native-star-rating";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import Rating from "../../assets/rating.png";

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
export default class rating extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    // this.getData();

    this.state = {
      data: DATA,
      starCount: 4.2
    };
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        <View style={styles.iconContainer}>
          <Icon
            name="arrow-left"
            type="material-community"
            size={40}
            iconStyle={styles.backIcon}
            onPress={() => this.props.navigation.navigate("Dinning")}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.tableText}>BOOK A TABLE</Text>
        </View>
        <View style={styles.flatlist}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d }) => (
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
            )}
          />
        </View>
        <View style={{ backgroundColor: "#fff" }}>
          <View>
            <Text style={styles.overallText}> Overall</Text>
            <Text style={styles.ratingText}>4.2</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <StarRating
              disabled={false}
              containerStyle={styles.ratingContainer}
              emptyStar={"ios-star-outline"}
              fullStar={"ios-star"}
              halfStar={"ios-star-half"}
              iconSet={"Ionicons"}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={rating => this.onStarRatingPress(rating)}
              fullStarColor={"#009fff"}
            />
            <Image source={Rating} style={styles.rating} />
          </View>
        </View>

        <Divider style={styles.divider}></Divider>
        <View style={styles.serviceBackContainer}>
          <TouchableOpacity style={styles.serviceContainer}>
            <Text style={styles.serviceText}>Greate Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceContainer}>
            <Text style={styles.serviceText}>Good for Birthdays</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceContainer}>
            <Text style={styles.serviceText}>Good Value</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.serviceBackContainer}>
          <TouchableOpacity style={styles.serviceContainer}>
            <Text style={styles.serviceText}>Good for a Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceContainer}>
            <Text style={styles.serviceText}>Good for a Business Meeting</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.serviceBackContainer}>
          <TouchableOpacity style={styles.serviceContainer}>
            <Text style={styles.serviceText}>Vegan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewContainer}>
          <Icon
            name="clipboard-list"
            color="#009FFF"
            type="material-community"
            size={20}
          />
          <Text style={styles.reviewsText}>See all reviews</Text>
        </View>
        <View>
          <Text style={styles.tableText}>ADDRESS</Text>
        </View>
        <View style={styles.reviewContainer}>
          <Icon
            name="map-marker"
            color="#009FFF"
            type="material-community"
            size={20}
          />
          <Text style={styles.addressText}>
            4th Flr, Canada Place,London E14 5Er
          </Text>
        </View>

        {/* <View style={{ flex: 0.3 }}> */}
        <MapView
          showsUserLocation
          showsMyLocationButton
          style={{ flex: 1, height: 100 }}
          region={{
            latitude: 51.509865,
            longitude: -0.118092,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        {/* </View> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
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
    height: 80,
    marginVertical: 10
  },
  flatlist: {
    height: 114,
    backgroundColor: "#fff"
  },
  tableText: {
    fontSize: 16,
    color: "gray",
    margin: 10
  },
  container: {
    marginTop: global.CONSTANT.STATUSBAR + 30
  },
  ratingContainer: {
    alignSelf: "flex-start",
    marginHorizontal: 10
  },
  overallText: {
    fontSize: 16,
    margin: 16
  },
  ratingText: {
    fontSize: 50,
    fontWeight: "bold",
    marginHorizontal: 20
  },
  divider: {
    height: 0.5,
    marginTop: 30
    // backgroundColor: "gray"
  },
  serviceContainer: {
    borderColor: "#009fff",
    borderWidth: 1,

    height: 40,
    borderRadius: 8,
    marginLeft: 5,
    marginTop: 20
  },
  serviceText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#009FFF",
    marginTop: 5,
    marginHorizontal: 5
  },
  serviceBackContainer: {
    flexDirection: "row"
    // justifyContent: "space-evenly",
    // marginTop: 20
  },
  reviewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 20,
    marginHorizontal: 10
  },
  reviewsText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 4
  },
  addressText: {
    fontSize: 16,
    marginHorizontal: 5
  },
  rating: {
    marginTop: -100,
    height: 150,
    width: 180,
    resizeMode: "contain"
  },
  backIcon: {
    alignSelf: "flex-start",
    marginTop: global.CONSTANT.STATUSBAR
  },
  iconContainer: {
    height: 50,
    width: 50
  }
});
