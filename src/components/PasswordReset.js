import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import md5 from "md5";
import Loader from '/src/components/Loader';
import Alert from 'react-bootstrap/Alert';

class PasswordReset extends Component{
    id;
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            otp:'',
            verifyOtp:'',
            verificationStage:false,
            verified:false,
            loader:false,
            alertHtml:''
        }
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

    checkEmail = (event) => {
        event.preventDefault();
        fetch("http://localhost:4000/emailCheck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.state.email}),
            }).then((data) => {
            data.json().then((finalData) => {
                if (finalData.error == "User not found") {
                    this.setState({alertHtml:[<Alert style={{width: '400px'}} variant="danger" onClose={() => this.setState({alertHtml:''})} dismissible>
                        <Alert.Heading>Email Not Found.</Alert.Heading>
                    </Alert>]});
                } else {
                    console.log('User Found');
                    this.id=finalData.id;
                    this.sendOtp();
                }
            });
        });
    }

    sendOtp = () => {
        this.setState({loader:true});
        this.setState({loader:true});
        var digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 6; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        } 
        this.setState({otp:OTP});
        fetch("http://localhost:4000/sendOtp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.state.email,otp:OTP}),
            }).then((data) => {
            data.json().then((finalData) => {
                this.setState({loader:false});
                this.setState({verificationStage:true});                
                console.log(finalData);
            });
        });
    }

    checkOtp = (event) => {
        event.preventDefault();
        if(this.state.otp == this.state.verifyOtp){
            this.setState({verified:true});
        }
    }

    changePass = (event) => {
        event.preventDefault();
        if(typeof this.state.otp != 'undefined' && typeof this.state.verifyOtp != 'undefined' && 
         this.state.verified){
             fetch('http://localhost:4000/updateAdminDetails',{
                method:'PUT',
                headers: {
                "Content-Type": "application/json",
                },
                body:JSON.stringify({
                _id:this.id,
                oldemail:this.state.email,            
                password:this.state.password
                })
            }).then(data=>{
                data.json().then(finalData => {          
                location.reload();
                });
            });
         }        
    }

    render(){
        return (<React.Fragment>
        <main>
            {this.state.alertHtml ? this.state.alertHtml : ''}
            <form onSubmit={this.checkEmail} style={{
                display:this.state.verificationStage || this.state.verified || this.state.loader ? 'none': ''}}>
                <span className="block text-align-left"><b>Please Enter your Email</b></span>
                <input
                className="block"
                onChange={this.myChangeHandler}
                name="email"
                type="text"
                placeholder="Email"
              />
              <button className="button purple-grad block" type="submit">Send Verification</button>
            </form>
            <div style={{display:this.state.loader?'':'none',width: '400px',height:'100px',background:'transparent'}}>
             <Loader/>           
             </div>             
            <form onSubmit={this.checkOtp} style=
            {{display:this.state.verificationStage && !(this.state.verified) ? '': 'none'}}>
                <span className="block text-align-left"><b>Enter OTP sent on your Email</b></span>
                <input
                className="block"
                onChange={this.myChangeHandler}
                name="verifyOtp"
                type="text"
                placeholder="Enter OTP"
              />
              <button className="button purple-grad block" type="submit">Verify OTP</button>
            </form>
            <form onSubmit={this.changePass} style={{display:this.state.verified ? '': 'none'}}>
            <span className="block text-align-left"><b>Enter New Password</b></span>
                <input
                className="block"
                onChange={this.myChangeHandler}
                name="password"
                type="password"
                placeholder="New Password"
              />
              <button className="button purple-grad block" type="submit">Change</button>
            </form>
        </main>
        </React.Fragment>);
    }
}

export default PasswordReset;