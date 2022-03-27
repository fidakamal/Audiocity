import React, { Component } from "react";
import "../stylesheets/Sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

class Sidebar extends React.Component {
  state = {
    selectedButton: "Home",
  };

  constructor() {
    super();
    this.state.selectedButton = window.location.href
      .replace(window.location.origin, "")
      .split("/")[1];
  }

  checkSelected(button) {
    if (button.toUpperCase() === this.state.selectedButton.toUpperCase())
      return "selected";
  }

  render() {
    return (
      <div class="sidebarButtons">
        <div>
          <h3>Audiocity</h3>
            <p>Local</p>
        </div>
        <Link class="link" to="/">
          <button
            onClick={() => {
              this.setState({ selectedButton: "Home" });
            }}
            class={this.checkSelected("Home")}
          >
            <i class="icon bi bi-house"></i>Home
          </button>
        </Link>

        <Link class="link" to="/search?">
          <button
            class={this.checkSelected("Search")}
            onClick={() => {
              this.props.onSearch("");
              this.setState({ selectedButton: "Search" });
            }}
          >
            <i class="icon bi bi-search"></i>Search
          </button>
        </Link>
          <Link class="link" to="/playlist">
              <button
                  class={this.checkSelected("Playlist")}
                  onClick={() => {
                      this.setState({ selectedButton: "Playlist" });
                  }}
              >
                  <i class="icon bi bi-music-note-list"></i>Playlists
              </button>
          </Link>
      </div>
    );
  }
}

export default Sidebar;
