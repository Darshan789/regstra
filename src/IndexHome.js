import React, { Component } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DropDown from "./components/DropDown";
import ArtGrid from "./components/ArtGrid";
import Slider from "./components/Slider";

class IndexHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: "",
      isLoaded: false,
    };
  }
  dropDownChanged = (selectedDropdown) => {
    if (selectedDropdown.type) {
      this.setState({ selectedValue: selectedDropdown });
      this.setState({ isLoaded: true });
    }
    if (selectedDropdown.style) {
      this.setState({ selectedValue: selectedDropdown });
      this.setState({ isLoaded: true });
    }
    if (selectedDropdown.dimension) {
      this.setState({ selectedValue: selectedDropdown });
      this.setState({ isLoaded: true });
    }
  };
  render() {
    if (this.state.isLoaded) {
      return (
        <React.Fragment>
          <Signup />
          <Login />
          <main>
            <Slider />
            <DropDown selected={this.dropDownChanged} />
            <section className="art-grid">
              <div id="columns" className="p-0">
                <ArtGrid filter={this.state.selectedValue} />
              </div>
            </section>
          </main>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Signup />
          <Login />
          <main>
            <Slider />
            <DropDown selected={this.dropDownChanged} />
            <section className="art-grid">
              <div id="columns" className="p-0">
                <ArtGrid />
              </div>
            </section>
          </main>
        </React.Fragment>
      );
    }
  }
}

export default IndexHome;
