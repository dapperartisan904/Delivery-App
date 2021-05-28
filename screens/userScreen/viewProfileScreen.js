import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image
} from "react-native";
import { Avatar, Icon, Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import global from "../../global";
import ImageOverlay from "react-native-image-overlay";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

const DATA = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6_3U3-3IDcT_CQztsu2j7ghMrCpDK-crtiTjM3DjiiImdi-YBw&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIcU52banJGAWCBobesdN8zHjU_h8GEVGxcoUCYc2R1gUApVf&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYruN5AjVqgWAH_umSM2ezHbx8OB1g-l2YSRpHPg_W4u8VK5v&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStsuQNIQljpSH0so1Tb6r-XEwwXCQIUGHzW0ZuwpXfXU2HiyJzGw&s"
  },

  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6_3U3-3IDcT_CQztsu2j7ghMrCpDK-crtiTjM3DjiiImdi-YBw&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIcU52banJGAWCBobesdN8zHjU_h8GEVGxcoUCYc2R1gUApVf&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYruN5AjVqgWAH_umSM2ezHbx8OB1g-l2YSRpHPg_W4u8VK5v&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStsuQNIQljpSH0so1Tb6r-XEwwXCQIUGHzW0ZuwpXfXU2HiyJzGw&s"
  },

  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6_3U3-3IDcT_CQztsu2j7ghMrCpDK-crtiTjM3DjiiImdi-YBw&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIcU52banJGAWCBobesdN8zHjU_h8GEVGxcoUCYc2R1gUApVf&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYruN5AjVqgWAH_umSM2ezHbx8OB1g-l2YSRpHPg_W4u8VK5v&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStsuQNIQljpSH0so1Tb6r-XEwwXCQIUGHzW0ZuwpXfXU2HiyJzGw&s"
  },

  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6_3U3-3IDcT_CQztsu2j7ghMrCpDK-crtiTjM3DjiiImdi-YBw&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIcU52banJGAWCBobesdN8zHjU_h8GEVGxcoUCYc2R1gUApVf&s"
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYruN5AjVqgWAH_umSM2ezHbx8OB1g-l2YSRpHPg_W4u8VK5v&s"
  }
];

export default class viewProfileScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.getPermissionAsync();

    this.state = {
      name: "lynda_xo",
      location: "London",
      Favourite: "0",
      Followers: "10",
      Following: "0",
      student_hide: true,
      profile_image: "",
      data: DATA
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

  // Toggle camera options
  chooseUpload = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  // Image Picker function
  _pickImage = async v => {
    // console.log(v);
    let option =
      v == "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    let field = this.state.field;
    let result = await option({
      quality: 0.2,
      allowsEditing: true
    });

    // console.log(result);

    if (!result.cancelled) {
      this.setState({
        profile_image: result.uri
        // , isVisible: false
      });
    }
    this.chooseUpload();
  };
  render() {
    return (
      // back ground container
      <View style={styles.bgContainer}>
        <ScrollView>
          {/* image backgroun container */}
          <ImageBackground
            source={global.ASSETS.PROFILE}
            style={styles.imageContainer}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0,0.1)"
              }}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="calendar-text-outline"
                  reverse
                  reverseColor="gray"
                  color="#fff"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                  Component={TouchableOpacity}
                  //   onPress={() => this.props.navigation.navigate("Piggy")}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Icon
                    name="clock-outline"
                    // reverse
                    color="#fff"
                    type="material-community"
                    size={28}
                    iconStyle={styles.icon}
                    Component={TouchableOpacity}
                    // onPress={() =>
                    //   this.props.navigation.navigate("StudentProfile")
                    // }
                  />
                  <Icon
                    name="dots-vertical"
                    color="#fff"
                    type="material-community"
                    size={35}
                    // iconStyle={{ marginHorizontal: 10 }}
                    Component={TouchableOpacity}
                    // onPress={() => this.props.navigation.navigate("Menu")}
                  />
                </View>
                {/* <Icon
                  name="briefcase-upload-outline"
                  // reverse
                  color="#fff"
                  type="material-community"
                  size={28}
                  iconStyle={styles.icon}
                  Component={TouchableOpacity}
                /> */}
              </View>

              {/* avatar container */}
              <View style={styles.avatarContainer}>
                <Avatar
                  rounded
                  showEditButton
                  size={100}
                  source={{ uri: this.state.profile_image }}
                  onPress={() => {
                    this._pickImage("camera");
                  }}
                />

                <Text style={styles.naameText}>{this.state.name}</Text>

                <Text style={styles.locationText}>{this.state.location}</Text>
              </View>

              {/* favourite back container */}
              <View style={styles.backContainer}>
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("Favourites")}
                >
                  <Text style={styles.numberText}>{this.state.Favourite}</Text>
                  <Text style={styles.favourateText}>Favourite</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("Followers")}
                >
                  <Text style={styles.numberText}>{this.state.Followers}</Text>
                  <Text style={styles.favourateText}>Followers</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("Following")}
                >
                  <Text style={styles.numberText}>{this.state.Following}</Text>
                  <Text style={styles.favourateText}>Following</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <FlatGrid
            itemDimension={global.CONSTANT.WIDTH / 3 - 20}
            items={DATA}
            renderItem={({ item }) => (
              <View>
                <Image source={{ uri: item.image }} style={styles.image} />
              </View>
            )}
          />
          {/* border back coontainer */}

          {/* <View style={{ marginHorizontal: 6, marginTop: 10 }}> */}
          {/* <Grid>
              <Col>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.FOUR}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.TWO}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
              </Col>
              <Col>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.THREE}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.PIZZA}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
              </Col>
              <Col>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.FIVE}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.BURGER}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
              </Col> */}
          {/* </Grid>
            <Grid>
              <Col>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.FOUR}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.TWO}
                    contentPosition="bottom"
                  ></ImageOverlay> */}
          {/* </Row>
              </Col>
              <Col>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.THREE}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.PIZZA}
                    contentPosition="bottom"
                  > */}
          {/* <View style={{ backgroundColor: "transparent" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start"
                        // marginLeft: 10
                      }}
                    >
                      <Icon
                        iconStyle={styles.icon}
                        name="heart-outline"
                        color={global.COLOR.PRIMARY}
                        type="material-community"
                        size={20}
                        Component={TouchableOpacity}
                      />
                      <Text style={styles.likeText}>4</Text>
                      <Icon
                        name="comment-outline"
                        iconStyle={styles.icon}
                        color={global.COLOR.PRIMARY}
                        type="material-community"
                        size={20}
                        Component={TouchableOpacity}
                      />
                      <Text style={styles.likeText}>0</Text>
                      <Icon
                        name="star-outline"
                        iconStyle={styles.icon}
                        color={global.COLOR.PRIMARY}
                        type="material-community"
                        size={20}
                        Component={TouchableOpacity}
                      />
                      <Text style={styles.likeText}>0</Text>
                    </View>
                  </View> */}
          {/* </ImageOverlay>
                </Row>
              </Col>
              <Col>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.FIVE}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
                <Row>
                  <ImageOverlay
                    overlayAlpha={0}
                    containerStyle={styles.overlay2}
                    source={global.ASSETS.BURGER}
                    contentPosition="bottom"
                  ></ImageOverlay>
                </Row>
              </Col>
            </Grid>
          </View> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null
  },
  imageContainer: {
    // height: 320
    flex: 0.4
  },
  avatarContainer: {
    alignSelf: "center"
    // marginTop: 30
    // marginTop: "-13%"
  },
  iconContainer: {
    marginTop: global.CONSTANT.STATUSBAR + 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20
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
    borderWidth: 1,
    margin: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 40,
    backgroundColor: "transparent"
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
    width: 1
  },
  image: {
    height: 140,
    margin: -4
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
