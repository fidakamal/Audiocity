import React from "react";
import SearchBar from "./SearchBar";
import "../stylesheets/Header.css";
import { withRouter } from "react-router-dom";

class Header extends React.Component {
  getSearchBar() {
    if (this.props.location.pathname === "/search") {
      return (
        <SearchBar
          onSearch={this.props.onSearch}
          searchTerm={this.props.searchTerm}
        />
      );
    }
  }

  render() {
    return (
      <div class="headerContent">
        <div class="searchBar">{this.getSearchBar()}</div>
      </div>
    );
  }
}

export default withRouter(Header);
