import Axios from "axios";
import Loading from "../components/Loading";
import NavigationService from "./NavigationService";
import { AsyncStorage, Alert } from "react-native";
import global from "../global";
import Geocoder from 'react-native-geocoding';
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
// base url
import parse from "./parse";
import stringify from "./stringify";
import moment from "moment";
export const baseUrl = "http://grubhouse.co.uk/mobileappv2/api/";
// export const baseUrl = "http://192.168.110.114:9780/mobileappv2/api/";
Axios.defaults.baseURL = baseUrl;
// GetFoodCourt
export async function _getLocationAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (Platform.OS === "ios") {
    // your code using Geolocation and asking for authorisation with
    // Geocoder.init("AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0"); // use a valid API key
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // geolocation.requestAuthorization()
    if (status !== "granted") {
    }
    let location = await Location.getCurrentPositionAsync({});
    // console.log(location, "on login page")
    var data = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }

    addressSaveI(data)
  } else {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // geolocation.requestAuthorization()
    if (status !== "granted") {
    }
    let location = await Location.getCurrentPositionAsync({});
    // console.log(location, "on login page")
    var data = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
    // console.log(data, "user location data on login")
    addressSaveA(data)
  }
};

async function addressSaveI(location) {
  Location.setGoogleApiKey("AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0")
  var address = await Location.reverseGeocodeAsync(location, { useGoogleMaps: true })
  var data = {
    address: address[1]?.street + ", " + address[1]?.postalCode,
    full: address,
    latitude: location.latitude,
    longitude: location.longitude
  }
  try {
    // store user data
    AsyncStorage.setItem(global.USER_LOCATION, JSON.stringify(data), (err) => {
      if (err) {
        // console.log("an error");
        throw err;
      }
      // console.log("User Location Stored");
    }).catch((err) => {
      // console.log("error is: " + err);
    });
    AsyncStorage.getItem(global.USER_LOCATION).then(
      (value) => {
        global.LOCATION = JSON.parse(value);
        // console.log(global.LOCATION, "in api")
        if (value) {
          return value;
        }
      }
    );
    return true;
  } catch (error) {
    // console.log("Something went wrong");
  }
}

async function addressSaveA(location) {
  Location.setGoogleApiKey("AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0")
  var address = await Location.reverseGeocodeAsync(location, { useGoogleMaps: true })
  // console.log(address)

  var data = {
    address: address[1]?.street + ", " + address[1]?.postalCode,
    full: address,
    latitude: location.latitude,
    longitude: location.longitude
  }
  try {
    // store user data
    AsyncStorage.setItem(global.USER_LOCATION, JSON.stringify(data), (err) => {
      if (err) {
        // console.log("an error");
        throw err;
      }
      // console.log("User Location Stored");
    }).catch((err) => {
      // console.log("error is: " + err);
    });
    AsyncStorage.getItem(global.USER_LOCATION).then(
      (value) => {
        global.LOCATION = JSON.parse(value);
        // console.log(global.LOCATION, "in api")
        if (value) {
          return value;
        }
      }
    );
    return true;
  } catch (error) {
    // console.log("Something went wrong");
  }
}

// log request
Axios.interceptors.request.use((request) => {
  // console.log("Starting Request :", request.baseURL + request.url);
  // console.log("Request Data :", request.data);
  // console.log("Request Header :", request.headers.Authorization);
  return request;
});

// log response
Axios.interceptors.response.use((response) => {
  // console.log("Response: \n", response.status, response.data);
  return response;
});

// store auth token in storage
function StoreToken(responseData) {
  // console.log(responseData);
  AsyncStorage.setItem(global.API_TOKEN, responseData, (err) => {
    if (err) {
      // console.log("an error");
      throw err;
    }
    // console.log("Token Stored");
  }).catch((err) => {
    // console.log("error is: " + err);
  });
}

//  get user token
export async function GetToken(data) {
  try {
    let accessToken = await AsyncStorage.getItem(global.API_TOKEN).then(
      (value) => {
        if (value) {
          return value;
        }
      }
    );

    if (!accessToken) {
      // console.log("no access token");
      // console.log("navigate to Auth");
      Loading.hide();
      NavigationService.navigate("Auth");
    } else {
      global.AUTHTOKEN = accessToken;

      // store user data
      AsyncStorage.setItem(global.USER_DATA, JSON.stringify(data), (err) => {
        if (err) {
          // console.log("an error");
          throw err;
        }
        // console.log("User Data Stored");
      }).catch((err) => {
        // console.log("error is: " + err);
      });
      let userData = await AsyncStorage.getItem(global.USER_DATA).then(
        (value) => {
          if (value) {
            return value;
          }
        }
      );

      global.USER = JSON.parse(userData);

      // console.log("navigate to app");
      Loading.hide();

      NavigationService.navigate("User");
    }
  } catch (error) {
    // console.log("Something went wrong");
  }
}

//  store user data in storage
export async function StoreUserData(data) {
  try {
    // store user data
    AsyncStorage.setItem(global.USER_DATA, JSON.stringify(data), (err) => {
      if (err) {
        // console.log("an error");
        throw err;
      }
      // console.log("User Data Stored");
    }).catch((err) => {
      // console.log("error is: " + err);
    });
    let userData = await AsyncStorage.getItem(global.USER_DATA).then(
      (value) => {
        if (value) {
          return value;
        }
      }
    );

    global.USER = JSON.parse(userData);
    return true;
    // console.log("userdata",  global.USER)
  } catch (error) {
    // console.log("Something went wrong");
  }
}

export async function GetUserData() {
  try {
    // store user data
    let userData = await AsyncStorage.getItem(global.USER_DATA).then(
      (value) => {
        if (value) {
          // global.USER = JSON.parse(value)
          return value;
        }
      }
    );


  } catch (error) {
    // console.log("Something went wrong");
  }
}

// login api
export async function Login(d) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("device_token", global.CONSTANT.DEVICETYPE);
  data.append("user_mobile", d.email);
  data.append("password", d.password);
  const DATA = Axios({
    method: "post",
    url: "customerLogin",
    data,
    validateStatus: () => {
      return true;
    },
  }).then(
    async function (response) {
      console.log(response)
      if (response.data.code == 1) {
        Loading.hide();
        StoreUserData(response.data).then(() => {
          NavigationService.navigate("UserApp");
          // console.log("global data", global.USER)

        })
      } else {
        Loading.hide();
        alert(response.data.msg);
      }
    }.bind(this)
  );
  // return DATA;
}

export async function Signup(d) {
  Loading.show();


  var data = new FormData();
  data.append("account_type", d.account_type);
  data.append("api_key", " admin@1474?");
  data.append("code_version", "1");
  data.append("contact_phone", d.phoneNumber);
  data.append("cpassword", d.confirm_Password);
  data.append("date_of_birth", d.date);
  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.CONSTANT.DEVICETYPE);
  data.append("email_address", d.email);
  data.append("first_name", d.userName);
  data.append("last_name", "");
  data.append("password", d.password);
  await Axios({
    method: "post",
    url: "createAccount",
    data,
    validateStatus: (status) => {
      return true; // I'm always returning true, you may want to do it depending on the status received
    },
  }).then(
    function (response) {
      Loading.hide();
      // console.log(response)
      // console.log(response.data, "adfasdfasdfasdfasdfasdf")
      if (response.data.code == 1) {


        // setTimeout(() => {
        //   Alert.alert(
        //     "failed Grub House",
        //     d.msg,
        //     [
        //       {
        //         text: "Login",
        //         onPress: () => {
        //           this.props.navigation.navigate("Login");
        //         },
        //       },
        //       // {
        //       //   text: "Lo",
        //       //   // onPress: () => {
        //       //   //   BackHandler.exitApp();
        //       //   // }
        //       // },
        //     ],
        //     { cancelable: false }
        //   );
        // }, 800);
        alert(response.data.msg);
      } else {
        Loading.hide();
        setTimeout(() => {
          alert(response.data.msg);
        }, 800);
      }
      // console.log(d)
      return response.data
    }.bind(this)
  );
}

// searchByCuisine


export async function SearchCuisineById(d, name) {
  Loading.show();

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("page", "0");
  data.append("cuisine_id", d.id);
  data.append("client_id", global.USER.details.client_info.client_id);
  data.append("latitude", global.LOCATION.latitude);
  data.append("longitude", global.LOCATION.longitude);

  const DATA = await Axios({
    method: "post",
    url: "searchCuisineById",
    data,
    validateStatus: (status) => {
      return true; // I'm always returning true, you may want to do it depending on the status received
    },
  }).then(
    // SELECT * from mt_merchant WHERE cuisine REGEXP '42'
    function (response) {
      if (response.data.code == 1) {
        Loading.hide();
        var cuisineData = [];
        response.data.details.cuisine.map((c, i) => {
          cuisineData[c.cuisine_id] = c.cuisine_name
        })
        if (response.data.details.resto.length > 0) {
          NavigationService.navigate("Combo", {
            selectedCuisineName: d.text1,
            restData: response.data.details.resto,
            cuisine: cuisineData
          });
        } else {
          return false
        }

      } else {
        // NavigationService.navigate("Combo", {
        //   selectedCuisineName: d.text1
        // });
        alert("No results");
      }
      Loading.hide();
      return response.data;
    }.bind(this)
  );
  Loading.hide();
  return DATA;
}

export async function GetCategory() {
  Loading.show();

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  const DATA = await Axios({
    method: "post",
    url: "GetCategory",
    data,
    validateStatus: (status) => {
      return true; // I'm always returning true, you may want to do it depending on the status received
    },
  }).then(
    function (response) {
      Loading.hide()
      // console.log("get category api", response.data)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function GetCategoryT() {
  Loading.show();

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  const DATA = await Axios({
    method: "post",
    url: "GetCategory",
    data,
    validateStatus: (status) => {
      return true; // I'm always returning true, you may want to do it depending on the status received
    },
  }).then(
    function (response) {
      // console.log("get category api", response.data)
      return response.data;
    }.bind(this)
  );
  return DATA;
}
export async function GetCategoryNearby() {
  // Loading.show();

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("lat", global.LOCATION.latitude)
  data.append("lng", global.LOCATION.longitude)
  const DATA = await Axios({
    method: "post",
    url: "GetCategory5",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      // console.log("get category api", response.data)
      return response.data;
    }.bind(this)

  );

  Loading.hide()
  return DATA;
}
export async function GetRestaurant5() {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  const DATA = await Axios({
    method: "post",
    url: "GetRestaurant5",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function searchRestByAddress(d) {
  // Loading.show();

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("city", d)
  const DATA = await Axios({
    method: "post",
    url: "SearchRestByAddress",
    data,
    validateStatus: (status) => {
      return true; // I'm always returning true, you may want to do it depending on the status received
    },
  }).then(
    function (response) {
      // console.log("get category api", response.data)
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function GetRestaurantTrending() {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  const DATA = await Axios({
    method: "post",
    url: "GetRestaurantTrending",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}
export async function GetMonthFavourList() {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  const DATA = await Axios({
    method: "post",
    url: "GetMonthFavourList",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function GetAllRestor() {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  const DATA = await Axios({
    method: "post",
    url: "GetAllRestor",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function SearchAddress(lat, lon, client_id) {
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("latitude", lat)
  data.append("longitude", lon)
  data.append("client_id", client_id)
  const DATA = await Axios({
    method: "post",
    url: "SearchAddress",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      Loading.hide()
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getNearBy(location) {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("latitude", location.latitude)
  data.append("longitude", location.longitude)
  data.append("client_id", global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "GetNearby",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function inserFavorite(merchant_id, liked, schAddress) {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("merchant_id", merchant_id)
  data.append("liked", liked)
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("schAddress", schAddress)
  const DATA = await Axios({
    method: "post",
    url: "InserFavorite",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function SearchMerchantById(merchant) {
  // console.log(merchant)
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("merchant_id", merchant)
  data.append("client_id", global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "searchByMerchantId",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        // console.log("cuisin search detail", response.data.details)
        //   StoreToken(response.data.data.api_token);
        //   GetToken(response.data.data);
        Loading.hide();
        // console.log("search by merchant_id")
        if (response.data.details.list.length) {
          NavigationService.navigate("DetailsScreen", {
            merchant: response.data.details.list[0]
          });
        } else {
          alert("No results");
        }

      } else {
        // NavigationService.navigate("Combo", {
        //   selectedCuisineName: d.text1
        // });
        alert("No results");
      }
      return response.data;
    }.bind(this)
  );
  return DATA;
}

export async function gerMerchantMenu(merchant) {

  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("merchant_id", merchant)
  data.append("client_id", global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "getMerchantMenu",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      // if (response.data.code == 1) {
      //   // console.log("merchant menu", response) 
      Loading.hide()
      if (response.data.code == 2) {
        Alert.alert("GRUBHOUSE", response.data.msg)
      }
      return response.data;

      // } else {
      //   alert("No results");
      // }
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function saveDeliveryAddress(address) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("street", address.street)
  data.append("city", address.street)
  data.append("state", address.street)
  data.append("post_code", address.street)
  data.append("location_name", '')
  data.append("country", '')
  data.append("formatted_address", '')
  const DATA = await Axios({
    method: "post",
    url: "saveAddress",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      // if (response.data.code == 1) {
      // console.log("merchant menu", response)

      // } else {
      // alert("No results");
      // }
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function uploadAvatar(image) {
  Loading.show();
  var data = new FormData();
  var unix = Math.round(+new Date() / 1000);
  var timestamp = unix + "000";
  var avatarName = "avatar" + timestamp
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append('file', {
    uri: image, 			// this is the path to your file. see Expo ImagePicker or React Native ImagePicker
    type: 'image/png',  // example: image/jpg
    name: avatarName    // example: upload.jpg
  })
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "UploadProfile",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function uploadFoodCourt(image) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append('file', {
    uri: image, 			// this is the path to your file. see Expo ImagePicker or React Native ImagePicker
    type: 'image/png',  // example: image/jpg
    name: "avatar" + global.USER.details.client_info.client_id + "1.png"    // example: upload.jpg
  })
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "UploadProfile",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      // if (response.data.code == 1) {
      // console.log("merchant menu", response)

      // } else {
      // alert("No results");
      // }
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function addFoodCourtApi(court, imageUrl) {
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("user_token", global.USER.details.client_info.token)
  data.append("client_id", global.USER.details.client_info.client_id);
  data.append("location", court.location)
  data.append("food_name", court.food_name)
  data.append("rating", court.rating)
  data.append("description", court.description)
  data.append("dish_price", court.price)
  data.append("merchant_id", court.merchant_id)
  data.append("file_type", court.file_type)
  data.append("image", imageUrl)
  data.append("approved", court.approved)

  const DATA = await Axios({
    method: "post",
    url: "AddFoodCourt",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {

      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function uploadFile(file, name) {
  Loading.show();
  var data = new FormData();
  var unix = Math.round(+new Date() / 1000);
  var timestamp = unix + "000";
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append('file', {
    uri: file.uri, 			// this is the path to your file. see Expo ImagePicker or React Native ImagePicker
    type: file.type == "image" ? "image/jpg" : "video/mp4",  // example: image/jpg
    name: name + global.USER.details.client_info.client_id + timestamp   // example: upload.jpg
  })
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "UploadFile",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  return DATA;
}

export async function uploadMFile(file, name) {
  Loading.show();
  var data = new FormData();
  var unix = Math.round(+new Date() / 1000);
  var timestamp = unix + "000";
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append('file', {
    uri: file.uri, 			// this is the path to your file. see Expo ImagePicker or React Native ImagePicker
    type: file.type == "image" ? "image/jpg" : "video/mp4",  // example: image/jpg
    name: name + global.USER.details.client_info.client_id + timestamp   // example: upload.jpg
  })
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "UploadFile",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      Loading.hide();
      return response.data;
    }.bind(this)
  );
  Loading.hide();
  return DATA;
}

export async function getSponsoredMerchant(image) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "SponsoredMerchant",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      // if (response.data.code == 1) {
      // console.log("merchant menu", response)

      // } else {
      // alert("No results");
      // }
      // console.log(response)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getFoodCourt() {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)

  const DATA = await Axios({
    method: "post",
    url: "GetFoodCourt",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function uploadBg(image) {
  Loading.show();
  var data = new FormData();
  var unix = Math.round(+new Date() / 1000);
  var timestamp = unix + "000";
  var avatarName = "avatarBg" + global.USER.details.client_info.client_id + timestamp

  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append('file', {
    uri: image, 			// this is the path to your file. see Expo ImagePicker or React Native ImagePicker
    type: 'image/png',  // example: image/jpg
    name: avatarName    // example: upload.jpg
  })

  data.append("user_token", global.USER.details.client_info.token)
  // setTimeout(()=>{
  //   Loading.hide()
  //   alert("Sorry, Upload background image is failed, please check your net status and try again.")
  // }, 20000)
  const DATA = await Axios({
    method: "post",
    url: "UploadBGfile",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {

      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getFCourtDetail(fc_id) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", fc_id)
  const DATA = await Axios({
    method: "post",
    url: "GetFoodCourtDetail",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.details) {
        NavigationService.navigate("OpenImage", {
          data: response.data.details
        });
      } else {
        Alert.alert("GRUBHOUSE", "There was net error, Please try again.")
      }

      // this.props.navigation.navigate("OpenImage")
      // console.log(response.data)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}
export async function getFCourtDetailMoreInfo(fc_id) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  // data.append("client_id", getOfferDetail)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", fc_id)
  const DATA = await Axios({
    method: "post",
    url: "GetFoodCourtDetail",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      NavigationService.navigate("OpenImageMoreInfo", {
        data: response.data.details
      });
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getFCourtDetailMoreInfoN(fc_id) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  // data.append("client_id", getOfferDetail)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", fc_id)
  const DATA = await Axios({
    method: "post",
    url: "GetFoodCourtDetail",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      NavigationService.navigate("OpenImageMoreInfoNear", {
        data: response.data.details
      });
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function toggleFClike(fc_id) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", fc_id)
  const DATA = await Axios({
    method: "post",
    url: "ToggleFCLike",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        NavigationService.navigate("OpenImage", {
          data: response.data.details
        });
      }
      // this.props.navigation.navigate("OpenImage")
      // console.log(response.data)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function addCommentApi(comment) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", comment.fc_id)
  data.append("comment", stringify(comment.comment))
  const DATA = await Axios({
    method: "post",
    url: "AddComment",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        NavigationService.navigate("AddComment", {
          data: response.data.details
        });
      }
      // this.props.navigation.navigate("OpenImage")
      // console.log(response.data)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getComments(fc_id) {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", fc_id)
  const DATA = await Axios({
    method: "post",
    url: "GetAllComment",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        return response.data
      }
      // console.log(response.data)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getCommentsHide(fc_id) {
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("fc_id", fc_id)
  const DATA = await Axios({
    method: "post",
    url: "GetAllComment",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        return response.data
      }
      // this.props.navigation.navigate("OpenImage")
      // console.log(response.data)
      return response.data;
    }.bind(this)
  );
  return DATA;
}

export async function getOfferDetail(rest_id) {
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("merchant_id", rest_id)
  const DATA = await Axios({
    method: "post",
    url: "GetOfferDetail",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      // if(response.data.code ==1){
      //   return response.data
      // }
      // console.log(response.data.details)
      if (response.data.details.length == 0) {
        alert("Network Error")
      } else {
        NavigationService.navigate("OfferDetail", {
          merchant: response.data.details.merchant,
          offers: response.data.details.offers
        });
      }
      return response.data;
    }.bind(this)
  );
  return DATA;
}

export async function getSponsoredImage() {
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "GetSponsoredImage",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {

      return response.data;
    }.bind(this)
  );
  return DATA;
}



export async function addFoodCourt() {
  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", 18)
  data.append("user_token", global.USER.details.client_info.token)
  const DATA = await Axios({
    method: "post",
    url: "GetRecentOrderMerchant",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      NavigationService.navigate("InsertFoodCourt", {
        data: response.data.details
      })
      // console.log(response.data)
      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function goDetailById(merchant) {
  // console.log(merchant)
  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("merchant_id", merchant)
  data.append("client_id", global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "searchByMerchantId",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        //   StoreToken(response.data.data.api_token);
        //   GetToken(response.data.data);
        Loading.hide();


      } else {
        alert("No results");
        Loading.hide();
      }
      return response.data.details;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function getFoodCourtMe(client_id) {

  // Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", client_id ? client_id : global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "getMyFoodCourt",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {
        //   StoreToken(response.data.data.api_token);
        //   GetToken(response.data.data);
        Loading.hide();

      } else {
        alert("No results");
        Loading.hide();
      }
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function getMyfavourite(client_id, name) {

  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", client_id != 0 ? client_id : global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "GetMyFavorite",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.code == 1) {

        Loading.hide();
        NavigationService.navigate("Favourites", {
          data: response.data.details,
          name: name ? name : "Your Favorite"
        })
      } else {
        alert("No results");
        Loading.hide();
      }
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function getSubInformation(client_id) {

  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", client_id ? client_id : global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "GetSubInformation",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      Loading.hide();
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function toggleFollowApi(target_id, flag, client_flag) {

  Loading.show();
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("target_id", target_id)
  data.append("client_flag", client_flag)
  data.append("flag", flag)
  const DATA = await Axios({
    method: "post",
    url: "ToggleFollow",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      Loading.hide();
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function toggleNotification(client_id, flag) {

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("flag", flag)
  const DATA = await Axios({
    method: "post",
    url: "ToggleNotification",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {

      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function getPublicProfile(d) {

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("target_id", d.client_id)
  const DATA = await Axios({
    method: "post",
    url: "GetPublicProfile",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      NavigationService.navigate("PublicProfile", {
        info: d,
        comment: response.data.details
      })
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function getNotifications() {

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "GetNotificationss",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      NavigationService.navigate("Followers", {
        data: response.data.details
      })
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function getDetailInfomation() {

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  const DATA = await Axios({
    method: "post",
    url: "GetDetailInfomation",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      NavigationService.navigate("Menu", {
        notifications: response.data.details.notifications
      })
      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function readNotification(id) {

  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("id", id)
  const DATA = await Axios({
    method: "post",
    url: "ReadNotifications",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {

      return response.data;
    }.bind(this)
  );
  // Loading.hide()
  return DATA;
}

export async function removeFoodCourt(id) {
  Loading.show()
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("id", id)
  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "RemoveFoodCourt",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {

      return response.data;
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getRestaurantInfo(id, userPosition) {
  Loading.show()
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", id)
  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "GetRestaurantInfoSelf",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.details && typeof userPosition != "undefined") {
        NavigationService.navigate("Details", {
          restaurant: response.data.details,
          userPosition: userPosition
        });
      } else {
        alert("Error")
      }
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function getRestaurantInfoNear(id, userPosition) {
  Loading.show()
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", id)
  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "GetRestaurantInfoSelf",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
      if (response.data.details && typeof userPosition != "undefined") {
        NavigationService.navigate("DetailsInfo", {
          restaurant: response.data.details,
          userPosition: userPosition
        });
      } else {
        alert("Error")
      }
    }.bind(this)
  );
  Loading.hide()
  return DATA;
}

export async function ReadMsg(id) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("message_id", id)
  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "readMsg",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
  );
  return DATA;
}

export async function LoadCart(id, transaction_type) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", id)
  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)
  data.append("transaction_type", transaction_type)
  data.append("lat", global.LOCATION.latitude)
  data.append("lng", global.LOCATION.longitude)
  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "loadCart",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(async res => {
    return res.data.details
  });
  return DATA;
}

export async function GetCartCount(id) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", id)
  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)
  data.append("lat", global.LOCATION.latitude)
  data.append("lng", global.LOCATION.longitude)
  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "getCartCount",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(async res => {
    return res.data.details
  }
  );
  return DATA;
}

export async function AddToCart(item) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", item.merchant_id)
  data.append("item_id", item.item_id)
  data.append("qty", item.qty)
  data.append("price", item.price)
  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)
  data.append("lat", global.LOCATION.latitude)
  data.append("lng", global.LOCATION.longitude)

  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "addToCart",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(async res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.details;
  }
  );
  return DATA;
}

export async function ClearCart(id) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", id)
  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)
  data.append("lat", global.LOCATION.latitude)
  data.append("lng", global.LOCATION.longitude)

  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "clearCart",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(async res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.details;
  }
  );
  return DATA;
}

export async function RemoveItem(id, item) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("merchant_id", id)
  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)
  data.append("row", item)

  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "removeCartItem",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(async res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.details;
  }
  );
  return DATA;
}

export async function AddDeliveryAddress(id, address) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)

  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)

  data.append("merchant_id", id)
  data.append("street", address.street)
  data.append("city", address.city)
  data.append("state", address.state)
  data.append("zipcode", address.zipcode)
  data.append("lat", address.lat)
  data.append("lng", address.lng)
  data.append("location_name", address.buildingName)
  data.append("country_code", address.countryCode)
  data.append("houseNumber", address.houseNumber)
  data.append("save_address", 1)

  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "setDeliveryAddress",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(async res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.data;
  }
  );
  return DATA;
}

export async function GetRecentAddress() {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)

  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)


  // console.log(id)
  const DATA = await Axios({
    method: "post",
    url: "AddressBookList",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    if (res.data.code == 2) {
      alert(res.data.msg)
    }
    return res.data.details;
  }
  );
  return DATA;
}

export async function PayNow(orderData, payment_type, tokenId) {
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)

  data.append("device_id", global.CONSTANT.DEVICETYPE);
  data.append("device_platform", global.CONSTANT.DEVICETYPE);
  data.append("device_uiid", global.USER.details.client_info.client_id);
  data.append("user_token", global.USER.details.client_info.token)

  data.append("merchant_id", orderData.merchant_id)
  data.append("transaction_type", orderData.transaction_type)
  data.append("delivery_date", moment(orderData.delivery_date).format('YYYY-MM-DD'))
  data.append("delivery_time", orderData.delivery_time.split("-")[0])
  data.append("payment_provider", payment_type)
  data.append("tokenId", tokenId)
  data.append("delivery_instruction", orderData.delivery_instruction)
  data.append("transaction_type", orderData.transaction_type)
  data.append("save_address", orderData.save_address)
  data.append("total_price", orderData.total_price)

  const DATA = await Axios({
    method: "post",
    url: "payNow",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.data;
  }
  );
  return DATA;
}

export async function GetOpenTime(merchant_id) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)

  data.append("merchant_id", merchant_id)

  // console.log(data, "==================")

  const DATA = await Axios({
    method: "post",
    url: "getOpenTime",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.data;
  }
  );
  return DATA;
}

export async function CheckCart() {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)

  const DATA = await Axios({
    method: "post",
    url: "checkCart",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.data.details;
  }
  );
  return DATA;
}

export async function forgotPwd(email) {
  // console.log(userPosition)
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("user_mobile", email)

  const DATA = await Axios({
    method: "post",
    url: "retrievePassword",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.data;
  }
  );
  return DATA;
}

export async function sendSupportEmail(body, title) {
  // console.log(userPosition)
  var data = new FormData();

  data.append("api_key", " admin@1474?");
  data.append("emailBody", body)
  data.append("title", title)
  data.append("client_id", global.USER.details.client_info.client_id)

  const DATA = await Axios({
    method: "post",
    url: "sendSupportEmail",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    // saveData(global.USER_CART_TOTAL, res.details, global.CART_TOTAL)
    return res.data;
  });
  return DATA;
}