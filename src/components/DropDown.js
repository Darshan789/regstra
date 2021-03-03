import React, { Component } from "react";
import Image from "react-bootstrap/Image";

class DropDown extends Component {
  id = localStorage.getItem("id");
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      style: "",
      dimension: "",
      isLoaded: false,
    };
  }

  typeValueSelected = (event) => {
    // console.log(event.target.data-dropdown-value);
    event.preventDefault();
    if (event.currentTarget.id == "all" && this.state.type != "") {
      this.setState({ type: "a" });
      this.setState({ isLoaded: true });
    } else if (event.currentTarget.id != "all") {
      this.setState({ type: event.currentTarget.id });
      this.setState({ isLoaded: true });
    } else {
      this.setState({ isLoaded: true });
    }
  };

  styleValueSelected = (event) => {
    // this.props.selected({ style: event.currentTarget.id });
    event.preventDefault();
    if (event.currentTarget.id == "all" && this.state.style != "") {
      this.setState({ style: "a" });
      this.setState({ isLoaded: true });
    } else if (event.currentTarget.id != "all") {
      this.setState({ style: event.currentTarget.id });
      this.setState({ isLoaded: true });
    } else {
      this.setState({ isLoaded: true });
    }
  };

  dimensionValueSelected = (event) => {
    // this.props.selected({ dimension: event.currentTarget.id });
    event.preventDefault();
    if (event.currentTarget.id == "all" && this.state.dimension != "") {
      this.setState({ dimension: "a" });
      this.setState({ isLoaded: true });
    } else if (event.currentTarget.id != "all") {
      this.setState({ dimension: event.currentTarget.id });
      this.setState({ isLoaded: true });
    } else {
      this.setState({ isLoaded: true });
    }
  };

  setParentProp = () => {
    this.props.selected(this.state);
  };

  render() {
    const pathname = window.location.pathname;
    if (this.state.isLoaded) {
      this.setParentProp();
      this.setState({ isLoaded: false });
    }
    if (this.id == null) {
      return (
        <section className="stripe flex-row-c">
          <button className="dropdown-btn arrow txt-grey signup-trigger">
            Type
            <div className="arrow"></div>
          </button>
          <button className="dropdown-btn arrow txt-grey signup-trigger">
            Style
            <div className="arrow"></div>
          </button>
          <button className="dropdown-btn arrow txt-grey signup-trigger">
            Dimensions
            <div className="arrow"></div>
          </button>
        </section>
      );
    } else {
      return (
        <section className="stripe flex-row-c">
          <div className="js-dropdown" id="filter_type">
            <div id="fltr-type" className="js-dropdown-current">
              Type
            </div>
            <div className="dropdown bl">
              <ul>
                <li
                  className="dropdown-item"
                  data-dropdown-value="all"
                  id="all"
                  onClick={this.typeValueSelected}
                >
                  <p>All</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="painting"
                  id="painting"
                  onClick={this.typeValueSelected}
                >
                  <p>Painting</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="sculpture"
                  id="sculpture"
                  onClick={this.typeValueSelected}
                >
                  <p>Sculpture</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="mixed"
                  id="mixed media"
                  onClick={this.typeValueSelected}
                >
                  <p>Mixed</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="digital"
                  id="digital"
                  onClick={this.typeValueSelected}
                >
                  <p>Digital</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="js-dropdown">
            <div id="fltr-type" className="js-dropdown-current">
              Style
            </div>
            <div className="dropdown bl">
              <ul>
                <li
                  className="dropdown-item"
                  data-dropdown-value="all"
                  id="all"
                  onClick={this.styleValueSelected}
                >
                  <p>All</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="abstract"
                  id="abstract"
                  onClick={this.styleValueSelected}
                >
                  <p>Abstract</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="b-w"
                  id="b-w"
                  onClick={this.styleValueSelected}
                >
                  <p>Black & White</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="collage"
                  id="collage"
                  onClick={this.styleValueSelected}
                >
                  <p>Collage</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="figurative"
                  id="figurative"
                  onClick={this.styleValueSelected}
                >
                  <p>Figurative Art</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="geomatric"
                  id="geomatric"
                  onClick={this.styleValueSelected}
                >
                  <p>Geometric</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="impression"
                  id="impression"
                  onClick={this.styleValueSelected}
                >
                  <p>Impressionistic</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="js-dropdown">
            <div id="fltr-type" className="js-dropdown-current">
              Dimensions
            </div>
            <div className="dropdown bl">
              <ul>
                <li
                  className="dropdown-item"
                  data-dropdown-value="all"
                  onClick={this.dimensionValueSelected}
                  id="all"
                >
                  <p>All</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="small"
                  onClick={this.dimensionValueSelected}
                  id="small"
                >
                  <div className="w-70 txt-align-c">
                    <Image
                      src="../images/icons/frame-s.svg"
                      className="mr-10"
                    />
                  </div>
                  <p>Less than 20 (in)</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="medium"
                  onClick={this.dimensionValueSelected}
                  id="medium"
                >
                  <div className="w-70 txt-align-c">
                    <Image
                      src="../images/icons/frame-m.svg"
                      className="mr-10"
                    />
                  </div>
                  <p>Up to 60 (in)</p>
                </li>
                <li
                  className="dropdown-item"
                  data-dropdown-value="large"
                  onClick={this.dimensionValueSelected}
                  id="large"
                >
                  <div className="w-70 txt-align-c">
                    <Image
                      src="../images/icons/frame-l.svg"
                      className="mr-10"
                    />
                  </div>
                  <p>More than 60 (in)</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      );
    }
  }
}

export default DropDown;
