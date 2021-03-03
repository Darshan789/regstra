import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import Loader from "./Loader";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Messages from "../Messages";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

class ArtGrid extends Component {  
  id;
  pathname = location.pathname;  
  constructor(props) {    
    super(props);    
    this.state = {
      error: null,
      id:props.id,
      isLoaded: false,
      items: [],
      isShuffle: false,
      show: false,
      isLoggedIn: false,      
      filters: {
        type:props.type, 
        style: props.style,
        dimension : props.dimension
      },
      isApproved: props.approved ? props.approved : false,
      loginAlert:'',
      show:false,
    };    
  }

  shuffleArray = () => {
    for (let i = this.state.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.items[i], this.state.items[j]] = [
        this.state.items[j],
        this.state.items[i],
      ];
    }
  };

  componentDidMount() {
    if (this.state.id) {      
      this.setState({ isLoggedIn: true });            
    } else {
      this.setState({ isLoggedIn: false });
    }
    if(this.pathname === '/'){
      fetch("http://localhost:4000/getUserDetails", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: this.state.id }),
      }).then((res) =>{
        res.json().then((result) => {
          this.setState({isApproved:result[0].approved}); 
          this.setState({ isLoaded: true });      
        });
      });
    }
    if (this.pathname === "/youfor") {
      let followingUserArr = [];
      let finalArr = [];
      fetch("http://localhost:4000/getUserDetails", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: this.state.id }),
      }).then((res) =>
        res.json().then((result) => {
          followingUserArr.push(result[0].following.split(","));
          followingUserArr.forEach((element) => {
            if (element !== "") {
              element.forEach((el) => {
                el = el.trim();
                if (el != "") {
                  fetch("http://localhost:4000/getPostsSingleArtist", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ userId: el }),
                  }).then((data) => {
                    data.json().then((finalData) => {
                      finalData.forEach((final) => finalArr.push(final));
                      this.setState({
                        isLoaded: true,
                        items: finalArr,
                        isShuffle: true,
                      });
                    });
                  });
                }
              });
            }
          });
        })
      );
    } else {
      fetch("http://localhost:4000/getAllPosts")
        .then((res) => res.json())
        .then(
          (result) => {
            // console.log(result);
            this.setState({
              isLoaded: true,
              items: result,
              isShuffle: true,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    }
  }

  followHandler = (event) => {
    if (this.state.id) {
      // console.log('ID');
      // console.log(this.state.id);
      if (this.state.id != event.target.id) {
        fetch("http://localhost:4000/getFollowCounts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: event.target.id }),
        }).then((res) =>
          res.json().then((result) => {             
            fetch("http://localhost:4000/getFollowCounts", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ userId: this.state.id }),
            }).then((data) =>
              data.json().then((finalData) => {
                var checkFollowedBy = new RegExp(this.state.id, "g");
                var checkFollowing = new RegExp(result[0].userId, "g");

                var isFollowedBy = result[0].followedBy.search(checkFollowedBy);
                var isFollowing = finalData[0].following.search(checkFollowing);

                if (
                  finalData[0].following.length != 0 &&
                  result[0].followedBy.length != 0
                ) {
                  let following = finalData[0].following.trim().split(",");
                  let followedBy = result[0].followedBy.trim().split(",");
                  if (isFollowing != -1 && isFollowedBy != -1) {
                    for (let i = 0; i <= following.length; i++) {
                      if (following[i] == result[0].userId) {
                        following.splice(i, i + 1);
                      }
                    }
                    for (let i = 0; i <= followedBy.length; i++) {
                      if (followedBy[i] == this.state.id) {
                        followedBy.splice(i, i + 1);
                      }
                    }
                    finalData[0].following = following.toString();
                    result[0].followedBy = followedBy.toString();
                    result[0].followers = --result[0].followers;
                  } else {
                    following.push(result[0].userId);
                    followedBy.push(this.state.id);
                    finalData[0].following = following.toString();
                    result[0].followedBy = followedBy.toString();
                    result[0].followers = ++result[0].followers;
                    this.pushNotifications(event, 'follow', result[0].userId);
                  }
                } else {
                  if (finalData[0].following.length == 0) {
                    finalData[0].following += result[0].userId;                    
                  } else {
                    finalData[0].following += "," + result[0].userId;                    
                  }
                  if (result[0].followedBy.length == 0) {
                    result[0].followedBy += this.state.id;
                    this.pushNotifications(event, 'follow', result[0].userId);
                  } else {
                    result[0].followedBy += "," + this.state.id;
                    this.pushNotifications(event, 'follow', result[0].userId);
                  }

                  result[0].followers = ++result[0].followers;
                }
                fetch("http://localhost:4000/followed", {
                  method: "PUT",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    userId: result[0].userId,
                    data: result[0],
                  }),
                }).then((output) =>
                  output.json().then((finalOutput) => {
                    fetch("http://localhost:4000/following", {
                      method: "PUT",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({
                        userId: this.state.id,
                        data: finalData[0],
                      }),
                    }).then((out) =>
                      out.json().then((finalOut) => {
                        if (this.pathname === "/youfor") {
                          let followingUserArr = [];
                          let finalArr = [];
                          fetch("http://localhost:4000/getUserDetails", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ userId: this.state.id }),
                          }).then((res) =>
                            res.json().then((result) => {
                              followingUserArr.push(
                                result[0].following.split(",")
                              );
                              followingUserArr.forEach((element) => {
                                if (element !== "") {
                                  element.forEach((el) => {
                                    el = el.trim();
                                    if (el != "") {
                                      fetch(
                                        "http://localhost:4000/getPostsSingleArtist",
                                        {
                                          method: "POST",
                                          headers: {
                                            "content-type": "application/json",
                                          },
                                          body: JSON.stringify({ userId: el }),
                                        }
                                      ).then((data) => {
                                        data.json().then((finalData) => {
                                          finalData.forEach((final) =>
                                            finalArr.push(final)
                                          );
                                          this.setState({
                                            isLoaded: true,
                                            items: finalArr,
                                            isShuffle: true,
                                          });
                                        });
                                      });
                                    }
                                  });
                                }
                              });
                            })
                          );
                        } else {
                          fetch("http://localhost:4000/getAllPosts")
                            .then((res) => res.json())
                            .then(
                              (result) => {
                                this.setState({
                                  isLoaded: true,
                                  items: result,
                                  isShuffle: true,
                                });
                              },
                              (error) => {
                                this.setState({
                                  isLoaded: true,
                                  error,
                                });
                              }
                            );
                        }
                      })
                    );
                  })
                );
              })
            );
          })
        );
      } else {
        this.setState({ show: true });
      }
    }
  };

  myLikeHandler = (event) => {    
    if (this.state.id) {
      fetch("http://localhost:4000/getLikeCounts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: event.target.id }),
      }).then((res) =>
        res.json().then((result) => {          
          let userIdfornoti = result[0].userId;
          let notType = 'like';
          var checkLike = new RegExp(this.state.id, "g");
          let isLiked = result[0].likedBy.search(checkLike);

          if (result[0].likedBy.length != 0) {
            var likes = result[0].likedBy.trim().split(",");
            if (isLiked != -1) {
              for (let i = 0; i <= likes.length; i++) {
                if (likes[i] == this.state.id) {
                  likes.splice(i, i + 1);
                }
              }
              result[0].likedBy = likes.toString();
              result[0].postLikes = --result[0].postLikes;
            } else {
              result[0].likedBy += "," + this.state.id;
              result[0].postLikes = ++result[0].postLikes;
              this.pushNotifications(event, notType, userIdfornoti);
            }
          } else {
            result[0].likedBy = this.state.id;
            result[0].postLikes = ++result[0].postLikes;
            this.pushNotifications(event, notType, userIdfornoti);
          }

          fetch("http://localhost:4000/likedPost", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ postId: result[0]._id, data: result[0] }),
          }).then((data) =>
            data.json().then((finalData) => {              
              if (this.pathname === "/youfor") {
                let followingUserArr = [];
                let finalArr = [];
                fetch("http://localhost:4000/getUserDetails", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ userId: this.state.id }),
                }).then((res) =>
                  res.json().then((result) => {
                    followingUserArr.push(result[0].following.split(","));
                    followingUserArr.forEach((element) => {
                      if (element !== "") {
                        element.forEach((el) => {
                          el = el.trim();
                          if (el != "") {
                            fetch(
                              "http://localhost:4000/getPostsSingleArtist",
                              {
                                method: "POST",
                                headers: { "content-type": "application/json" },
                                body: JSON.stringify({ userId: el }),
                              }
                            ).then((data) => {
                              data.json().then((finalData) => {
                                finalData.forEach((final) =>
                                  finalArr.push(final)
                                );                                
                                this.setState({
                                  isLoaded: true,
                                  items: finalArr,
                                  isShuffle: true,
                                });
                              });
                            });
                          }
                        });
                      }
                    });
                  })
                );
              } else {
                fetch("http://localhost:4000/getAllPosts")
                  .then((res) => res.json())
                  .then(
                    (result) => {
                      this.setState({
                        isLoaded: true,
                        items: result,
                        isShuffle: true,
                      });
                    },
                    (error) => {
                      this.setState({
                        isLoaded: true,
                        error,
                      });
                    }
                  );
              }
            })
          );
        })
      );
    }
  };

  pushNotifications = (event, notificationType, to) => {
    let postId = event.target.id;
    let from = this.state.id;
    let seen = false;
    fetch('http://localhost:4000/postNotification',{
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
         to:to,         
         from:from,
         postId:postId,
         notificationType:notificationType,
         seen:seen
         }),
    }).then((data)=>{
      data.json().then((finalData)=>{
        // console.log(finalData);
      })
    });
  }

  loginAlert = () => {
  //  this.setState({show:true}); 
  $('#signup-btn').trigger('click');
  //  this.setState({loginAlert:<Alert variant="warning" onClose={()=>this.setState({show:false})} dismissible>
  //     <Alert.Heading>Waiting For Admin's Approval.</Alert.Heading>
  //   </Alert>}); 
  }

  render() {    
    let outPutArr = [];
    outPutArr.push(<Button id="signup-btn" className="purple-grad" style={{display:'none'}}>
              Sign Up
            </Button>);
    const { error, isLoaded, items, isShuffle, show, isApproved } = this.state;
     let type,style,dimension;     
    if(this.props.filter){      
      type = this.props.filter.type;
      style = this.props.filter.style;
      dimension  = this.props.filter.dimension;
    }    
    if (error) {
      outPutArr.push(<div>Error: {error.message}</div>);
    } else if (!isLoaded) {
      outPutArr.push(
        <React.Fragment>
          <Loader />
        </React.Fragment>
      );
    } else {
      if (isShuffle) {
        this.shuffleArray();
      }
      if (this.pathname === "/youfor") {
        items.forEach((post) => {
          let imgArr = [];
          imgArr.push(<Image src={post.postImage} className="img-thumbnail" />);
        });
        items.forEach((post) => {
          var checkLike = new RegExp(this.state.id, "g");
          let isLiked = post.likedBy.search(checkLike);
          let className = "login-trigger icon heart";
          if(isLiked === -1){
            className = "icon heart";
          }else{
            className = "icon heart-highlighted anim-pump";
          }
          if(post.artPostType == 1 && post.publish == true){
            if (this.props.filter) {
              if((type == 'a' && style == 'a' && dimension == 'a') || 
                (type == 'a' && style == '' && dimension == '') ||
                (type == 'a' && style == 'a' && dimension == '') || 
                (type == 'a' && style == '' && dimension == 'a') ||
                (type == '' && style == 'a' && dimension == '') ||
                (type == '' && style == 'a' && dimension == 'a') ||
                (type == '' && style == '' && dimension == 'a') 
               ){
                outPutArr.push(                    
                    <div className="modal-wrapper" key={post._id.toString()}>
                      <figure className="painting abstract geometric large">
                        <Image
                          src={post.postImage ? post.postImage : <Loader />}
                          className={this.state.isLoggedIn ? "open-modal" : ""}
                          onClick = {this.state.isLoggedIn ? null : this.loginAlert}
                        />
                        <figcaption>
                          <div>
                            <span className="txt-grey">by </span>
                            <Link to={this.state.isLoggedIn ?`/${post.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                              {post.userName}
                            </Link>                            
                          </div>
                          <div className="relative"
                          style={{display:this.state.isApproved ? '' : 'none'}}>
                            <div
                              className={className}
                              id={post._id}
                              name="like"
                              
                              onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                            ></div>
                            <span className="hearts-number">{post.postLikes}</span>
                          </div>
                        </figcaption>
                      </figure>
                      <div className="overlay d-block hide">
                        <div className="modal panel d-block">
                          <div className="panel-head">
                            <div className="flex-row-sb w-100pc">
                              <div className="flex-row-sb">
                                <Image
                                  src={
                                    this.state.profilePic
                                      ? this.state.profilePic
                                      : "../images/avatar_default.png"
                                  }
                                  alt=""
                                  className="avatar"
                                />
                                <a href="joancox.html" className="no-decor">
                                  <div>
                                    <h3>{post.userName}</h3>
                                    <p>
                                      {this.state.title
                                        ? this.state.title
                                        : "Registra User"}
                                    </p>
                                  </div>
                                </a>
                                <div className="dropdown br">
                                  <div className="flex-row-sb mb-15">
                                    <div className="flex-row-sb">
                                      <Image
                                        src={
                                          this.state.profilePic
                                            ? this.state.profilePic
                                            : "../images/avatar_default.png"
                                        }
                                        alt=""
                                        className="avatar"
                                      />
                                      <div>
                                        <h3>{post.userName}</h3>
                                        <p>
                                          {this.state.title
                                            ? this.state.title
                                            : "Registra User"}
                                        </p>
                                      </div>
                                    </div>
                                    <button className="follow">
                                      <span>Follow</span>
                                    </button>
                                  </div>
                                  <div className="flex-row-sb"></div>
                                </div>
                              </div>
                              <div className="flex-row">
                                <div className="relative flex-row"
                                style={{display:this.state.isApproved ? '' : 'none'}}>
                                  <div
                                    className={className}
                                    id={post._id}
                                    name="like"
                                    
                                    onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                                  ></div>
                                  <span className="hearts-number">
                                    {post.postLikes}
                                  </span>
                                </div>
                                <Link to={this.state.isLoggedIn ?`/messaging/${post.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                    <div className="icon post ml-10"
                                    style={{display:this.state.isApproved ? '' : 'none'}}></div>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="panel-body grid-67-33 grid-100-below768">
                            <div>
                              <Image src={post.postImage} className="w-100pc" />
                            </div>
                            <div>
                              <h2 className="mt-0">"{post.postTitle}"</h2>
                              <div className="grid-33-67-below768 grid-100-below480">
                                <div className="mb-40 mb-0-below480">
                                  <p>{post.postType}</p>
                                  <p>
                                    {post.postLen} x {post.postWid} x{post.postHeight}{" "}
                                    in
                                  </p>
                                  {/* <p>121.9 x 182.9 x 3.8 cm</p> */}
                                </div>
                                <div className="mb-40 mb-20-below480">
                                  <h3>Description</h3>
                                  <p>{post.postDesc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="close d-block"></div>
                        </div>
                      </div>
                    </div>
                  );
              }
              else if (
                (type == post.postType.toLowerCase() && (style == ''||style == 'a') && 
                (dimension == '' || dimension == 'a')) ||
                (type == post.postType.toLowerCase() && style == post.postStyle.toLowerCase() 
                && (dimension == '' || dimension == 'a')) ||
                (type == post.postType.toLowerCase() && (style == ''||style == 'a') 
                && dimension == post.postDim) ||

                ((type == ''|| type == 'a') && style == post.postStyle.toLowerCase() && 
                (dimension == '' || dimension== 'a')) ||
                ((type == ''||type == 'a') && style == post.postStyle.toLowerCase() && dimension == post.postDim) ||

                ((type == ''||type == 'a') && (style == ''||style == 'a') && dimension == post.postDim) ||                  

                (this.props.filter.type == post.postType.toLowerCase() &&
                this.props.filter.style ==
                post.postStyle.toLowerCase() &&
                this.props.filter.dimension == post.postDim)
              ) {                                       
                  outPutArr.push(
                    <div className="modal-wrapper" key={post._id.toString()}>                    
                      <figure className="painting abstract geometric large">
                        <Image
                          src={post.postImage ? post.postImage : <Loader />}
                          className={this.state.isLoggedIn ? "open-modal" : ''}
                          onClick = {this.state.isLoggedIn ? null : this.loginAlert}
                        />
                        <figcaption>
                          <div>
                            <span className="txt-grey">by </span>
                            <Link to={this.state.isLoggedIn ?`/${post.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                              {post.userName}
                            </Link>
                          </div>
                          <div className="relative"
                          style={{display:this.state.isApproved ? '' : 'none'}}>
                            <div
                              className={className}
                              id={post._id}
                              name="like"
                              
                              onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                            ></div>
                            <span className="hearts-number">{post.postLikes}</span>
                          </div>
                        </figcaption>
                      </figure>
                      <div className="overlay d-block hide">
                        <div className="modal panel d-block">
                          <div className="panel-head">
                            <div className="flex-row-sb w-100pc">
                              <div className="flex-row-sb">
                                <Image
                                  src={
                                    this.state.profilePic
                                      ? this.state.profilePic
                                      : "../images/avatar_default.png"
                                  }
                                  alt=""
                                  className="avatar"
                                />
                                <a href="joancox.html" className="no-decor">
                                  <div>
                                    <h3>{post.userName}</h3>
                                    <p>
                                      {this.state.title
                                        ? this.state.title
                                        : "Registra User"}
                                    </p>
                                  </div>
                                </a>
                                <div className="dropdown br">
                                  <div className="flex-row-sb mb-15">
                                    <div className="flex-row-sb">
                                      <Image
                                        src={
                                          this.state.profilePic
                                            ? this.state.profilePic
                                            : "../images/avatar_default.png"
                                        }
                                        alt=""
                                        className="avatar"
                                      />
                                      <div>
                                        <h3>{post.userName}</h3>
                                        <p>
                                          {this.state.title
                                            ? this.state.title
                                            : "Registra User"}
                                        </p>
                                      </div>
                                    </div>
                                    <button className="follow">
                                      <span>Follow</span>
                                    </button>
                                  </div>
                                  <div className="flex-row-sb"></div>
                                </div>
                              </div>
                              <div className="flex-row">
                                <div className="relative flex-row"
                                style={{display:this.state.isApproved ? '' : 'none'}}>
                                  <div
                                    className={className}
                                    id={post._id}
                                    name="like"
                                    
                                    onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                                  ></div>
                                  <span className="hearts-number">
                                    {post.postLikes}
                                  </span>
                                </div>
                                <Link to={this.state.isLoggedIn ?`/messaging/${post.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                  <div className="icon post ml-10"
                                  style={{display:this.state.isApproved ? '' : 'none'}}></div>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="panel-body grid-67-33 grid-100-below768">
                            <div>
                              <Image src={post.postImage} className="w-100pc" />
                            </div>
                            <div>
                              <h2 className="mt-0">"{post.postTitle}"</h2>
                              <div className="grid-33-67-below768 grid-100-below480">
                                <div className="mb-40 mb-0-below480">
                                  <p>{post.postType}</p>
                                  <p>
                                    {post.postLen} x {post.postWid} x{post.postHeight}{" "}
                                    in
                                  </p>
                                  {/* <p>121.9 x 182.9 x 3.8 cm</p> */}
                                </div>
                                <div className="mb-40 mb-20-below480">
                                  <h3>Description</h3>
                                  <p>{post.postDesc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="close d-block"></div>
                        </div>
                      </div>
                    </div>
                  );
                }
            }
            else{
              outPutArr.push(
                    <div className="modal-wrapper" key={post._id.toString()}>
                      <figure className="painting abstract geometric large">
                        <Image
                          src={post.postImage ? post.postImage : <Loader />}
                          className={this.state.isLoggedIn ? "open-modal" : ''}
                          onClick = {this.state.isLoggedIn ? null : this.loginAlert}
                        />
                        <figcaption>
                          <div>
                            <span className="txt-grey">by </span>
                            <Link to={this.state.isLoggedIn ?`/${post.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                              {post.userName}
                            </Link>
                          </div>
                          <div className="relative"
                          style={{display:this.state.isApproved ? '' : 'none'}}>
                            <div
                              className={className}
                              id={post._id}
                              name="like"
                              
                              onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                            ></div>
                            <span className="hearts-number">{post.postLikes}</span>
                          </div>
                        </figcaption>
                      </figure>
                      <div className="overlay d-block hide">
                        <div className="modal panel d-block">
                          <div className="panel-head">
                            <div className="flex-row-sb w-100pc">
                              <div className="flex-row-sb">
                                <Image
                                  src={
                                    this.state.profilePic
                                      ? this.state.profilePic
                                      : "../images/avatar_default.png"
                                  }
                                  alt=""
                                  className="avatar"
                                />
                                <a href="joancox.html" className="no-decor">
                                  <div>
                                    <h3>{post.userName}</h3>
                                    <p>
                                      {this.state.title
                                        ? this.state.title
                                        : "Registra User"}
                                    </p>
                                  </div>
                                </a>
                                <div className="dropdown br">
                                  <div className="flex-row-sb mb-15">
                                    <div className="flex-row-sb">
                                      <Image
                                        src={
                                          this.state.profilePic
                                            ? this.state.profilePic
                                            : "../images/avatar_default.png"
                                        }
                                        alt=""
                                        className="avatar"
                                      />
                                      <div>
                                        <h3>{post.userName}</h3>
                                        <p>
                                          {this.state.title
                                            ? this.state.title
                                            : "Registra User"}
                                        </p>
                                      </div>
                                    </div>
                                    <button className="follow">
                                      <span>Follow</span>
                                    </button>
                                  </div>
                                  <div className="flex-row-sb"></div>
                                </div>
                              </div>
                              <div className="flex-row">
                                <div className="relative flex-row"
                                style={{display:this.state.isApproved ? '' : 'none'}}>
                                  <div
                                    className={className}
                                    id={post._id}
                                    name="like"
                                    
                                    onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                                  ></div>
                                  <span className="hearts-number">
                                    {post.postLikes}
                                  </span>
                                </div>
                                <Link to={this.state.isLoggedIn ?`/messaging/${post.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                    <div className="icon post ml-10"
                                    style={{display:this.state.isApproved ? '' : 'none'}}></div>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="panel-body grid-67-33 grid-100-below768">
                            <div>
                              <Image src={post.postImage} className="w-100pc" />
                            </div>
                            <div>
                              <h2 className="mt-0">"{post.postTitle}"</h2>
                              <div className="grid-33-67-below768 grid-100-below480">
                                <div className="mb-40 mb-0-below480">
                                  <p>{post.postType}</p>
                                  <p>
                                    {post.postLen} x {post.postWid} x{post.postHeight}{" "}
                                    in
                                  </p>
                                  {/* <p>121.9 x 182.9 x 3.8 cm</p> */}
                                </div>
                                <div className="mb-40 mb-20-below480">
                                  <h3>Description</h3>
                                  <p>{post.postDesc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="close d-block"></div>
                        </div>
                      </div>
                    </div>
                  );
            }
          }
        });
      } 
      else {        
        this.state.items.forEach((user) => {
          let imgsArr = [];
          if (user.postData.length > 0) {
            user.postData.forEach((post) => {
              if (imgsArr.length >= 4) {
                return;
              }
              imgsArr.push(
                <Image src={post.postImage} className="img-thumbnail" />
              );
            });
            user.postData.forEach((singlePost) => {
              if((singlePost.artPostType == 1 || singlePost.artPostType == "1") && singlePost.publish == true){
                var checkLike = new RegExp(this.state.id, "g");
                let isLiked = singlePost.likedBy.search(checkLike);
                let className = "login-trigger icon heart";
                if(isLiked === -1){
                  className = "icon heart";
                }else{
                  className = "icon heart-highlighted anim-pump";
                }
                var checkFollow = new RegExp(this.state.id, "g");
                let isFollowedBy = user.followedBy.search(checkFollow);                
                if (this.props.filter) {
                  if((type === 'a' && style === 'a' && dimension === 'a') ||
                    (type == 'a' && style == '' && dimension == '') ||
                    (type == 'a' && style == 'a' && dimension == '') || 
                    (type == 'a' && style == '' && dimension == 'a') ||
                    (type == '' && style == 'a' && dimension == '') ||
                    (type == '' && style == 'a' && dimension == 'a') ||
                    (type == '' && style == '' && dimension == 'a') 
                  ){

                    outPutArr.push(
                    <div className="modal-wrapper" key={singlePost._id}>
                      <figure className="painting abstract geometric large">
                        <Image
                          src={
                            singlePost.postImage ? (
                              singlePost.postImage
                            ) : (
                              <Loader />
                            )
                          }
                          className={this.state.isLoggedIn ? "open-modal" : ''}
                          onClick = {this.state.isLoggedIn ? null : this.loginAlert}
                        />
                        <figcaption>
                          {/* <p>{this.state.items}</p> */}
                          <div>
                            <span className="txt-grey">by </span>
                            <Link to={this.state.isLoggedIn ?`/${singlePost.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                              {singlePost.userName}
                            </Link>
                          </div>
                          <div className="relative"
                          style={{display:this.state.isApproved ? '' : 'none'}}>
                            <div
                              className={className}
                              id={singlePost._id}
                              name="like"
                              
                              onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                            ></div>
                            <span className="hearts-number">
                              {singlePost.postLikes}
                            </span>
                          </div>
                        </figcaption>
                      </figure>
                      <div className="overlay d-block hide">
                        {show ? (
                          <Alert
                            variant="warning"
                            onClose={() => this.setState({ show: false })}
                            dismissible
                          >
                            <Alert.Heading>
                              You Can't Follow Yourself
                            </Alert.Heading>
                          </Alert>
                        ) : (
                          ""
                        )}
                        <div className="modal panel d-block">
                          <div className="panel-head">
                            <div className="flex-row-sb w-100pc">
                              <div className="flex-row-sb dropdown-element">
                                <Image
                                  src={
                                    user.profilePic
                                      ? user.profilePic
                                      : "../images/avatar_default.png"
                                  }
                                  alt=""
                                  className="avatar"
                                />
                                <a href="joancox.html" className="no-decor">
                                  <div>
                                    <h3>{singlePost.userName}</h3>
                                    <p>
                                      {user.title ? user.title : "Registra User"}
                                    </p>
                                  </div>
                                </a>
                                <div className="dropdown br">
                                  <div className="flex-row-sb mb-15">
                                    <div className="flex-row-sb">
                                      <Image
                                        src={
                                          user.profilePic
                                            ? user.profilePic
                                            : "../images/avatar_default.png"
                                        }
                                        alt=""
                                        className="avatar"
                                      />
                                      <div>
                                        <h3>{singlePost.userName}</h3>
                                        <p>
                                          {user.title
                                            ? user.title
                                            : "Registra User"}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      id={user.userId}
                                      className="follow"
                                      onClick={this.followHandler }
                                      style={{display:this.state.isApproved ? '' : 'none'}}
                                    >
                                      <span 
                                      id={user.userId}
                                      onClick={this.followHandler }>
                                        {isFollowedBy === -1
                                          ? "Follow"
                                          : "Following"}
                                      </span>
                                      {/* {isFollowedBy === -1
                                          ? "Follow"
                                          : "Following"} */}
                                    </button>
                                  </div>
                                  <div className="flex-row-sb">{imgsArr}</div>
                                </div>
                              </div>
                              <div className="flex-row">
                                <div className="relative flex-row"
                                style={{display:this.state.isApproved ? '' : 'none'}}>
                                  <div
                                    className={className}
                                    id={singlePost._id}
                                    name="like"
                                    
                                    onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                                  ></div>
                                  <span className="hearts-number">
                                    {singlePost.postLikes}
                                  </span>
                                </div>
                                <Link to={this.state.isLoggedIn ?`/messaging/${singlePost.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                  <div className="icon post ml-10"
                                  style={{display:this.state.isApproved ? '' : 'none'}}></div>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="panel-body grid-67-33 grid-100-below768">
                            <div>
                              <Image
                                src={singlePost.postImage}
                                className="w-100pc"
                              />
                            </div>
                            <div>
                              <h2 className="mt-0">"{singlePost.postTitle}"</h2>
                              <div className="grid-33-67-below768 grid-100-below480">
                                <div className="mb-40 mb-0-below480">
                                  <p>{singlePost.postType}</p>
                                  <p>
                                    {singlePost.postLen} x {singlePost.postWid} x
                                    {singlePost.postHeight} in
                                  </p>
                                  {/* <p>121.9 x 182.9 x 3.8 cm</p> */}
                                </div>
                                <div className="mb-40 mb-20-below480">
                                  <h3>Description</h3>
                                  <p>{singlePost.postDesc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="close d-block"></div>
                        </div>
                      </div>
                    </div>
                  );

                  }
                  else if (
                    (type == singlePost.postType.toLowerCase() && (style == '' || style=='a')
                     && (dimension == '' || dimension == 'a')) ||
                    (type == singlePost.postType.toLowerCase() && style == singlePost.postStyle.toLowerCase() 
                    && (dimension == '' || dimension == 'a')) ||
                    (type == singlePost.postType.toLowerCase() && (style == '' || style=='a') 
                    && dimension == singlePost.postDim) ||

                    ((type == '' || type == 'a') && style == singlePost.postStyle.toLowerCase() 
                    && (dimension == '' || dimension == 'a')) ||
                    ((type == '' || type == 'a') && style == singlePost.postStyle.toLowerCase() 
                    && dimension == singlePost.postDim) ||

                    ((type == '' || type == 'a') && (style == '' || style=='a') && dimension == singlePost.postDim) ||                  

                    (this.props.filter.type == singlePost.postType.toLowerCase() &&
                    this.props.filter.style ==
                      singlePost.postStyle.toLowerCase() &&
                    this.props.filter.dimension == singlePost.postDim)
                  ) {
                    outPutArr.push(
                      <div className="modal-wrapper" key={singlePost._id}>
                        <figure className="">
                          <Image
                            src={
                              singlePost.postImage ? (
                                singlePost.postImage
                              ) : (
                                <Loader />
                              )
                            }
                            className={this.state.isLoggedIn ? "open-modal" : ''}
                          onClick = {this.state.isLoggedIn ? null : this.loginAlert}
                          />
                          <figcaption>
                            {/* <p>{this.state.items}</p> */}
                            <div>
                              <span className="txt-grey">by </span>
                              <Link to={this.state.isLoggedIn ?`/${singlePost.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                {singlePost.userName}
                              </Link>
                            </div>
                            <div className="relative"
                            style={{display:this.state.isApproved ? '' : 'none'}}>
                              <div
                                className={className}
                                id={singlePost._id}
                                name="like"
                                
                                onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                              ></div>
                              <span className="hearts-number">
                                {singlePost.postLikes}
                              </span>
                            </div>
                          </figcaption>
                        </figure>
                        <div className="overlay d-block hide">
                          <div className="modal panel d-block">
                            <div className="panel-head">
                              <div className="flex-row-sb w-100pc">
                                <div className="flex-row-sb dropdown-element">
                                  <Image
                                    src={
                                      user.profilePic
                                        ? user.profilePic
                                        : "../images/avatar_default.png"
                                    }
                                    alt=""
                                    className="avatar"
                                  />
                                  <a href="joancox.html" className="no-decor">
                                    <div>
                                      <h3>{singlePost.userName}</h3>
                                      <p>
                                        {user.title
                                          ? user.title
                                          : "Registra User"}
                                      </p>
                                    </div>
                                  </a>
                                  <div className="dropdown br">
                                    <div className="flex-row-sb mb-15">
                                      <div className="flex-row-sb">
                                        <Image
                                          src={
                                            user.profilePic
                                              ? user.profilePic
                                              : "../images/avatar_default.png"
                                          }
                                          alt=""
                                          className="avatar"
                                        />
                                        <div>
                                          <h3>{singlePost.userName}</h3>
                                          <p>
                                            {user.title
                                              ? user.title
                                              : "Registra User"}
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        id={user.userId}
                                        className="follow"
                                        onClick={this.followHandler}
                                        style={{display:this.state.isApproved ? '' : 'none'}}
                                      >
                                        <span
                                        id={user.userId}
                                        onClick={this.followHandler}
                                        >
                                          {isFollowedBy === -1
                                            ? "Follow"
                                            : "Following"}
                                        </span>
                                        {/* {isFollowedBy === -1
                                          ? "Follow"
                                          : "Following"} */}
                                      </button>
                                    </div>
                                    <div className="flex-row-sb">{imgsArr}</div>
                                  </div>
                                </div>
                                <div className="flex-row">
                                  <div className="relative flex-row"
                                  style={{display:this.state.isApproved ? '' : 'none'}}>
                                    <div
                                      className={className}
                                      id={singlePost._id}
                                      name="like"
                                      
                                      onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                                    ></div>
                                    <span className="hearts-number">
                                      {singlePost.postLikes}
                                    </span>
                                  </div>
                                  <Link to={this.state.isLoggedIn ?`/messaging/${singlePost.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                    <div className="icon post ml-10"
                                    style={{display:this.state.isApproved ? '' : 'none'}}></div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="panel-body grid-67-33 grid-100-below768">
                              <div>
                                <Image
                                  src={singlePost.postImage}
                                  className="w-100pc"
                                />
                              </div>
                              <div>
                                <h2 className="mt-0">"{singlePost.postTitle}"</h2>
                                <div className="grid-33-67-below768 grid-100-below480">
                                  <div className="mb-40 mb-0-below480">
                                    <p>{singlePost.postType}</p>
                                    <p>
                                      {singlePost.postLen} x {singlePost.postWid}{" "}
                                      x{singlePost.postHeight} in
                                    </p>
                                    {/* <p>121.9 x 182.9 x 3.8 cm</p> */}
                                  </div>
                                  <div className="mb-40 mb-20-below480">
                                    <h3>Description</h3>
                                    <p>{singlePost.postDesc}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="close d-block"></div>
                          </div>
                        </div>
                      </div>
                    );
                  }                  
                } else {                  
                  outPutArr.push(
                    <div className="modal-wrapper" key={singlePost._id}>
                      <figure className="painting abstract geometric large">
                        <Image
                          src={
                            singlePost.postImage ? (
                              singlePost.postImage
                            ) : (
                              <Loader />
                            )
                          }
                          className={this.state.isLoggedIn ? "open-modal" : ''}
                          onClick = {this.state.isLoggedIn ? null : this.loginAlert}
                        />
                        <figcaption>
                          {/* <p>{this.state.items}</p> */}
                          <div>
                            <span className="txt-grey">by </span>
                            <Link to={this.state.isLoggedIn ?`/${singlePost.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                              {singlePost.userName}
                            </Link>
                          </div>
                          <div className="relative"
                          style={{display:this.state.isApproved ? '' : 'none'}}>
                            <div
                              className={className}
                              id={singlePost._id}
                              name="like"
                              
                              onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                            ></div>
                            <span className="hearts-number">
                              {singlePost.postLikes}
                            </span>
                          </div>
                        </figcaption>
                      </figure>
                      <div className="overlay d-block hide">
                        {show ? (
                          <Alert
                            variant="warning"
                            onClose={() => this.setState({ show: false })}
                            dismissible
                          >
                            <Alert.Heading>
                              You Can't Follow Yourself
                            </Alert.Heading>
                          </Alert>
                        ) : (
                          ""
                        )}
                        <div className="modal panel d-block">
                          <div className="panel-head">
                            <div className="flex-row-sb w-100pc">
                              <div className="flex-row-sb dropdown-element">
                                <Image
                                  src={
                                    user.profilePic
                                      ? user.profilePic
                                      : "../images/avatar_default.png"
                                  }
                                  alt=""
                                  className="avatar"
                                />
                                <a href="joancox.html" className="no-decor">
                                  <div>
                                    <h3>{singlePost.userName}</h3>
                                    <p>
                                      {user.title ? user.title : "Registra User"}
                                    </p>
                                  </div>
                                </a>
                                <div className="dropdown br">
                                  <div className="flex-row-sb mb-15">
                                    <div className="flex-row-sb">
                                      <Image
                                        src={
                                          user.profilePic
                                            ? user.profilePic
                                            : "../images/avatar_default.png"
                                        }
                                        alt=""
                                        className="avatar"
                                      />
                                      <div>
                                        <h3>{singlePost.userName}</h3>
                                        <p>
                                          {user.title
                                            ? user.title
                                            : "Registra User"}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      id={user.userId}
                                      className="follow"
                                      onClick={this.followHandler}
                                      style={{display:this.state.isApproved ? '' : 'none'}}
                                    >
                                      <span
                                        id={user.userId}
                                        onClick={this.followHandler}
                                      >
                                        {isFollowedBy === -1
                                          ? "Follow"
                                          : "Following"}
                                      </span>
                                      {/* {isFollowedBy === -1
                                          ? "Follow"
                                          : "Following"} */}
                                    </button>
                                  </div>
                                  <div className="flex-row-sb">{imgsArr}</div>
                                </div>
                              </div>
                              <div className="flex-row">
                                <div className="relative flex-row" 
                                style={{display:this.state.isApproved ? '' : 'none'}}>
                                  <div
                                    className={className}
                                    id={singlePost._id}
                                    name="like"                                    
                                    onClick={this.state.isLoggedIn ? this.myLikeHandler : this.loginAlert}
                                  ></div>
                                  <span className="hearts-number">
                                    {singlePost.postLikes}
                                  </span>
                                </div>
                                <Link to={this.state.isLoggedIn ?`/messaging/${singlePost.userId}`:''}
                                  onClick={this.state.isLoggedIn ? null : this.loginAlert}
                                >
                                  <div className="icon post ml-10"
                                  style={{display:this.state.isApproved ? '' : 'none'}}></div>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="panel-body grid-67-33 grid-100-below768">
                            <div>
                              <Image
                                src={singlePost.postImage}
                                className="w-100pc"
                              />
                            </div>
                            <div>
                              <h2 className="mt-0">"{singlePost.postTitle}"</h2>
                              <div className="grid-33-67-below768 grid-100-below480">
                                <div className="mb-40 mb-0-below480">
                                  <p>{singlePost.postType}</p>
                                  <p>
                                    {singlePost.postLen} x {singlePost.postWid} x
                                    {singlePost.postHeight} in
                                  </p>
                                  {/* <p>121.9 x 182.9 x 3.8 cm</p> */}
                                </div>
                                <div className="mb-40 mb-20-below480">
                                  <h3>Description</h3>
                                  <p>{singlePost.postDesc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="close d-block"></div>
                        </div>
                      </div>
                    </div>
                  );
                }                
              }
            });
          }
        });
      }
    }
    return outPutArr;
  }
}

export default ArtGrid;
