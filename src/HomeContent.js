import React, { Component } from "react";
import DropDown from "./components/DropDown";
import ArtGrid from "./components/ArtGrid";
import SocialBar from "./components/SocialBar";

class HomeContent extends Component {
  id = localStorage.getItem('id');
  constructor(props) {    
    super(props);
    this.state = {
      selectedValue: "",
      isLoaded: false,
      userName : props.name,
      id:this.id,
      profilePic:props.profilePic,
      approved :props.approved
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
  };
  render() {
    if (this.state.isLoaded) {      
      return (
        <React.Fragment>
          <main>
            <DropDown selected={this.dropDownChanged} />
            <section className="art-grid">
              <div id="columns" className="p-0">
                <ArtGrid filter={this.state.selectedValue} approved={this.state.approved} id={this.state.id}/>
              </div>
            </section>
            <SocialBar name={this.state.userName} approved={this.state.approved} profilePic={this.state.profilePic}/>
          </main>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <main>
            <DropDown selected={this.dropDownChanged} />
            <section className="art-grid">
              <div id="columns" className="p-0">
                <ArtGrid approved={this.state.approved} id={this.state.id}/>
              </div>
            </section>
            <SocialBar name={this.state.userName} approved={this.state.approved} profilePic={this.state.profilePic}/>
          </main>
        </React.Fragment>
      );
    }
  }
}

export default HomeContent;
