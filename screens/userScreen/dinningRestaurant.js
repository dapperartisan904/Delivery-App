import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import global from "../../global";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Icon, Divider } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

const DATA = [
  {
    id: "1",
    time: "13:45",
    offer: "2 offers",
    food_name: "Rainbow pancakes",

    image:
      "https://secretldn.com/wp-content/uploads/2018/11/coppa-club-winter-restaurants-london.jpg",
    image1:
      "https://images.immediate.co.uk/production/volatile/sites/2/2018/08/Peanut-butter-pancakes-78d1366.jpg?quality=45&resize=768,574",
    address: "££ . European . Canary W...",
    name: "Plateau Bar & Grill",
    reviews: "871 reviews",
    time_slot: [
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
      }
    ]
  },
  {
    id: "1",
    time: "13:45",
    offer: "2 offers",
    food_name: "Breakfast & Brunch Recipes",

    image1:
      "https://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/holiday-brunch-ft-blog1119.jpg?itok=Sq4KiWM7",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSjnk8XDNi05Sp8Un9FtKEmpwRr9k_qe4LWsOBB4DgRwstjTsZF",
    address: "££ . European . Canary W...",
    name: "Plateau Restaurant",
    reviews: "3047 reviews",
    time_slot: [
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
      }
    ]
  },
  {
    id: "1",
    time: "13:45",
    offer: "2 offers",
    food_name: "Ham N Cheese Quiches",

    image1:
      "https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/exps9928_B163857D11_05_5b.jpg",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_LbdLU_qdMF7NvrZ1DBrTJzcRCNOoWOoie8mVrHBZMYQWpMNw",
    address: "££ . European . Canary W...",
    name: "Plateau Bar & Grill",
    reviews: "871 reviews",
    time_slot: [
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
      }
    ]
  },
  {
    id: "1",
    time: "13:45",
    offer: "2 offers",
    image1:
      "https://w.intonutrition.co.za/wp-content/uploads/2018/03/Breakfast-Egg-Cups-FB.jpg",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTrbot3zLoqYHJUIekUJ7ILdyzWHGBnbshQF4j9JqHslk3-YWv7",
    address: "££ . European . Canary W...",
    food_name: "Breakfast egg muffins",
    name: "Plateau Bar & Grill",
    reviews: "871 reviews",
    time_slot: [
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
      }
    ]
  }
];
export default class dinningRestaurant extends Component {
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
      <ScrollView style={styles.bgContainer}>
        <View style={styles.mapContainer}>
          <MapView
            showsUserLocation
            showsMyLocationButton
            style={{ flex: 1, height: 260 }}
            region={{
              latitude: 51.509865,
              longitude: -0.118092,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.availableContainer}>
            <Text style={styles.nameText}>Available for breakfast now</Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => this.props.navigation.navigate("AddressSearch")}
            >
              <Text style={styles.viewText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flatlist}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.data}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Dinning");
                  }}
                >
                  <View style={styles.imgeContainer}>
                    <Image source={{ uri: d.image }} style={styles.image} />
                    <View style={styles.addressContainer}>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {d.address}
                      </Text>
                      <View style={styles.promotedContainer}>
                        <Text style={styles.promotedText}>Promoted</Text>
                      </View>
                    </View>
                    <Text style={styles.resturantName}>{d.name}</Text>
                    {/* review container */}
                    <View style={styles.reviewContainer}>
                      {/* flex container */}
                      <View style={styles.flexContainer}>
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="rgba(0,0,0,0.1)"
                          type="material-community"
                          size={20}
                        />
                      </View>
                      <View>
                        <Text style={styles.ratingText}>{d.reviews}</Text>
                      </View>
                    </View>
                    {/* table container */}
                    <View style={styles.tableBackContainer}>
                      {d.time_slot.map(g => {
                        return (
                          <View style={styles.tableContainer}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{g.time}</Text>
                            </View>
                            <View style={styles.offerContainer}>
                              <Text style={styles.offerText}>{g.offer}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.availableContainer}>
            <Text style={styles.nameText}>Available for lunch now</Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => this.props.navigation.navigate("AddressSearch")}
            >
              <Text style={styles.viewText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flatlist}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.data}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Dinning");
                  }}
                >
                  <View style={styles.imgeContainer}>
                    <Image source={{ uri: d.image }} style={styles.image} />
                    <View style={styles.addressContainer}>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {d.address}
                      </Text>
                      <View style={styles.promotedContainer}>
                        <Text style={styles.promotedText}>Promoted</Text>
                      </View>
                    </View>
                    <Text style={styles.resturantName}>{d.name}</Text>
                    {/* review container */}
                    <View style={styles.reviewContainer}>
                      {/* flex container */}
                      <View style={styles.flexContainer}>
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="rgba(0,0,0,0.1)"
                          type="material-community"
                          size={20}
                        />
                      </View>
                      <View>
                        <Text style={styles.ratingText}>{d.reviews}</Text>
                      </View>
                    </View>
                    {/* table container */}
                    <View style={styles.tableBackContainer}>
                      {d.time_slot.map(g => {
                        return (
                          <View style={styles.tableContainer}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{g.time}</Text>
                            </View>
                            <View style={styles.offerContainer}>
                              <Text style={styles.offerText}>{g.offer}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.availableContainer}>
            <Text style={styles.nameText}>Available for dinner now</Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => this.props.navigation.navigate("AddressSearch")}
            >
              <Text style={styles.viewText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flatlist}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.data}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Dinning");
                  }}
                >
                  <View style={styles.imgeContainer}>
                    <Image source={{ uri: d.image }} style={styles.image} />
                    <View style={styles.addressContainer}>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {d.address}
                      </Text>
                      <View style={styles.promotedContainer}>
                        <Text style={styles.promotedText}>Promoted</Text>
                      </View>
                    </View>
                    <Text style={styles.resturantName}>{d.name}</Text>
                    {/* review container */}
                    <View style={styles.reviewContainer}>
                      {/* flex container */}
                      <View style={styles.flexContainer}>
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="rgba(0,0,0,0.1)"
                          type="material-community"
                          size={20}
                        />
                      </View>
                      <View>
                        <Text style={styles.ratingText}>{d.reviews}</Text>
                      </View>
                    </View>
                    {/* table container */}
                    <View style={styles.tableBackContainer}>
                      {d.time_slot.map(g => {
                        return (
                          <View style={styles.tableContainer}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{g.time}</Text>
                            </View>
                            <View style={styles.offerContainer}>
                              <Text style={styles.offerText}>{g.offer}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.availableContainer}>
            <Text style={{ fontSize: 40, fontFamily: global.FONT.ITALIC }}>
              Brunch Tuesday
            </Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => this.props.navigation.navigate("AddressSearch")}
            >
              <Text style={styles.viewText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flatlist}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.data}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Dinning");
                  }}
                >
                  <View style={styles.imgeContainer}>
                    <Image source={{ uri: d.image1 }} style={styles.image} />
                    <View style={styles.addressContainer}>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {d.address}
                      </Text>
                      <View style={styles.promotedContainer}>
                        <Text style={styles.promotedText}>Promoted</Text>
                      </View>
                    </View>
                    <Text style={styles.resturantName}>{d.food_name}</Text>
                    {/* review container */}
                    <View style={styles.reviewContainer}>
                      {/* flex container */}
                      <View style={styles.flexContainer}>
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="rgba(0,0,0,0.1)"
                          type="material-community"
                          size={20}
                        />
                      </View>
                      <View>
                        <Text style={styles.ratingText}>{d.reviews}</Text>
                      </View>
                    </View>
                    {/* table container */}
                    <View style={styles.tableBackContainer}>
                      {d.time_slot.map(g => {
                        return (
                          <View style={styles.tableContainer}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{g.time}</Text>
                            </View>
                            <View style={styles.offerContainer}>
                              <Text style={styles.offerText}>{g.offer}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.availableContainer}>
            <Text style={{ fontSize: 40, fontFamily: global.FONT.ITALIC }}>
              Date Night
            </Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => this.props.navigation.navigate("AddressSearch")}
            >
              <Text style={styles.viewText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flatlist}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.data}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Dinning");
                  }}
                >
                  <View style={styles.imgeContainer}>
                    <Image source={{ uri: d.image }} style={styles.image} />
                    <View style={styles.addressContainer}>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {d.address}
                      </Text>
                      <View style={styles.promotedContainer}>
                        <Text style={styles.promotedText}>Promoted</Text>
                      </View>
                    </View>
                    <Text style={styles.resturantName}>{d.name}</Text>
                    {/* review container */}
                    <View style={styles.reviewContainer}>
                      {/* flex container */}
                      <View style={styles.flexContainer}>
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="#F73D33"
                          type="material-community"
                          size={20}
                        />
                        <Icon
                          name="star"
                          color="rgba(0,0,0,0.1)"
                          type="material-community"
                          size={20}
                        />
                      </View>
                      <View>
                        <Text style={styles.ratingText}>{d.reviews}</Text>
                      </View>
                    </View>
                    {/* table container */}
                    <View style={styles.tableBackContainer}>
                      {d.time_slot.map(g => {
                        return (
                          <View style={styles.tableContainer}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{g.time}</Text>
                            </View>
                            <View style={styles.offerContainer}>
                              <Text style={styles.offerText}>{g.offer}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.availableContainer}>
            <Text style={styles.nameText}>Browse</Text>

            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => this.props.navigation.navigate("AddressSearch")}
            >
              <Text style={styles.viewText}>View all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    flexDirection: "column"
  },
  mapContainer: {
    height: 500,
    flex: 6
  },
  availableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  viewText: {
    color: "#009FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 6
  },
  flatlist: {
    height: 300
  },
  bottomContainer: {
    flex: 6
  },
  image: {
    height: 120,
    width: 280,
    resizeMode: "cover",
    borderRadius: 10
  },
  imgeContainer: {
    height: 280,
    width: 282,
    marginHorizontal: 6,
    borderWidth: 0.2,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "#fff"
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5
  },
  addressText: {
    fontSize: 16,
    marginHorizontal: 2,
    width: 190
  },
  promotedContainer: {
    borderColor: "gray",
    borderWidth: 1.4,
    borderRadius: 5
  },
  promotedText: {
    fontSize: 16,
    marginHorizontal: 2
  },
  resturantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10
    // textAlign: "center"
    // marginTop: 40
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
    justifyContent: "flex-start",
    marginTop: 5,
    marginHorizontal: 10
  },
  tableBackContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
    // height: 7
  },
  tableContainer: {
    borderRadius: 10,
    width: 60,
    // marginHorizontal: 5,
    marginTop: 14
  },
  timeContainer: {
    backgroundColor: "#009FFF",
    borderRadius: 5,
    height: 26,
    justifyContent: "center"
  },
  offerContainer: {
    height: 30,
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
  }
});
