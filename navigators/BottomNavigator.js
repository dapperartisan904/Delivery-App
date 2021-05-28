import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Login from "../screens/login";

createMaterialBottomTabNavigator(
  {
    Login: { screen: Login }
  },
  {
    initialRouteName: "Login",
    activeColor: "#f0edf6",
    inactiveColor: "#3e2465",
    barStyle: { backgroundColor: "#694fad" }
  }
);
