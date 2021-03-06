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
import Notifications from './components/Notifications';
import Admin from './Admin';
import PasswordReset from './components/PasswordReset';

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
      notifications:'',
      approved:false,      
      isLoaded:false,
      suggestArray:[]
    };
    if (this.id != null) {
      this.getDetails();
      // setInterval(() => {
      //   this.getNotifications();
      // }, 5000);      
      // this.getNotifications();
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

  // getNotifications = () => {
  //   fetch('http://localhost:4000/getNotifications',{
  //     method:'POST',
  //     headers:{
  //       "Content-Type": "application/json",
  //     },
  //     body:JSON.stringify({userId:this.id})
  //   }).then((data)=>{
  //     data.json().then((notifications)=>{
  //       if(this.state.notifications.length < notifications.length){
  //         this.setState({notifications:notifications});
  //         this.setState({isLoaded:true});
  //       }        
  //       console.log(notifications);
  //     });
  //   });
  // }

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
        // console.log(data);
        data.forEach((element) => {          
          this.suggestArray.push(element);
        });
      });
    });
    // console.log(this.suggestArray);
  };
  render() {
    console.log('IsApproved:',this.state.approved);
    let menuItem;
    // let notifications = [];
    // if(this.state.isLoaded){
    //   this.state.notifications.forEach((notification)=>{
    //     if(notification.notificationType == 'like'){
    //       notifications.push(          
    //         <li>
    //           <a href="#">
    //             <span className="icon heart-highlighted mr-12"></span>
    //             <p className="m-0">
    //               <strong>{notification.user[0].name}</strong> liked your post
    //             </p>
    //           </a>
    //         </li>
    //       );   
    //     }        
    //   });
    // }
    if (this.id != null) {
      menuItem = (
        <ul style={{width:this.state.approved ? "" : "200px"}}>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li style={{display:this.state.approved ? "" : "none"}}>
            <Link to="/youfor"            
            >For you</Link>
          </li>
          {this.userType === "user2" ? (
            ""
          ) : (
            <li style={{display:this.state.approved ? "" : "none"}}>
              <Link to="/upload">
                <span className="icon upload"></span>
              </Link>
            </li>
          )}
          <li style={{display:this.state.approved ? "" : "none"}}>
            <Nav.Link href="/messaging">
              <span className="icon message"></span>
            </Nav.Link>
          </li>
          <li id="notifications-list" className="dropdown-element">
            <Nav.Link href="#">
              <span className="icon bell"></span>
              <Notifications/>
              {/* <div className="dropdown">
                <ul>
                {notifications}
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
              </div> */}
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
    if(location.pathname != '/admin'){
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
              <IndexHome approved={this.state.approved}/>
            </Route>
            <Route path="/home" component={() => <HomeContent name={this.state.name} profilePic={this.state.profilePic} approved={this.state.approved}/>}>
            </Route>
            <Route path="/youfor" component={() => <ForYou approved={this.state.approved} name={this.state.name} profilePic={this.state.profilePic} />} />
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
              component={() => <ArtUpload name={this.state.name}  approved={this.state.approved}/>}
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
            <Route 
              path='/admin'
              component = {()=> <Admin/>}
            />
            <Route exact path="/messaging/:id" render={UserMessages} />
            <Route path="/:id" component={UserProfile} />          
          </Switch>
        </BrowserRouter>
      );
    }
    else{
      return (
      <BrowserRouter>        
        <Switch>
          <Route path="/" exact>
            <IndexHome />
          </Route>
          <Route
            path='/forgotpassword'
            component = {() => <PasswordReset/>}
          ></Route>
          <Route path="/home" component={() => <HomeContent name={this.state.name} profilePic={this.state.profilePic}/>}>
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
          <Route 
            path='/admin'
            component = {()=> <Admin/>}
          />          
          <Route exact path="/messaging/:id" render={UserMessages} />
          <Route path="/:id" component={() => <UserProfile approved={this.state.approved}/>} />          
        </Switch>
      </BrowserRouter>
    );
    }    
  }
}

export default MenuBar;
