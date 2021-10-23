import React, { Component } from "react";
import "../stylesheets/Player.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

class Player extends React.Component {
  state = {
    playing: false,
    currentSong: 0,
    currentPosition: 0,
    audioSliderUpdateInterval: 1000,
    interval: null,
  };
  audio = new Audio();

  startAudioSlider() {
    clearInterval(this.state.interval);
    this.state.interval = setInterval(() => {
      this.setState({ currentPosition: this.state.currentPosition + 1 });
    }, this.state.audioSliderUpdateInterval);
  }

  stopAudioSlider() {
    clearInterval(this.state.interval);
  }

  play(songID) {
    if (songID === 0) return;

    this.audio.src = "http://localhost:3001/api/song?songID=" + songID;
    this.audio.volume = this.props.volume / 100;
    this.audio.muted = this.props.muted;
    this.setState({
      playing: true,
      length: this.audio.duration,
      currentPosition: 0,
    });
    this.audio.addEventListener("playing", () => {
      this.startAudioSlider();
    });
    this.audio.addEventListener("ended", () => {
      this.stopAudioSlider();
    });
    this.audio.play();
  }

  pause() {
    this.audio.pause();
    this.stopAudioSlider();
    this.setState({ playing: false });
  }

  resume() {
    this.audio.play();
    this.startAudioSlider();
    this.setState({ playing: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.songID != this.state.currentSong) {
      this.setState({ currentSong: nextProps.songID });
      this.play(nextProps.songID);
    }
    this.audio.volume = nextProps.volume / 100;
    this.audio.muted = nextProps.muted;
  }

  togglePlay = () => {
    if (this.state.currentSong === 0) return;
    if (this.state.playing) this.pause();
    else this.resume();
  };

  handleSliderChange = (position) => {
    const wasPlaying = this.state.playing;
    if (wasPlaying) this.pause();
    this.setState({ currentPosition: Number(position) });
    this.audio.currentTime = Number(position);
    if (wasPlaying) this.resume();
  };

  secondsToTime(seconds) {
    if (isNaN(seconds)) seconds = 0;
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    seconds = String(seconds - minutes * 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  getPlayIcon() {
    var className = "icon bi bi-";
    className += this.state.playing ? "pause" : "play";
    className += "-fill";
    return className;
  }

  render() {
    return (
      <div class="main">
        <div class="buttons">
          <button class="shuffleButton"></button>
          <button class="prevButton"></button>
          <button onClick={this.togglePlay} class="playButton">
            <i class={this.getPlayIcon()}></i>
          </button>
          <button class="nextButton"></button>
          <button class="repeatButton"></button>
        </div>
        <div class="playingSlider">
          <text class="playerText">
            {this.secondsToTime(this.state.currentPosition)}
          </text>
          <input
            type="range"
            value={this.state.currentPosition}
            onChange={(e) => this.handleSliderChange(e.target.value)}
            max={this.audio.duration}
            class="slider"
          />
          <text class="playerText">
            {this.secondsToTime(this.audio.duration)}
          </text>
        </div>
      </div>
    );
  }
}

export default Player;
