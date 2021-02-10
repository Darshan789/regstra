import React, { Component } from "react";
import Image from "react-bootstrap/Image";

export default class Loader extends Component {
  render() {
    return (
      <div className="loader-main">
        <Image src="../images/loader.svg" />
      </div>
    );
  }
}
