import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  BrowserRouter,
} from "react-router-dom";
import ArtGrid from "./components/ArtGrid";
import DropDown from "./components/DropDown";
import SocialBar from "./components/SocialBar";

class forYou extends Component {
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
    // this.setState({ selectedValue: selectedDropdown });
    // console.log(selectedDropdown);
  };

  render() {
    if (this.state.isLoaded) {
      return (      
      <React.Fragment>
        <main>
          <DropDown selected={this.dropDownChanged}/>
          <section className="art-grid">
            <div id="columns" className="p-0">
              <ArtGrid filter={this.state.selectedValue}/>
            </div>
          </section>
          <SocialBar />
        </main>
      </React.Fragment>
    );
    }
    else{
      return (      
      <React.Fragment>
        <main>
          <DropDown selected={this.dropDownChanged}/>
          <section className="art-grid">
            <div id="columns" className="p-0">
              <ArtGrid />
            </div>
          </section>
          <SocialBar />
        </main>
      </React.Fragment>
    );
    }    
  }
}

export default forYou;
