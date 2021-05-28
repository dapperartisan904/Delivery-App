import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { Icon } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {SearchAddress, GetCategory, inserFavorite, gerMerchantMenu} from "../../utils/Api"
import global from "../../global";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';

const DATA = {
  food: [
    {
      id: "1",
      restaurant_name: "Mcdonalds ",
      liked: 1,
      time: "15 - 25 mins",
      food_type: "£ - Fast Food",
      type: "For allergy and nutrition information pl",
      image:
        "https://media.cntraveler.com/photos/5dbaf8c411c1e500092e7b52/16:9/w_1440,c_limit/Gloria-London-2019-Je%25CC%2581ro%25CC%2582meGalland-6.jpg"
    },
    {
      id: "2",
      restaurant_name: "KFC ",
      liked: 0,
      time: "15 - 20 mins",
      food_type: "£ - Fast Food",
      type: "Grub House is an indepndent delivery service",
      image:
        "https://media.gq-magazine.co.uk/photos/5d13a96b7fcc8e403c821131/16:9/w_1920,c_limit/02-gq-19mar19_b.jpg"
    },
    {
      id: "3",

      restaurant_name: "Subway ",
      liked: 1,
      time: "15 - 20 mins",
      food_type: "£ - Fast Food",
      type: "Grub House is an indepndent delivery service",
      image:
        "https://dynaimage.cdn.cnn.com/cnn/q_auto,w_900,c_fill,g_auto,h_506,ar_16:9/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F190912110131-01-trendy-london-restaurants.jpg"
    },
    {
      id: "4",
      restaurant_name: "Mcdonalds ",
      liked: 0,
      time: "15 - 25 mins",
      food_type: "£ - Fast Food",
      type: "For allergy and nutrition information pl",
      image:
        "https://www.tozirestaurant.co.uk/wp-content/uploads/2019/06/Tozi-London-exterior.jpg"
    },
    {
      id: "4",
      restaurant_name: "KFC ",
      liked: 1,
      time: "15 - 20 mins",
      food_type: "£ - Fast Food",
      type: "Grub House is an indepndent delivery service",
      image:
        "https://s3.eu-west-2.amazonaws.com/luxurylondon.co.uk-storage-bucket-001/images/041119172021/card/best-neo-mediterranean-restaurants-london-xl-hd.jpg"
    }
  ]
};

export default class restaurantScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      data: DATA,
      cuisineList: [],
      searchAddress: '',
      cuisineCategory: [],
      latitude: 0,
      longitude: 0
    };
  }
  componentDidMount(){
    if(this.props.navigation.state.params.restData.length>0){
      this.userResult()
    } else {
      if(typeof this.props.fromHome == "undefined"){
        this.getData()
      }
      
    }
  }
  UNSAFE_componentWillReceiveProps(){
    this.userResult()
  }
  userResult=()=>{
    var rest=[]
    this.props.restData.map((elements, index )=>{
      rest.push({
        id:elements.merchant_id,
        image:elements.logo != "" ? "https://www.grubhouse.co.uk/upload/"+elements.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
        restaurant_name: elements.restaurant_name,
        time: elements.delivery_estimation,
        food_type: "£ - Fast Food",
        type: elements.street+", "+elements.city+", "+elements.state,
        liked: elements.fab_like?1:0,
        cuisine: elements.cuisine,
        rating: elements.rating,
        coordinate: {
          latitude: elements.latitude,
          longitude: elements.lontitude
        },
        fullAddress: elements.street + ", " + elements.city + ", " + elements.state,
        service: elements.service,
        slug: elements.restaurant_slug,
        delivery_charges: elements.delivery_charges,
      });
      
    })
    rest = rest.map((res, i)=>{
      res.cuisine = res.cuisine.match(/\d+/g).map(Number)
      return res
    })

    this.setState({
      cuisineList: this.props.navigation.state.params.cuisine,
      data: rest
    });


  }

  getData =()=>{
    // console.log(this.props.navigation)
    this.setState({
      searchAddress: this.props.navigation.state.params.searchAddress
    })
    let rest = []
    GetCategory().then(res=>{
      let cuisineData= []
      // console.log("cuisine list",  res)
      res.details.map((c, i)=>{
        cuisineData[c.cuisine_id] = c.cuisine_name
      })
      this.setState({cuisineCategory: res.details})
      this.setState({
        cuisineList: cuisineData
      })
      // console.log("cuisine data", cuisineData)
      this.searchFunc()
    })
    
  }

  searchFunc=async()=>{
    var latitude =''
    var longitude =''
    let rest = []
    let temp = []
    if(Platform.OS === "ios"){
      // your code using Geolocation and asking for authorisation with
      Geocoder.init("AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0"); // use a valid API key
      geolocation.requestAuthorization()
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });
      }
   }else{
    Geocoder.init("AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0"); // use a valid API key

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }
    }
    var location = ''
    Geocoder.from(this.state.searchAddress)
		.then(json => {
      location= json.results[0].geometry.location;
      // console.log("location from geocoder", location)
			SearchAddress(
        location.lat, location.lng,
        global.USER.details.client_info.client_id
        ).then((res)=>{
        // console.log("res", res.details)
        if(res.details)
        res.details.map((elements, index )=>{
          rest.push({
            id:elements.merchant_id,
            image:elements.logo != "" ? "https://www.grubhouse.co.uk/upload/"+elements.logo:"https://www.grubhouse.co.uk/assets/images/lastsec.jpg",
            restaurant_name: elements.restaurant_name,
            time: elements.delivery_estimation,
            food_type: "£ - Fast Food",
            type: elements.street+", "+elements.city+", "+elements.state,
            liked: elements.fab_like?1:0,
            cuisine: elements.cuisine,
            rating: elements.rating,
            coordinate: {
              latitude: elements.latitude,
              longitude: elements.lontitude
            },
            fullAddress: elements.street + ", " + elements.city + ", " + elements.state,
            service: elements.service,
            slug: elements.restaurant_slug,
            delivery_charges: elements.delivery_charges,
          });
          
        })
        temp= res.details
        // console.log("data",  rest[3].cuisine.match(/\d+/g).map(Number))
        rest = rest.map((res, i)=>{
          res.cuisine = res.cuisine.match(/\d+/g).map(Number)
          return res
        })
        // console.log(rest)
        this.setState({data: rest});
        if(this.props.uploadRestList){
          this.props.uploadRestList(temp, this.state.cuisineCategory)
        }
      })
		})
		.catch(error => console.warn(error));
    
  }
  toggleFavorite=(merchant_id, liked)=>{
    // console.log(merchant_id, liked)
    
    // console.log("this state")
    inserFavorite(merchant_id, liked, this.state.searchAddress).then((res)=>{
      // console.log(",togle res",res)
      this.state.data
      var temp = this.state.data.map((rest, index)=>{
        if(rest.id==merchant_id){
          rest.liked = rest.liked?0:1
        }
        return rest
      })
      // console.log(temp)
      this.setState({data: temp})
    })
  }
  selectRest=(restaurant)=>{
    if(typeof this.props.navigation.state.params.beforePath === "undefined"){
      // this.props.navigation.navigate("SearchAddress", {
      //   merchant: restaurant
      // })
      this.getMenu(restaurant)
    } else {
      this.props.navigation.navigate(this.props.navigation.state.params.beforePath, {
        merchant: restaurant
      })
    }
  }
  deliveryOptions=(serviceType)=>{		
    switch (serviceType) {
      case "2":
        return <View 
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Delivery</Text>
      </View>
        break;
      case "3":
        return <View 
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Pick Up</Text>
      </View>
        break;
        
      case "4":	
        return [<View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Delivery</Text>
        </View>, 
          <View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Pick Up</Text>
        </View>,
          <View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Dine In</Text>
        </View>
          ]
         break;
         
      case "5":	
         return [<View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Delivery</Text>
        </View>, 
        <View 
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Dine In</Text>
      </View>
        ]
         break;
         
      case "6":	
         return [
          <View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Pick Up</Text>
        </View>,
        <View 
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Dine In</Text>
      </View>
        ]                        
         break;   
        
      case "7":	
         return [
          <View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Dine In</Text>
        </View>
        ]
         break;       
            
      default:
        return [<View 
          style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
          Component = {TouchableOpacity}  
        >
          <Icon
            name="check-circle"
            type="material-community"
            size={20}
            color={"grey"}
          />
          <Text style={styles.cardDescription}>Delivery</Text>
        </View>, 
        <View 
        style={{marginLeft: 20, justifyContent: "center", flexDirection:"row", alignItems:"center"}}
        Component = {TouchableOpacity}  
      >
        <Icon
          name="check-circle"
          type="material-community"
          size={20}
          color={"grey"}
        />
        <Text style={styles.cardDescription}>Pick Up</Text>
      </View>
        ]
        break;
    }
}

getMenu = (rest)=>{
  var merchant = {
    id: rest.id,
    name: rest.restaurant_name,
    image: "https://www.grubhouse.co.uk/upload/"+rest.logo,
    address: rest.fullAddress,
    rating: rest.rating,
    service: rest.service,
    slug: rest.restaurant_slug,
    delivery_time:rest.time,
    amount: (rest.delivery_charges*1).toFixed(2),
  }
  gerMerchantMenu(rest.id).then((response)=>{
 
  this.props.navigation.navigate("DetailsScreen", {
    merchant: merchant,
    data: response.details
  })
})
}

  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        {/* flatlist container */}
        <View style={styles.flatlist}>
          <FlatList
            // horizontal
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item: d }) => (
              <View style={styles.horizontalFlatlist}>
                {/* image container */}
                {/* <View style={styles.imageContainer}> */}
                <TouchableWithoutFeedback
                  onPress={()=>this.selectRest(d)}
                >
                  <Image source={{ uri: d.image }} style={styles.image} />
                </TouchableWithoutFeedback>
                {/* restaurant container */}
                <View style={styles.restaurantContainer}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {d.restaurant_name}
                  </Text>
                  <Text style={styles.timeText}>{d.time}</Text>
                </View>
                <View style={styles.restaurantContainer}>
                  <Text style={styles.timeText}>£-&nbsp;{
                    d.cuisine.map((id, index)=>{
                      
                      return this.state.cuisineList[id]+(d.cuisine.length==(index+1)?'':", ")
                    })
                  }</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent:"flex-start"}}>
                  {this.deliveryOptions(d.service)}
                </View>
                  
                
                <View style={styles.restaurantContainer}>
                  <Text style={styles.typeText} numberOfLines={1}>
                    {d.type}
                  </Text>
                  <Icon
                    name={d.liked == 0 ? "heart-outline" : "heart"}
                    color="red"
                    type="material-community"
                    size={20}
                    Component={TouchableOpacity}
                    onPress={()=>this.toggleFavorite(d.id, d.liked)}
                  />
                </View>
                {/* </View> */}
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  horizontalFlatlist: {
    // borderBottomWidth: 0.5,
    // borderBottomColor: "gray"
    // flexDirection: "column",
    // justifyContent: "flex-start"
  },
  image: {
    height: 200,
    // width: 300,
    resizeMode: "cover",
    margin: 10,
    borderRadius: 10
  },
  // imageContainer: {
  //   flexDirection: "row",
  //   justifyContent: "flex-start"
  // },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    width: 240
    // marginVertical: 4
  },
  addressText: {
    fontSize: 16,
    color: "gray",
    width: 240
  },
  restaurantContainer: {
    // alignSelf: "center"
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 4
  },
  timeText: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold"
  },
  typeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    width: 300
  }
});
