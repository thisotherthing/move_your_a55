import {
  Permissions,
  Constants,
  Notifications,
} from "expo";

export default class NotificationHandler {

  state = {
    ranCheck: false,
    notificationsAllowed: false
  };

  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    this.state.ranCheck = true;
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return false;
    } else {
      return true;
    }
  }

  async setUpNotifications() {
    this.state.notificationsAllowed = await this.registerForPushNotificationsAsync();

    console.log(this.state.notificationsAllowed);

    if (!this.state.notificationsAllowed) {
      return;
    }

    const localNotification = {
      title: "test t",
      body: "test body", // (string) — body text of the notification.
      data: {"foo": "foobar"},
      ios: { // (optional) (object) — notification configuration specific to iOS.
        sound: false // (optional) (boolean) — if true, play a sound. Default: false.
      },
      android: // (optional) (object) — notification configuration specific to Android.
      {
        sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
        //icon (optional) (string) — URL of icon to display in notification drawer.
        //color (optional) (string) — color of the notification icon in notification drawer.
        priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
        sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
        vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
        // link (optional) (string) — external link to open when notification is selected.
      }
    };

    let t = new Date();
    t.setSeconds(t.getSeconds() + 10);


    console.log(t.toUTCString());

    const schedulingOptions = {
      time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
      // repeat: false
    };

    Notifications.addListener(({ origin, data }) => {
      console.info(`Notification (${origin})  with data: ${JSON.stringify(data)}`);
    });

    Notifications
      .scheduleLocalNotificationAsync(localNotification, schedulingOptions)
      .then((id) => {
        console.log("Success " + id);
      })
      .catch((e) => {
          console.log(`Failure (${e})`)
      });

    // Notifications.cancelAllScheduledNotificationsAsync();
  }
}
