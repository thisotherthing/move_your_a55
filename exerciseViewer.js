import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Video
} from "expo";

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

const key = "gw9qzUQAqXgvEFIV0ZARU4iZMrXaLw0y";

export default class ExerciseViewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      exerciseName: "",
      videoUrl: ""
    };
  }

  updateExercise() {
    const exerciseIndex = Math.floor((Math.random() * exercises.length));

    const requestUrl = `
      https://api.giphy.com/v1/gifs/search?
      api_key=${key}&
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

  componentDidMount() {
    this.updateExercise();
  }

  render() {
    return (
      <View
        style={{flex: 1.0}}
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
        <Text
          style={{
            color: "white",
            marginTop: 100
          }}
        >{this.state.exerciseName}</Text>
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
