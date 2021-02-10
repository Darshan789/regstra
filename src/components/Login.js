import React, { Component } from "react";
import md5 from "md5";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam == "password") {
      this.setState({ [nam]: md5(val) });
    } else {
      this.setState({ [nam]: val });
    }
  };

  login = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then((data) => {
      data.json().then((finalData) => {
        if (finalData.length >= 1) {
          this.getUserId();
        }
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
        if (localStorage.getItem("userType") != undefined) {
          location.replace("/editprofile");
        }
      });
    });
  };

  render() {
    return (
      <div id="login" className="overlay hide">
        <div className="modal d-block">
          <div className="modal-head">
            <div className="logo-white"></div>
            <p className="modal-tagline">
              CREATING AN ART MARKET YOU CAN TRUST
            </p>
            <div className="main-illustration"></div>
          </div>
          <div className="modal-body">
            <form onSubmit={this.login}>
              <input
                className="block"
                onChange={this.myChangeHandler}
                name="email"
                type="text"
                placeholder="Email"
              />
              <input
                className="block"
                onChange={this.myChangeHandler}
                name="password"
                type="password"
                placeholder="Password"
              />
              <button className="button purple-grad block" type="submit">
                Log in
              </button>
            </form>
          </div>
          <div className="close"></div>
        </div>
      </div>
    );
  }
}

export default Login;
