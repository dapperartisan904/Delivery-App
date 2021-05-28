import { createAppContainer } from "react-navigation";
import login from "../screens/authScreen/login";
import signup from "../screens/authScreen/signup";
import Forgot from "../screens/authScreen/forgot";
import codeSignup from "../screens/authScreen/codeSignup";

import { createStackNavigator } from "react-navigation-stack";

export default createAppContainer(
  createStackNavigator(
    {
      Login: { screen: login },
      Signup: { screen: signup },
      Forgot: { screen: Forgot },
      Code: { screen: codeSignup }
    },
    {
      initialRouteName: "Login",
      headerLayoutPreset: "center"
    }
  )
);
