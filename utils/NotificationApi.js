import * as Notifications from 'expo-notifications';
import * as Permissions from "expo-permissions";
import Axios from "axios";
import global from "../global";
import stringify from "./stringify";
export async function getPushNotificationPermissions () {
    try {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      // If we don't already have permission, ask for it
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus === 'granted') {
        return true;
      }
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Warning',
          'You will not receive reminders if you do not enable push notifications. If you would like to receive reminders, please enable push notifications for Fin in your settings.',
          [
            { text: 'Cancel' },
            { text: 'Enable Notifications', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
          ]
        )
        return false;
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong while check your notification permissions, please try again later.'
      );
      return false;
    }
  }



export async function registerForPushNotificationsAsync() {

  const expoPushToken = await Notifications.getExpoPushTokenAsync();
    var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", global.USER.details.client_info.client_id)
  data.append("user_token", global.USER.details.client_info.token)
  data.append("expo_token", expoPushToken.data)
  const DATA = await Axios({
    method: "post",
    url: "SaveExpoToken",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    function (response) {
        
    }.bind(this)
  );

    return expoPushToken;
  // console.log(expoPushToken)
//   alert(expoPushToken.data)

//   await fetch('https://example.com/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       userId,
//       expoPushToken,
//     }),
//   });
}

export async function sendNotification(expoToken, notification, target) {
  // console.log(target.client_id, global.USER.details.client_info.client_id)
  if(target.client_id == global.USER.details.client_info.client_id){
    return false
  } 

  pushLog(expoToken, notification, target)
      // return responseJson;
    
  // console.log("send push")
  return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
      to: expoToken,
      title: notification.title,
      body: notification.url?'image':notification.body,
      data: { message: "afasdasd" },
      }),
      headers: {
      'Content-Type': 'application/json',
      },
      method: 'POST',
  }).then((response) => response.json())
  .then(async(responseJson) => {
    return responseJson
  });
}

export async function pushLog(expoToken, notification, target) {
  var data = new FormData();
  data.append("api_key", " admin@1474?");
  data.append("client_id", target.client_id)
  data.append("client_name", target.first_name)
  data.append("trigger_id", global.USER.details.client_info.client_id)
  data.append("push_title", notification.title)
  data.append("push_message", notification.url?notification.url:stringify(notification.body))
  data.append("by_id", notification.hasOwnProperty('by_id')?notification.by_id:0)
  data.append("by_type", notification.url?'image':null)
  // console.log(data, "push logo insert")
  const DATA = await Axios({
    method: "post",
    url: "InsertPushMsg",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(
    // console.log(target)
  );
}

