import React, { Component, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  BrowserRouter,
} from "react-router-dom";
import ForYou from "./forYou";
import HomeContent from "./HomeContent";
import IndexHome from "./IndexHome";
import Profile from "./components/profile";
import ArtUpload from "./components/ArtUpload";
import EditProfileUser from "./EditProfileUser";
import Messages from "./Messages";
import AutoComplete from "./components/AutoComplete";
import UserProfile from "./components/UserProfile";
import AccountSettings from "./components/AccountSettings";
import UserMessages from "./components/UserMessages";

class MenuBar extends Component {
  id = localStorage.getItem("id");
  userType = localStorage.getItem("userType");
  suggestArray = [];
  counter = 0;
  constructor(props) {
    super(props);
    this.state = {
      userId: this.id,
      name: "",
      title: "",
      location: "",
      websiteUrl: "",
      bio: "",
      behanceUrl: "",
      dribbleUsername: "",
      mediumUrl: "",
      twitterUsername: "",
      profilePic: "",
      coverPic: "",
    };
    if (this.id != null) {
      this.getDetails();
    }
    if (this.counter == 0) {
      this.getSuggestions();
      this.counter = 1;
    }
  }
  getDetails = (event) => {
    fetch("http://localhost:4000/getUserDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: localStorage.getItem("id") }),
    }).then((data) => {
      data.json().then((finalData) => {
        // console.log(finalData);
        if (finalData.length == 0) {
          this.submitHandler();
        } else {
          finalData.forEach((element) => {
            this.setState(element);
          });
        }
      });
    });
  };

  submitHandler = (event) => {
    if (typeof event != "undefined") {
      event.preventDefault();
    }
    //this.setState({ userId: this.id });
    fetch("http://localhost:4000/userDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then((data) => {
      // console.log(data);
      data.then((finalData) => {
        // console.log(finalData);
        location.reload();
      });
    });
  };

  logout = (event) => {
    localStorage.removeItem("id");
    localStorage.removeItem("userType");
    window.location.replace("/");
  };

  getSuggestions = () => {
    //suggestArray = ["Apple", "Mango", "Pomgranate", "Olay"];
    fetch("http://localhost:4000/getArtists").then((res) => {
      res.json().then((data) => {
        data.forEach((element) => {
          this.suggestArray.push(element);
        });
      });
    });
    // console.log(this.suggestArray);
  };
  render() {
    let menuItem;
    if (this.id != null) {
      menuItem = (
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/youfor">For you</Link>
          </li>
          {this.userType === "user2" ? (
            ""
          ) : (
            <li>
              <Link to="/upload">
                <span className="icon upload"></span>
              </Link>
            </li>
          )}
          <li>
            <Nav.Link href="/messaging">
              <span className="icon message"></span>
            </Nav.Link>
          </li>
          <li id="notifications-list" className="dropdown-element">
            <Nav.Link href="#">
              <span className="icon bell"></span>
              <div className="dropdown">
                <ul>
                  <li>
                    <a href="#">
                      <span className="icon heart-highlighted mr-12"></span>
                      <p className="m-0">
                        <strong>Davey Eaton</strong> liked your post
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon message-highlighted mr-12"></span>
                      <p className="m-0">
                        <strong>Tommy Herrera</strong> sent you a message
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon dot mr-12"></span>
                      <p className="m-0">
                        <strong>Joan Cox</strong> followed you
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon dot mr-12"></span>
                      <p className="m-0">
                        <strong>Royce Harris</strong> added new artwork
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon dot mr-12"></span>
                      <p className="m-0">
                        <strong>Britany Stott</strong> followed you
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon heart-highlighted mr-12"></span>
                      <p className="m-0">11 people liked your post</p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon dot mr-12"></span>
                      <p className="m-0">
                        <strong>Davey Eaton</strong> followed you
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon heart-highlighted mr-12"></span>
                      <p className="m-0">
                        <strong>Davey Eaton</strong> liked your post
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon message-highlighted mr-12"></span>
                      <p className="m-0">
                        <strong>Tommy Herrera</strong> sent you a message
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon dot mr-12"></span>
                      <p className="m-0">
                        <strong>Joan Cox</strong> followed you
                      </p>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon dot mr-12"></span>
                      <p className="m-0">
                        <strong>Royce Harris</strong> added new artwork
                      </p>
                    </a>
                  </li>
                </ul>
              </div>
            </Nav.Link>
          </li>
          <li className="dropdown-element" id="profile_list">
            <Nav.Link href="#">
              <Image
                src={
                  this.state.profilePic
                    ? "." + this.state.profilePic
                    : "../images/avatar_default.png"
                }
                className="avatar"
              />
              {/* <div style={{backgroundImage:this.state.profilePic}} className="w-auto avatar" /></div> */}
              <div className="dropdown bl">
                <ul>
                  <li>
                    <Link to="/profile">
                      <strong>{this.state.name}</strong>
                    </Link>
                  </li>
                  <li>
                    <Link to="/editProfile">Edit profile</Link>
                  </li>
                  <li className="divider" tabIndex="-1"></li>
                  <li>
                    <Link to="/accsettings">Account Settings</Link>
                  </li>
                  <li>
                    <a onClick={this.logout}>Log out</a>
                  </li>
                </ul>
              </div>
            </Nav.Link>
          </li>
        </ul>
      );
    } else {
      menuItem = (
        <ul className="w-260">
          <li>
            <Button id="login-btn" className="link-btn">
              Log In
            </Button>
          </li>
          <li>
            <Button id="signup-btn" className="purple-grad">
              Sign Up
            </Button>
          </li>
        </ul>
      );
    }
    return (
      <BrowserRouter>
        <Navbar>
          <div>
            <Link to="/">
              <div
                id="logo"
                className="logo d-flex align-items-center justify-content-center"
              >
                <Image src="../images/regestra_logo-1.svg" className="w-auto" />
              </div>
            </Link>
            <AutoComplete
              suggestions={
                typeof this.suggestArray == "undefined" ? "" : this.suggestArray
              }
            />
          </div>
          {menuItem}
        </Navbar>

        <Switch>
          <Route path="/" exact>
            <IndexHome />
          </Route>
          <Route path="/home" exact>
            <HomeContent />
          </Route>
          <Route path="/youfor" component={() => <ForYou />} />
          {/*  */}
          <Route
            path="/profile"
            component={() => (
              <Profile
                name={this.state.name}
                title={this.state.title}
                location={this.state.location}
                websiteUrl={this.state.websiteUrl}
                bio={this.state.bio}
                behanceUrl={this.state.behanceUrl}
                dribbleUsername={this.state.dribbleUsername}
                mediumUrl={this.state.mediumUrl}
                twitterUsername={this.state.twitterUsername}
                profilePic={this.state.profilePic}
                coverPic={this.state.coverPic}
              />
            )}
          />
          <Route
            path="/accsettings"
            component={() => <AccountSettings title={this.state.title} />}
          />
          <Route
            path="/upload"
            component={() => <ArtUpload name={this.state.name} />}
          />
          <Route
            path="/editProfile"
            component={() => (
              <EditProfileUser
                name={this.state.name}
                title={this.state.title}
                location={this.state.location}
                websiteUrl={this.state.websiteUrl}
                bio={this.state.bio}
                behanceUrl={this.state.behanceUrl}
                dribbleUsername={this.state.dribbleUsername}
                mediumUrl={this.state.mediumUrl}
                twitterUsername={this.state.twitterUsername}
                profilePic={this.state.profilePic}
                coverPic={this.state.coverPic}
              />
            )}
          />
          <Route
            path="/messaging"
            component={() => <Messages data={this.state} />}
          />
          <Route exact path="/messaging/:id" render={UserMessages} />
          <Route path="/:id" component={UserProfile} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default MenuBar;
