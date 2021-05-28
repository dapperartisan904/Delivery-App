import {
  createAppContainer,
  NavigationActions,
  StackActions,
} from "react-navigation";
import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Icon } from "react-native-elements";
import bills from "../screens/userScreen/bills";
import groupBills from "../screens/userScreen/groupBills";
import home from "../screens/userScreen/home";
import normalProfile from "../screens/userScreen/normalProfile";
import normalPProfile from "../screens/userScreen/normalPProfile";
import normalFProfile from "../screens/userScreen/normalFProfile";
import menu from "../screens/userScreen/menu";
import foodCourt from "../screens/userScreen/foddCourt";
import restaurantDetails from "../screens/userScreen/restaurantDetails";
import restaurantDetailsNear from "../screens/userScreen/restaurantDetailsNear";
import newProof from "../screens/userScreen/newProof";
import funkyFive from "../screens/userScreen/funkyFive";
import orders from "../screens/userScreen/orders";
import basket from "../screens/userScreen/basket";
import searchScreen from "../screens/userScreen/searchScreen";
import nearbyRestorants from "../screens/userScreen/nearbyRestorants";
import help from "../screens/userScreen/help";
import trafficLight from "../screens/userScreen/trafficLight";
import preOrder from "../screens/userScreen/preOrder";
import favourites from "../screens/userScreen/favourites";
import dinning from "../screens/userScreen/dinning";
import dinningRestaurant from "../screens/userScreen/dinningRestaurant";
import rating from "../screens/userScreen/rating";
import addressSearchScreen from "../screens/userScreen/addressSearchScreen";
import newGrub from "../screens/userScreen/newGrub";
import searchRestauranrScreen from "../screens/userScreen/searchRestaurantScreen";
import studentProfile from "../screens/userScreen/studentProfile";
import sendGift from "../screens/userScreen/sendGift";
import sendFoodScreen from "../screens/userScreen/sendFoodScreen";
import sendCoinScreen from "../screens/userScreen/sendCoinScreen";
import requestCoinScreen from "../screens/userScreen/requestCoinScreen";
import loyaltyPoints from "../screens/userScreen/loyaltyPoints";
import redeemScreen from "../screens/userScreen/redeemScreen";
import earnScreen from "../screens/userScreen/earnScreen";
import historyScreen from "../screens/userScreen/historyScreen";
import groupIntroScreen from "../screens/userScreen/groupIntroScreen";
import ComingScreen from "../screens/userScreen/ComingScreen";

import membership from "../screens/userScreen/membership";
import customerBasket from "../screens/userScreen/customerBasket";
import tableReservation from "../screens/userScreen/tableReservation";
import reservationsScreen from "../screens/userScreen/reservationsScreen";
import message from "../screens/userScreen/message";
import sendMessage from "../screens/userScreen/messageSend";
import inviteScreen from "../screens/userScreen/inviteScreen";
import detailsScreen from "../screens/userScreen/detailsScreen";
import detailsScreenNear from "../screens/userScreen/detailsScreenNear";
import array from "../screens/userScreen/array";
import followers from "../screens/userScreen/followers";
import followingP from "../screens/userScreen/followingp";
import following from "../screens/userScreen/following";
import customerSupport from "../screens/userScreen/customerSupport";
import allergensScreen from "../screens/userScreen/allergensScreen";
import technicalCustomerSupport from "../screens/userScreen/technicalCustomerSupport";
import informationSupport from "../screens/userScreen/informationSupport";
import suggestion from "../screens/userScreen/suggestion";
import thankYou from "../screens/userScreen/thankYou";
import previousGroup from "../screens/userScreen/previousGroup";
import openImage from "../screens/userScreen/openImage";
import openImageMoreInfo from "../screens/userScreen/openImageMoreInfo";
import groupDetails from "../screens/userScreen/groupDetails";
import requestCoinThankYou from "../screens/userScreen/requestCoinThankYou";
import familyprofile from "../screens/userScreen/familyProfile";
import familyProfile from "../screens/userScreen/familyProfile";
import likesScreen from "../screens/userScreen/likesScreen";
import viewProfileScreen from "../screens/userScreen/viewProfileScreen";
import combo from "../screens/userScreen/combo";
import selectRestro from "../screens/userScreen/selectRestro";
import familyProfileCard from "../screens/userScreen/familyProfileCard";
import familyProfileMembers from "../screens/userScreen/familyProfileMembers";
import FamilyPayments from "../screens/userScreen/FamilyPayments";
import emptyBasket from "../emptyBasket";
import datepicker from "../screens/userScreen/datepicker";
import addFoodCourt from "../screens/userScreen/addFoodCourt";
import restaurantMapView from "../screens/userScreen/restaurantMapView";
import addComment from "../screens/userScreen/addComment";
import offerDetail from "../screens/userScreen/offerDetail";
import viewProfile from "../screens/userScreen/viewProfile";

export default createAppContainer(
  createMaterialBottomTabNavigator(
    {
      Home: createStackNavigator(
        {
          Home: { screen: home},
          OpenImageMoreInfo: { screen: openImageMoreInfo },
          SearchScreen: { screen: searchScreen },
          Dinning: { screen: dinning },
          DinningRestaurant: { screen: dinningRestaurant },
          TableReservation: { screen: tableReservation },
          Rating: { screen: rating },
          Traffic: { screen: trafficLight },
          AddressSearch: { screen: addressSearchScreen },
          SearchRestaurant: { screen: searchRestauranrScreen },
          NewGrub: { screen: newGrub },
          Previous: { screen: previousGroup },
          GroupDetails: { screen: groupDetails },
          NewProof: { screen: newProof },
          FunkyFive: { screen: funkyFive },
          Orders: { screen: orders },
          Basket: { screen: basket },
          EmptyBasket: { screen: emptyBasket },
          Bills: { screen: bills },
          Select: { screen: selectRestro },
          GroupBills: { screen: groupBills },
          SendGift: { screen: sendGift },
          SendFood: { screen: sendFoodScreen },
          SendCoin: { screen: sendCoinScreen },
          RequestCoin: { screen: requestCoinScreen },
          RequestThankYou: { screen: requestCoinThankYou },
          Coming : { screen: ComingScreen },
          GroupIntro: { screen: groupIntroScreen },
          Invite: { screen: inviteScreen },
          DetailsScreen: { screen: detailsScreen },
          Array: { screen: array },
          Support: { screen: customerSupport },
          Allergens: { screen: allergensScreen },
          TechnicalSupport: { screen: technicalCustomerSupport },
          Information: { screen: informationSupport },
          Suggetion: { screen: suggestion },
          ThankYou: { screen: thankYou },
          Combo: { screen: combo },
          DatePicker: { screen: datepicker},
          restaurantMapView: { screen: restaurantMapView},
          Details: { screen: restaurantDetails },
          CustomerBasket: { screen: customerBasket },
        },
        {
          initialRouteName: "Home",
          headerLayoutPreset: "center",
          navigationOptions: {
            tabBarLabel: "HOME",
            tabBarIcon: ({ tintColor }) => (
              <Icon
                name="home"
                type="material-community"
                size={26}
                color="#000"
                iconStyle={{ width: 30 }}
              />
            ),
          }
        },
        {
          postion: "asdfasdfasdf"
        }
      ),
      Search: createStackNavigator(
        {
          Nearby: { screen: nearbyRestorants },
          DetailsScreenNear: { screen: detailsScreenNear },
          DetailsInfo: { screen: restaurantDetailsNear},
          CustomerBasket: { screen: customerBasket },
          OpenImageMoreInfoNear: { screen: openImageMoreInfo },
        },

        {
          initialRouteName: "Nearby",
          headerLayoutPreset: "center",
          navigationOptions: {
            tabBarLabel: "NEARBY",
            tabBarIcon: ({ tintColor }) => (
              <Icon
                name="magnify"
                type="material-community"
                size={26}
                color="#000"
                iconStyle={{ width: 30 }}
              />
            ),
          },
        }
      ),

      FoodCourt: createStackNavigator(
        {
          Food: { screen: foodCourt },
          OpenImage: { screen: openImage },
          AddComment: { screen: addComment},
          Like: { screen: likesScreen },
          ViewProfile: { screen: viewProfileScreen },
          OfferDetail: { screen: offerDetail},
          DetailsScreen: { screen: detailsScreen },
          FProfile: { screen: normalPProfile }
        },
        {
          initialRouteName: "Food",
          headerLayoutPreset: "center",
          navigationOptions: {
            tabBarLabel: "FOOD COURT",
            tabBarIcon: ({ tintColor }) => (
              <Icon
                name="silverware"
                type="material-community"
                size={26}
                color="#000"
                iconStyle={{ width: 30 }}
              />
            ),
          },
        }
      ),

      Profile: createStackNavigator(
        {
          Profile: { screen: normalProfile },
          InsertFoodCourt: { screen: addFoodCourt },
          Nearby: { screen: nearbyRestorants },
          PreOrder: { screen: preOrder },
          Menu: { screen: menu },
          Favourites: { screen: favourites },
          Help: { screen: help },
          StudentProfile: { screen: studentProfile },
          LoyaltyPoints: { screen: loyaltyPoints },
          Redeem: { screen: redeemScreen },
          Earn: { screen: earnScreen },
          History: { screen: historyScreen },
          Membership: { screen: membership },
          Reservations: { screen: reservationsScreen },
          Message: { screen: message },
          SendMessage: { screen: sendMessage },
          Followers: { screen: followers },
          Following: { screen: following },
          FollowingP: { screen: followingP },
          FamilyProfile: { screen: familyProfile },
          FamilyProfileCard: { screen: familyProfileCard },
          FamilyProfileMembers: { screen: familyProfileMembers },
          FamilyPayments: { screen: FamilyPayments },
          FamilyPayments: { screen: FamilyPayments },
          PublicProfile: { screen: normalPProfile }
          // GridScreen: { screen: gridScreen }
        },
        {
          initialRouteName: "Profile",
          headerLayoutPreset: "center",
          navigationOptions: {
            // labeled: false,
            tabBarLabel: "PROFILE",
            tabBarIcon: ({ tintColor }) => (
              <Icon
                name="account"
                type="material-community"
                size={26}
                color="#000"
                iconStyle={{ width: 30 }}
              />
            ),
          },
        }
      ),
    },
    {
      initialRouteName: "Home",
      barStyle: { backgroundColor: "#fff" },
      resetOnBlur: true,
    }
  )
);
