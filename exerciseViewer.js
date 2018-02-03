import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import {
  Video,
  Font
} from "expo";

import {
  GIPHY_API_KEY
} from "./api_keys"

const exercises = [
  { name: "Lunges" },
  { name: "Jumping Jacks" },
  { name: "Squat jumps" },
  { name: "Sit-ups" },
  { name: "Crunches" },
  { name: "Push-ups" },
  { name: "Squats" },
  { name: "Calf-raises" },
  { name: "Hyperextensions" },
  { name: "Leg raises" },
  { name: "Planks" },
  { name: "Burpees" },
  { name: "Sprinting" },
];

export default class ExerciseViewer extends React.Component {

  state = {
    exerciseName: "",
    videoUrl: "",
    fontLoaded: false
  };

  updateExercise() {
    const exerciseIndex = Math.floor((Math.random() * exercises.length));

    const requestUrl = `
      https://api.giphy.com/v1/gifs/search?
      api_key=${GIPHY_API_KEY}&
      q=${exercises[exerciseIndex].name.replace(/\ /g, "+")}&
      limit=1&
      offset=0&rating=PG-13&lang=en
    `.replace(/\ /g, "").replace(/\n/g, "");

    const videoURL = fetch(requestUrl)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        exerciseName: exercises[exerciseIndex].name,
        videoUrl: responseJson.data[0].images.looping.mp4
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  async componentDidMount() {
    this.updateExercise();

    await Font.loadAsync({
      'PassionOne-Black': require('./assets/fonts/PassionOne-Black.ttf'),
    });

    this.setState({fontLoaded: true});
  }

  render() {
    return (
      <View
        style={{
          flex: 1.0,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this.state.videoUrl.length > 0 && <View style={styles.videoWrapper}>
          <Video 
            source={{ uri: this.state.videoUrl}}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode={Video.RESIZE_MODE_COVER}
            shouldPlay
            isLooping
            style={{flex: 1.0}}
          />
        </View>}
        {this.state.fontLoaded && <Text
          style={{
            color: "white",
            fontSize: 120,
            fontFamily: "PassionOne-Black"
          }}
        >{`10 ${this.state.exerciseName.toUpperCase()}`}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  videoWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
