import React, { useState, useEffect, Component } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "../stylesheets/Table.css";
import "bootstrap-icons/font/bootstrap-icons.css";

class Table extends React.Component {
  state = {
    data: [],
  };

  getData(searchTerm) {
    Axios.get("http://localhost:3001/api/query", {
      params: { searchTerm: searchTerm },
    }).then((response) => {
      this.setState({ data: response.data });
    });
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.searchTerm);
  }

  render() {
    return (
      <div className="table">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 + "px" }}></th>
              <th style={{ width: 70 + "px" }}></th>
              <th style={{ width: 250 + "px" }}>Title</th>
              <th style={{ width: 250 + "px" }}>Artist</th>
              <th style={{ width: 250 + "px" }}>Album</th>
              <th style={{ width: 100 + "px" }}>Uploader</th>
            </tr>
          </thead>
          <tbody overflow>
            {this.state.data.map((item) => {
              return (
                <tr key={item.title}>
                  <td style={{ width: 40 + "px" }}>
                    <i
                      data-id={item.ID}
                      onClick={(e) =>
                        this.props.onPlay(e.target.getAttribute("data-id"))
                      }
                      class="icon bi bi-play-fill"
                    ></i>
                  </td>
                  <td style={{ width: 70 + "px" }} class="img">
                    <img src={"http://localhost:3001/" + item.coverpath} />
                  </td>
                  <td style={{ width: 250 + "px" }} class="title">
                    {item.title}
                  </td>
                  <td style={{ width: 250 + "px" }}>{item.artist}</td>
                  <td style={{ width: 250 + "px" }}>{item.album}</td>
                  <td style={{ width: 150 + "px" }}>{item.uploader}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
