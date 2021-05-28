import { createSwitchNavigator, createAppContainer } from "react-navigation";
import React, { Component } from "react";
import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";
import NavigationService from "../utils/NavigationService";
import Introduction from "../screens/userScreen/introduction";
// import AuthLoading from "../screens/auth/Authloading";

const TopLevelNavigator = createSwitchNavigator(
  {
    Intro: { screen: Introduction },
    Auth: AuthNavigator,
    UserApp: UserNavigator,
  },
  {
    initialRouteName: "Auth",
  }
);

const AppContainer = createAppContainer(TopLevelNavigator);

export default class MainNavigator extends Component {
  render() {
    return (
      <AppContainer
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
