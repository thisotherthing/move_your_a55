import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  MaskedViewIOS
} from 'react-native';

import {
  Video,
  Font
} from "expo";

import {
  map,
  clamp,
  getRandomInt
} from "./littleMathLib";

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
  // { name: "Hyperextensions" },
  { name: "Leg raises" },
  { name: "Planks" },
  { name: "Burpees" },
  // { name: "Sprinting" },
];

export default class ExerciseViewer extends React.Component {

  state = {
    exerciseName: "",
    videoUrl: "",
    videoUrl2: "",
    fontLoaded: false
  };

  updateExercise() {
    const exerciseIndex = Math.floor((Math.random() * exercises.length));

    const requestUrl = `
      https://api.giphy.com/v1/gifs/search?
      api_key=${GIPHY_API_KEY}&
      q=${exercises[exerciseIndex].name.replace(/\ /g, "+")}&
      limit=2&
      offset=0&rating=PG-13&lang=en
    `.replace(/\ /g, "").replace(/\n/g, "");

    const videoURL = fetch(requestUrl)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        exerciseName: exercises[exerciseIndex].name,
        videoUrl: responseJson.data[0].images.looping.mp4,
        videoUrl: responseJson.data[1].images.looping.mp4
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
    const displayString = `${getRandomInt(5, 20)} ${this.state.exerciseName.toUpperCase()} NOW`;
    let fontSize = map(
      displayString.length,
      13, 22,
      160, 130
    );

    fontSize = clamp(120, 165, fontSize);

    // console.log(displayString.length);

    // 13 => 160
    // 22 => 130

    return (
      <View
        style={{flex: 1.0}}
      >
        <MaskedViewIOS
          style={{flex: 1.0}}
          maskElement={
            <View
              style={{
                flex: 1.0,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.state.fontLoaded && <Text
                style={{
                  color: "white",
                  fontSize,
                  lineHeight: fontSize,
                  fontFamily: "PassionOne-Black",
                  // textAlign: "center",
                  textAlign: "justify",
                  padding: 20
                }}
              >{displayString.split('').join('\u200A')}</Text>}
            </View>
          }
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
            {/* <View
              style={{backgroundColor: "red", flex: 1.0}}
            ></View> */}
          </View>}
        </MaskedViewIOS>
        
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
