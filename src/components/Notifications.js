import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

class Notifications extends Component {
    id = localStorage.getItem("id");
    constructor(props){
        super(props);
        this.state = {
            isLoaded:false,
            notifications:[],
        }
        if(this.id != null){
            setInterval(() => {
                this.getNotifications();
            }, 5000);
        }
    }

    // componentDidMount(){
    //     $('#notifications-list').hover(function(){
    //         $()
    //     });
    // }

    getNotifications = () => {
        fetch('http://localhost:4000/getNotifications',{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({userId:this.id})
        }).then((data)=>{
            data.json().then((notifications)=>{
                if(this.state.notifications.length != notifications.length){
                this.setState({notifications:notifications});
                this.setState({isLoaded:true});
                }        
            });
        });
    }

    deleteNotification = (event) => {
        event.preventDefault();        
        fetch('http://localhost:4000/deleteNotification',{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({id:event.target.id})
        }).then((data)=>{
            data.json().then((res)=>{
                this.getNotifications();               
            });
        });
    }

    render(){
        let notifications = [];
        if(this.state.isLoaded){
            this.state.notifications.forEach((notification)=>{                
                if(notification.notificationType == 'like'){
                    notifications.push(          
                        <li>
                        <a href="#">
                            <span className="icon heart-highlighted mr-12"></span>
                            <p className="m-0" id={notification._id} onClick={this.deleteNotification}>
                            <strong>{notification.user[0].name}</strong> liked your post
                            </p>
                        </a>
                        </li>
                    );   
                }

                if(notification.notificationType == "follow"){
                    notifications.push(
                        <li>
                            <a href="#">
                            <span className="icon dot mr-12"></span>
                            <p className="m-0" id={notification._id} onClick={this.deleteNotification}>
                                <strong>{notification.user[0].name}</strong> followed you
                            </p>
                            </a>
                        </li>
                    );
                }
                if(notification.notificationType == "msg"){
                    notifications.push(
                        <li>
                            <a href="#">
                                <span className="icon message-highlighted mr-12"></span>
                                <p className="m-0" id={notification._id} onClick={this.deleteNotification}>
                                <strong>{notification.user[0].name}</strong> sent you a message
                                </p>
                            </a>
                        </li>
                    );
                }                
            });
        }
        return (                                            
            <div className="dropdown">
                <ul>
                    {notifications}
                </ul>
            </div>
        );
    }
}

export default Notifications;