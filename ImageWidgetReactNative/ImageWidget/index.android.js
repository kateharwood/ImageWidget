/*
  Image Widget Example
  By: Kate Harwood
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';

const IMG_WIDTH = 300;
const IMG_HEIGHT = 200;

class ImageWidget extends Component {

  constructor (props) {
    super (props);
    this.titles = ['Cat #1', 'Cat #2', 'Cat #3'];
    this.info = ['This first cat is pretty cute', 'This one is too though', 'But look at this one'];
    this.images = [require('./imgs/cat1.jpg'), require('./imgs/cat2.jpg'), require('./imgs/cat3.jpg')]
    this.imageNum = 0; // keeps track of place in gallery

    this.state =
    {
      pressed: false,
      title: this.titles[this.imageNum],
      image: this.images[this.imageNum],
      imgInfo: this.info[this.imageNum],
      titlePosition: new Animated.Value(-50), // value to change to slide text
      infoPosition: new Animated.Value(IMG_HEIGHT + 50),
      navPosition: new Animated.Value(IMG_HEIGHT + 50),
    };
  }

  getTitleStyle () {
    return (
      {
        backgroundColor: 'rgba(0,0,0,.75)',
        width: IMG_WIDTH,
        transform: [{translateY: this.state.titlePosition}],
      }
    );
  }

  getNavStyle (whichButton) {
    let left = IMG_WIDTH - 60;
    if (whichButton === 'right') {
      left = IMG_WIDTH - 30;
    };

    return (
      {
        left: left,
        width: 30,
        position: 'absolute',
        transform: [{translateY: this.state.navPosition}],
      }
    );
  }

  getInfoStyle () {
    return (
      {
        backgroundColor: 'rgba(0,0,0,.75)',
        width: IMG_WIDTH,
        transform: [{translateY: this.state.infoPosition}],
      }
    );
  }

  // toggles press
  onPressImage = () => {
    this.setState({
      pressed: !this.state.pressed,
    });

    this.slideText();
  }

  // slides text onto image on press,
  // on next press slides text off image  
  slideText () {
    let titleStart = -60; // off screen
    let titleEnd = 0;
    let infoStart = IMG_HEIGHT; // off screen
    let infoEnd = IMG_HEIGHT - 80;

    if (this.state.pressed) { // if text already onscreen
      titleStart = 0;
      titleEnd = -50;
      infoStart = IMG_HEIGHT - 80;
      infoEnd = IMG_HEIGHT + 50;
    };

    this.state.titlePosition.setValue(titleStart);
    this.state.infoPosition.setValue(infoStart);
    this.state.navPosition.setValue(titleStart - 50);
                        // bc nav buttons are originally below title

    Animated.parallel([
      Animated.timing(
        this.state.titlePosition,
        {
          toValue: titleEnd,
          duration: 500, // ms
        }
      ),
      Animated.timing(
        this.state.navPosition,
        {
          toValue: titleEnd - 50,
          duration: 500,
        }
      ),
      Animated.timing(
        this.state.infoPosition,
        {
          toValue: infoEnd,
          duration: 500,
        }
      ),
    ]).start();
  }

  // navigates through the pictures, wrapping around to beginning
  // if at end of gallery
  onPressNav (direction) {
    if (direction === 'right') { // move right through gallery
      if(this.imageNum === this.images.length - 1) {
        this.imageNum = 0; // wrap
      }
      else {
        this.imageNum++;
      }
    }
    else { // move left through gallery
      if(this.imageNum === 0) {
        this.imageNum = this.images.length - 1; // wrap
      }
      else{
        this.imageNum = this.imageNum - 1;
      }
    }
    this.setState({
      image: this.images[this.imageNum],
      title: this.titles[this.imageNum],
      imgInfo: this.info[this.imageNum],
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
        onPress={this.onPressImage}>
          <Image 
            style={styles.image}
            source={this.state.image}
            resizeMode={'cover'}>

              <Animated.View style={this.getTitleStyle()}>
                <Text style={styles.imgText}>{this.state.title}</Text>
              </Animated.View>

              <Animated.View style={this.getNavStyle('left')}>
                <TouchableOpacity onPress={this.onPressNav.bind(this, 'left')}>
                  <Text style={styles.navButton}>{'<'}</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={this.getNavStyle('right')}>
                <TouchableOpacity onPress={this.onPressNav.bind(this, 'right')}>
                  <Text style={styles.navButton}>{'>'}</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={this.getInfoStyle()}>
                <Text style={styles.imgText}>{this.state.imgInfo}</Text>
              </Animated.View>

          </Image>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
  },
  imgText: {
    color: 'white',
    padding: 10,
  },
  navButton: {
    color: 'white',
    padding: 10,
    fontSize: 20,
  },
});

AppRegistry.registerComponent('ImageWidget', () => ImageWidget);
