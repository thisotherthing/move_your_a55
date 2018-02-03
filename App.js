import React from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Permissions,
  Constants,
  Notifications,
  Video
} from "expo";

import ExerciseViewer from "./exerciseViewer";
import NotificationHandler from "./notificationHandler";

export default class App extends React.Component {

  state = {
    appState: "active",
    notificationHandler: new NotificationHandler()
  }
  
  constructor(props) {
    super(props);
    
    this.onAppStateChange = this.onAppStateChange.bind(this);
  }
  
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
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return false;
    } else {
      return true;
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);

    this.state.notificationHandler.setUpNotifications();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      console.log('App has come to the foreground!');

      this.exerciseViewerRef.updateExercise();
    }
    this.state.appState = nextAppState;
  }

  render() {
    return (
      <View
        style={{flex: 1.0}}
      >
        <ExerciseViewer
          ref={(ref) => {this.exerciseViewerRef = ref; }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
