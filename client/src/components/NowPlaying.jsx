import React, { Component } from "react";
import Axios from "axios";
import "../stylesheets/NowPlaying.css";
import "bootstrap-icons/font/bootstrap-icons.css";

class NowPlaying extends React.Component {
  state = {
    songName: "",
    artistName: "",
    albumArt: "",
    favorite: false,
  };

  retrieveData(songID) {
    Axios.get("http://localhost:3001/api/metadata", {
      params: { songID: songID },
    }).then((response) => {
      this.setState({
        songName: response.data.title,
        artistName: response.data.artist,
      });
    });
  }

  getAlbumArt(songID) {
    Axios.get("http://localhost:3001/api/albumart", {
      params: { songID: songID },
    }).then((response) => {
      var coverpath = response.data.coverpath;
      if (coverpath === "") coverpath = "default.jpg";
      else coverpath = "http://localhost:3001/" + coverpath;
      this.setState({
        albumArt: coverpath,
      });
    });
  }

  getFavoriteStatus(songID) {
    Axios.get("http://localhost:3001/api/checkfavorite", {
      params: { songID: songID},
    }).then((response) => {
      this.setState({ favorite: response.data });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.songID != 0) {
      this.retrieveData(nextProps.songID);
      this.getAlbumArt(nextProps.songID);
      this.getFavoriteStatus(nextProps.songID);
    }
  }

  getFavoriteIcon() {
    var icon = "bi-heart";
    if (this.state.favorite) icon += "-fill";
    return icon;
  }

  unfavorite() {
    Axios.post("http://localhost:3001/api/unfavorite", {
      params: { songID: this.props.songID},
    });
  }

  makeFavorite() {
    Axios.post("http://localhost:3001/api/favorite", {
      params: { songID: this.props.songID},
    });
  }

  toggleFavorite = () => {
    if (!this.state.favorite) this.makeFavorite();
    else this.unfavorite();
    this.setState({ favorite: !this.state.favorite });
  };

  checkVisibility() {
    if (this.state.songName === "") return false;
    else return true;
  }

  render() {
    return (
      <div class="nowPlaying">
        <div class="image">
          <img src={this.state.albumArt} />
        </div>
        <div class="details">
          <text class="songName">{this.state.songName}</text>
          <text class="artistName">{this.state.artistName}</text>
        </div>
        <div class="actions" hidden={!this.checkVisibility()}>
          <button class="favorite" onClick={() => this.toggleFavorite()}>
            <i class={"icon bi " + this.getFavoriteIcon()}></i>
          </button>
        </div>
      </div>
    );
  }
}

export default NowPlaying;
