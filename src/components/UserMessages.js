import React from "react";
import { Component } from "react";
import Loader from "./Loader";
import Image from "react-bootstrap/Image";
import Link from "react-router-dom";
import Alert from "react-bootstrap/Alert";

class UserMessages extends Component {
  srt = "/messaging";
  slash = "/";
  msgCount = 0;
  gotId =
    location.pathname.replace(this.srt, "").search("/", "g") == 0
      ? location.pathname.replace(this.srt, "").replace("/", "")
      : location.pathname.replace(this.srt, "");
  id = localStorage.getItem("id");
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      users: [],
      msgId: this.gotId,
      message:'',
      noconvo: true,
      sentMsg: "",
      allData: [],
      msgWithData:[]  
    };
    this.checkMessage();        
    setInterval(() => {
      this.checkMessage();  
    }, 5000);

  }

  // UNSAFE_componentWillUpdate(){       
  //   $('#msgBox').click(function(){
  //     console.log('clicked');
  //   });
  //   var count = 0;     
  //   $("#msgBox").on('keypress',(function(event) { 
  //       if (event.keyCode === 13) { 
  //           $("#sendBtn").trigger('click'); 
  //           count++;
  //       } 
  //   })
  //   );
  // }

  // componentShouldUpdate(){
  //   console.log('HEllo');
  // }

  checkMessage = () =>{
    let userMessages = [];
    let users = [];
    let userDetails = [];
    fetch("http://localhost:4000/getAllMessages",{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({userId:this.id})
    }).then((res)=>{
      res.json().then((user)=>{
        // console.log(user[0].messageReceived.length + user[0].messageSent.length);
        if(this.msgCount < (user[0].messageReceived.length + user[0].messageSent.length)){                    
          this.msgCount = (user[0].messageReceived.length + user[0].messageSent.length);
          user[0].messageReceived.forEach(message => {            
            if(!users.includes(message.messagingFrom)){
              users.push(message.messagingFrom);              
            }          
          });
          user[0].messageSent.forEach(message => {
            if(!users.includes(message.messagingTo)){
              users.push(message.messagingTo);
            }            
          });
          if(!users.includes(this.state.msgId) && this.state.msgId != this.id){
              users.push(this.state.msgId);
          }
          this.setState({allData:user[0]});
          if(users.length >= 1){            
            users.forEach(user => {
                fetch("http://localhost:4000/getBulkUsers",{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({userId:user})
                }).then((res)=>{
                res.json().then((data)=>{
                  userDetails.push(data[0]);                  
                  this.setState({users:userDetails});                                    
                  if(this.state.msgId != this.id){
                    this.setState({noconvo:false});
                  }                
                  else{
                    this.setState({noconvo:true});
                  }
                  this.setState({isLoaded:true});
                  this.checkUnreadMsgs();
                });
              })
            });
            if(typeof this.state.allData.messageSent != 'undefined'){
              this.setState({msgWithData: this.state.allData.messageSent.concat(this.state.allData.messageReceived).sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))});
            }
          }
        } 
      })
    });
  }

  checkUnreadMsgs = () => {
    fetch("http://localhost:4000/changereadstatus",{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({userId:this.id,senderId:this.state.msgId})
    }).then((res)=>{
      res.json().then((data)=>{
        // console.log(data);        
      })
    });    
  };


  sendMessage = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    if(this.state.sentMsg){      
      fetch("http://localhost:4000/MessageUser", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messagingTo: this.state.msgId,
          messagingFrom: this.id,
          messages: this.state.sentMsg,
          time: timestamp,
          status:'unread'
        }),
      }).then((data) => {
        data.json().then((finalData) => {
            this.setState({isLoaded:true});
            document.getElementById('msgBox').value="";
            this.setState({sentMsg:''});
            this.checkMessage();
        });
      });      
    }             
  }

  selectUser = (event) =>{
    this.setState({msgId : event.target.id});    
  }


  timeToDate = (time) => {
    var date = new Date(time);
    return date.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute:'2-digit'
    });
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });  
  };  

  render() {
    let myArr = [];
    let myOutput = [];
    let MsgArr = [];                    
    const { users, isLoaded, error, msgId, noconvo, message, sentMsg, allData } = this.state;
    if (error) {
      myOutput.push(<div>Error: {error.message}</div>);
    } else if (!isLoaded) {
      myOutput.push(
        <React.Fragment>
          <Loader />
        </React.Fragment>
      );
    } else {
      users.forEach((user)=>{   
        if(typeof user != 'undefined'){
          myArr.push(
                  <li key={user.userId} id={user.userId} onClick={this.selectUser} className={user.userId == msgId ? "flex-row-sb highlighted" : "flex-row-sb"}>
                    <a id={user.userId} onClick={this.selectUser}>
                      <Image
                        src={"." + user.profilePic}
                        className="avatar mr-12"
                        id={user.userId} 
                        onClick={this.selectUser}
                      />
                    </a>
                    <div className="flex-col w-100pc" id={user.userId} onClick={this.selectUser}>
                      <div className="flex-row-sb w-100pc" id={user.userId} onClick={this.selectUser}>
                        <h4 className="m-0" id={user.userId} onClick={this.selectUser}>{user.name}</h4>
                        <time className="txt-grey" id={user.userId} onClick={this.selectUser}>{(user.lastSentMessage.length >= 1 ? user.lastSentMessage[0].time : 1) > (user.lastReceivedMessage.length >= 1 ? user.lastReceivedMessage[0].time : 1) ? (user.lastSentMessage.length >= 1 ? this.timeToDate(user.lastSentMessage[0].time) : '' ) : (user.lastReceivedMessage.length >= 1 ? this.timeToDate(user.lastReceivedMessage[0].time) : '' )}</time>
                      </div>
                      <p className="w-100pc m-0" id={user.userId} onClick={this.selectUser}>{(user.lastSentMessage.length >= 1 ? user.lastSentMessage[0].time : 1) > (user.lastReceivedMessage.length >= 1 ? user.lastReceivedMessage[0].time : 1) ? (user.lastSentMessage.length >= 1 ? user.lastSentMessage[0].messages : '' ) : (user.lastReceivedMessage.length >= 1 ? user.lastReceivedMessage[0].messages : '' )}</p>
                      {/* user.lastSentMessage[0].time > user.lastReceivedMessage[0].time ? user.lastSentMessage[0].messages : user.lastReceivedMessage[0].messages */}
                      {/* <p className="w-100pc m-0">{user.sent.slice(-1)[0] }</p> */}
                    </div>                  
                  </li>
            );
        }
        else{
          if(users.length >= 1 && typeof users[0] != 'undefined'){
            location.replace('messaging/'+users[0].userId);
          }
          else{            
            return;
          }
        }                                 
      }); 
      if (!noconvo) {
        // setInterval(() => {
        //     this.checkUnreadMsgs();
        // }, 2000);                   
        users.forEach(user => {
          if(user.userId == msgId){
              for (let i = this.state.msgWithData.length-1; i >=0 ; i--) {
              // console.log(this.state.msgWithData[i].time);                   
                  if(this.state.msgWithData[i].messagingTo == msgId){
                  MsgArr.push(
                  <div className="panel chat-box my-chat-box">
                    <p>
                      {this.state.msgWithData[i].messages}
                    </p>
                  </div>
                ) 
                }
                if(this.state.msgWithData[i].messagingFrom == msgId){
                    MsgArr.push(
                    <div class="chat-box-container">                    
                      <div>
                        <Image
                          src={"." + user.profilePic}
                          className="avatar mr-12"
                          id={user.userId} 
                          onClick={this.selectUser}
                        />
                      </div>
                      <div className="panel chat-box">                                       
                        <p>
                          {this.state.msgWithData[i].messages}
                        </p>
                      </div>
                    </div>
                  )
                }
            } 
          }              
        });          

        myOutput.push(
          <React.Fragment>
            <aside className="panel" id="conversations">
              <ul className={myArr.length >= 1 ?"txt-s m-0" : "txt-s m-0 d-flex align-items-center justify-content-center h-100"}>{myArr.length >= 1 ? myArr:<h3>No Conversation</h3>}</ul>
            </aside>
            <div id="chat-input" className="panel">
              <div className="flex-row-sb">
                <form onSubmit={this.sendMessage} method='POST' className="flex-row-sb" style={{margin:'0'}}>
                <input
                  type="text"
                  name="sentMsg"
                  placeholder="Type your message here"
                  className="block"
                  id="msgBox"
                  onChange={this.myChangeHandler}
                  style={{margin:'0'}}
                />
                <button type="submit" id="sendBtn"> Send</button>
                </form>
              </div>
            </div>
            <div id="chat-container" className="grid-fixed-auto">
              <section className={MsgArr.length >= 1 ? "flex-col-rev mt-20":"flex-col-rev mt-20 d-flex align-items-center"}> 
                {MsgArr.length >= 1 ? MsgArr:<h3>No Conversation</h3>}
              </section>
            </div>
          </React.Fragment>
        );        
      } else {
        myOutput.push(
          <React.Fragment>
            <aside className="panel" id="conversations">
              <ul className="txt-s m-0">{myArr}</ul>
            </aside>
            <div id="chat-input" className="panel">
              <div className="flex-row-sb">
                <input
                  type="text"
                  name="message"
                  placeholder="Type your message here"
                  className="block"
                />
              </div>
            </div>
            <div id="chat-container" className="grid-fixed-auto">
              <section className="flex-col-rev mt-20 d-flex align-items-center">
                <div className="panel w-75">
                  <h3>You can't Message yourself.</h3>
                </div>
              </section>
            </div>
          </React.Fragment>
        );
      }    
    }           

    // scrollH = document.querySelector('#chat-container').scrollHeight;
    return myOutput;
  }
}

export default UserMessages;
