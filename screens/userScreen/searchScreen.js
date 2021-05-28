import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SearchCuisineById } from "../../utils/Api";
import { Grid } from "react-native-easy-grid";
import ImageOverlay from "react-native-image-overlay";
import { Icon, Input, Button } from "react-native-elements";
// import chips from "../../assets/chips.jpg";
import { GetCategory } from "../../utils/Api";
0
export default class searchScreen extends Component {
  static navigationOptions = {
    title: "LIST OF CUISINS",
    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],

    };
  }
  componentDidMount(){
    GetCategory().then((d)=>{
      let catarray = [];
        d.details.map(elements =>{
          catarray.push({
          id:elements.cuisine_id,
          image:"https://www.grubhouse.co.uk/upload/"+elements.featured_image,
          name:elements.cuisine_name,
          // merchant_id:elements.merchant_id,
          // category_name:elements.category_name,
        });
        this.setState({data: catarray});
      });
    })
  }

  render() {
    return (
      <ScrollView style={styles.bgContainer}>
        
        <Text style={styles.topText}>Top Categories</Text>
        <View style={{ marginVertical: 20, flex: 1, marginHorizontal: 10 }}>
          <View></View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d }) => (
              <TouchableOpacity
              onPress={() => {
                SearchCuisineById(d);
                // this.props.navigation.navigate("Combo");
              }}
                style={styles.grid}
              >
                <Grid>
                  <ImageOverlay
                    overlayAlpha={0.3}
                    containerStyle={styles.overlay}
                    source={{ uri: d.image }}
                    title={d.name}
                    titleStyle={styles.overlayTitle}
                    // overlayColor=""
                  />
                </Grid>
              </TouchableOpacity>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  inputContainer: {
    // marginVertical: global.CONSTANT.STATUSBAR + 10,
    marginHorizontal: 30
  },
  fromContainer: {
    flexDirection: "row",
    borderBottomWidth: 0,
    // borderColor: global.COLOR.PRIMARY,
    // marginTop: 14,
    justifyContent: "flex-start"
    // marginVertical: 20
    // height: 60
    // marginHorizontal: 40
  },

  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    // marginVertical: 10,
    color: "gray",
    // marginHorizontal: 18,
    marginVertical: 6
  },
  inputFiedContainer: {
    borderBottomWidth: 0
  },
  overlay: {
    height: 180,
    width: 180
  },
  overlayTitle: {
    fontSize: 30
  },
  grid: {
    alignContent: "center",
    marginRight: "2%",
    marginTop: "2%",
    width: window.width
  },
  topText: {
    fontSize: 20,
    marginHorizontal: 30,
    fontWeight: "bold",
    color: "gray",
    marginTop: 10
  }
});
