import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import md5 from "md5";
import { Redirect } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      email: "",
      password: "",
    };
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/emailCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email }),
    }).then((data) => {
      data.json().then((finalData) => {
        if (finalData.error == "User not found") {
          this.signUp();
        } else {
          alert("user exist");
        }
      });
    });
  };

  signUp = () => {    
    fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then((data) => {
      data.json().then((finalData) => {
        console.log(finalData);
        this.getUserId();
      });
    });    
  };

  getUserId = () => {
    fetch("http://localhost:4000/userid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email }),
    }).then((data) => {
      data.json().then((finalData) => {
        console.log(finalData);
        localStorage.setItem("id", finalData.id);
        localStorage.setItem("userType", finalData.userType);
        if (localStorage.getItem("id") != undefined) {
          location.replace("/editprofile");
        }
      });
    });
  };
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam == "password") {
      this.setState({ [nam]: md5(val) });
    } else {
      this.setState({ [nam]: val });
    }
  };
  render() {
    return (
      <div id="signup" className="overlay hide">
        <div className="modal d-block">
          <div className="modal-head">
            <div className="logo-white"></div>
            <p className="modal-tagline">
              CREATING AN ART MARKET YOU CAN TRUST
            </p>
            <div className="main-illustration"></div>
          </div>
          <div className="modal-body">
            <form onSubmit={this.mySubmitHandler}>
              <input
                className="block"
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.myChangeHandler}
              />
              <input
                className="block"
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.myChangeHandler}
              />
              <div className="block">
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  label="Artist"
                  name="type"
                  id="artist"
                  value="user1"
                  onChange={this.myChangeHandler}
                  inline
                />
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  label="Art Lover"
                  name="type"
                  id="user"
                  value="user2"
                  onChange={this.myChangeHandler}
                  inline
                />
              </div>
              <button className="button purple-grad block" type="submit">
                Create Account
              </button>
              <p className="m-0">
                Already a member?{" "}
                <span className="link login-trigger">Log in</span>
              </p>
            </form>
          </div>
          <div className="close"></div>
        </div>
      </div>
    );
  }
}

export default Signup;
