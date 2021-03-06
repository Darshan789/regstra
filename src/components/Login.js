import React, { Component } from "react";
import md5 from "md5";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import PasswordReset from './PasswordReset';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      visible:false
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

  setVisible = () => {
    this.setState({visible:true});
  }

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
          location.replace("/profile");
        }
      });
    });
  };


  backToLogin = (event) => {
    this.setState({visible:false});
  }

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
          <div className="modal-body" style={{display:this.state.visible ? 'none':''}}>
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
            <span style={{cursor:'pointer'}} onClick={this.setVisible}>Forgot Password?</span>                         
          </div>
          <div className="modal-body normal-login" style={{display:this.state.visible ? '':'none'}}>
            <PasswordReset/>
            <button className="link-btn" style={{cursor:'pointer'}} onClick={this.backToLogin}>Back</button>
          </div>
          <div className="close" onClick={this.backToLogin}></div>
        </div>
      </div>
    );
  }
}

export default Login;
