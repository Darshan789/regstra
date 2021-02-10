import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import Loader from "./Loader";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Messages from "../Messages";
import Alert from "react-bootstrap/Alert";

class ArtGrid extends Component {
  id = localStorage.getItem("id");
  pathname = location.pathname;
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      isShuffle: false,
      show: false,
      isLoggedIn: false,
      filters: {
        type:props.type, 
        style: props.style,
        dimension : props.dimension
      }
    };

    if (this.id) {
      this.setState({ isLoggedIn: true });
    } else {
      this.setState({ isLoggedIn: false });
    }
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
    if (this.pathname === "/youfor") {
      let followingUserArr = [];
      let finalArr = [];
      fetch("http://localhost:4000/getUserDetails", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: this.id }),
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
    if (this.id) {
      console.log('ID');
      console.log(this.id);
      if (this.id != event.target.id) {
        fetch("http://localhost:4000/getFollowCounts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: event.target.id }),
        }).then((res) =>
          res.json().then((result) => {             
            fetch("http://localhost:4000/getFollowCounts", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ userId: this.id }),
            }).then((data) =>
              data.json().then((finalData) => {
                var checkFollowedBy = new RegExp(this.id, "g");
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
                      if (followedBy[i] == this.id) {
                        followedBy.splice(i, i + 1);
                      }
                    }
                    finalData[0].following = following.toString();
                    result[0].followedBy = followedBy.toString();
                    result[0].followers = --result[0].followers;
                  } else {
                    following.push(result[0].userId);
                    followedBy.push(this.id);
                    finalData[0].following = following.toString();
                    result[0].followedBy = followedBy.toString();
                    result[0].followers = ++result[0].followers;
                  }
                } else {
                  if (finalData[0].following.length == 0) {
                    finalData[0].following += result[0].userId;
                  } else {
                    finalData[0].following += "," + result[0].userId;
                  }
                  if (result[0].followedBy.length == 0) {
                    result[0].followedBy += this.id;
                  } else {
                    result[0].followedBy += "," + this.id;
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
                        userId: this.id,
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
                            body: JSON.stringify({ userId: this.id }),
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
    if (this.id) {
      fetch("http://localhost:4000/getLikeCounts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: event.target.id }),
      }).then((res) =>
        res.json().then((result) => {
          console.log(result[0]);
          var checkLike = new RegExp(this.id, "g");
          let isLiked = result[0].likedBy.search(checkLike);

          if (result[0].likedBy.length != 0) {
            var likes = result[0].likedBy.trim().split(",");
            if (isLiked != -1) {
              for (let i = 0; i <= likes.length; i++) {
                if (likes[i] == this.id) {
                  likes.splice(i, i + 1);
                }
              }
              result[0].likedBy = likes.toString();
              result[0].postLikes = --result[0].postLikes;
            } else {
              result[0].likedBy += "," + this.id;
              result[0].postLikes = ++result[0].postLikes;
            }
          } else {
            result[0].likedBy = this.id;
            result[0].postLikes = ++result[0].postLikes;
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
                  body: JSON.stringify({ userId: this.id }),
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

  render() {
    let outPutArr = [];
    const { error, isLoaded, items, isShuffle, show, isLoggedIn } = this.state;
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
          var checkLike = new RegExp(this.id, "g");
          let isLiked = post.likedBy.search(checkLike);
          if (this.props.filter) {
            if (
              (type == post.postType.toLowerCase() && style == '' && dimension == '') ||
              (type == post.postType.toLowerCase() && style == post.postStyle.toLowerCase() 
              && dimension == '') ||
              (type == post.postType.toLowerCase() && style == '' 
              && dimension == post.postDim) ||

              (type == '' && style == post.postStyle.toLowerCase() && dimension == '') ||
              (type == '' && style == post.postStyle.toLowerCase() && dimension == post.postDim) ||

              (type == '' && style == '' && dimension == post.postDim) ||                  

              (this.props.filter.type == post.postType.toLowerCase() &&
              this.props.filter.style ==
              post.postStyle.toLowerCase() &&
              this.props.filter.dimension == post.postDim)  
            ) {
                outPutArr.push(
                  isLoggedIn ? (
                    <Alert variant="warning" dismissible>
                      <Alert.Heading>Please Login First</Alert.Heading>
                    </Alert>
                  ) : (
                    ""
                  ),
                  <div className="modal-wrapper" key={post._id.toString()}>
                    <figure className="painting abstract geometric large">
                      <Image
                        src={post.postImage ? post.postImage : <Loader />}
                        className="open-modal"
                      />
                      <figcaption>
                        <div>
                          <span className="txt-grey">by </span>
                          <a href="#">{post.userName}</a>
                        </div>
                        <div className="relative">
                          <div
                            className={
                              isLoggedIn
                                ? isLiked === -1
                                  ? "icon heart"
                                  : "icon heart-highlighted anim-pump"
                                : "login-trigger icon heart"
                            }
                            id={post._id}
                            name="like"
                            onClick={this.myLikeHandler}
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
                              <div className="relative flex-row">
                                <div
                                  className={
                                    isLoggedIn
                                      ? isLiked === -1
                                        ? "icon heart"
                                        : "icon heart-highlighted anim-pump"
                                      : "login-trigger icon heart"
                                  }
                                  id={post._id}
                                  name="like"
                                  onClick={this.myLikeHandler}
                                ></div>
                                <span className="hearts-number">
                                  {post.postLikes}
                                </span>
                              </div>
                              <div className="icon post ml-10"></div>
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
                  isLoggedIn ? (
                    <Alert variant="warning" dismissible>
                      <Alert.Heading>Please Login First</Alert.Heading>
                    </Alert>
                  ) : (
                    ""
                  ),
                  <div className="modal-wrapper" key={post._id.toString()}>
                    <figure className="painting abstract geometric large">
                      <Image
                        src={post.postImage ? post.postImage : <Loader />}
                        className="open-modal"
                      />
                      <figcaption>
                        <div>
                          <span className="txt-grey">by </span>
                          <a href="#">{post.userName}</a>
                        </div>
                        <div className="relative">
                          <div
                            className={
                              isLoggedIn
                                ? isLiked === -1
                                  ? "icon heart"
                                  : "icon heart-highlighted anim-pump"
                                : "login-trigger icon heart"
                            }
                            id={post._id}
                            name="like"
                            onClick={this.myLikeHandler}
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
                              <div className="relative flex-row">
                                <div
                                  className={
                                    isLoggedIn
                                      ? isLiked === -1
                                        ? "icon heart"
                                        : "icon heart-highlighted anim-pump"
                                      : "login-trigger icon heart"
                                  }
                                  id={post._id}
                                  name="like"
                                  onClick={this.myLikeHandler}
                                ></div>
                                <span className="hearts-number">
                                  {post.postLikes}
                                </span>
                              </div>
                              <div className="icon post ml-10"></div>
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
        });
      } else {
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
              var checkLike = new RegExp(this.id, "g");
              let isLiked = singlePost.likedBy.search(checkLike);
              var checkFollow = new RegExp(this.id, "g");
              let isFollowedBy = user.followedBy.search(checkFollow);
              if (this.props.filter) {
                if (
                  (type == singlePost.postType.toLowerCase() && style == '' && dimension == '') ||
                  (type == singlePost.postType.toLowerCase() && style == singlePost.postStyle.toLowerCase() 
                  && dimension == '') ||
                  (type == singlePost.postType.toLowerCase() && style == '' 
                  && dimension == singlePost.postDim) ||

                  (type == '' && style == singlePost.postStyle.toLowerCase() && dimension == '') ||
                  (type == '' && style == singlePost.postStyle.toLowerCase() && dimension == singlePost.postDim) ||

                  (type == '' && style == '' && dimension == singlePost.postDim) ||                  

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
                          className="open-modal"
                        />
                        <figcaption>
                          {/* <p>{this.state.items}</p> */}
                          <div>
                            <span className="txt-grey">by </span>
                            <Link to={`/${singlePost.userId}`}>
                              {singlePost.userName}
                            </Link>
                          </div>
                          <div className="relative">
                            <div
                              className={
                                isLoggedIn
                                  ? isLiked === -1
                                    ? "icon heart"
                                    : "icon heart-highlighted anim-pump"
                                  : "login-trigger icon heart"
                              }
                              id={singlePost._id}
                              name="like"
                              onClick={this.myLikeHandler}
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
                                    >
                                      <span>
                                        {isFollowedBy === -1
                                          ? "Follow"
                                          : "Following"}
                                      </span>
                                    </button>
                                  </div>
                                  <div className="flex-row-sb">{imgsArr}</div>
                                </div>
                              </div>
                              <div className="flex-row">
                                <div className="relative flex-row">
                                  <div
                                    className={
                                      isLoggedIn
                                        ? isLiked === -1
                                          ? "icon heart"
                                          : "icon heart-highlighted anim-pump"
                                        : "login-trigger icon heart"
                                    }
                                    id={singlePost._id}
                                    name="like"
                                    onClick={this.myLikeHandler}
                                  ></div>
                                  <span className="hearts-number">
                                    {singlePost.postLikes}
                                  </span>
                                </div>
                                <Link to={`/messaging/${singlePost.userId}`}>
                                  <div className="icon post ml-10"></div>
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
                        className="open-modal"
                      />
                      <figcaption>
                        {/* <p>{this.state.items}</p> */}
                        <div>
                          <span className="txt-grey">by </span>
                          <Link to={`/${singlePost.userId}`}>
                            {singlePost.userName}
                          </Link>
                        </div>
                        <div className="relative">
                          <div
                            className={
                              isLoggedIn
                                ? isLiked === -1
                                  ? "icon heart"
                                  : "icon heart-highlighted anim-pump"
                                : "login-trigger icon heart"
                            }
                            id={singlePost._id}
                            name="like"
                            onClick={this.myLikeHandler}
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
                                  >
                                    <span>
                                      {isFollowedBy === -1
                                        ? "Follow"
                                        : "Following"}
                                    </span>
                                  </button>
                                </div>
                                <div className="flex-row-sb">{imgsArr}</div>
                              </div>
                            </div>
                            <div className="flex-row">
                              <div className="relative flex-row">
                                <div
                                  className={
                                    isLoggedIn
                                      ? isLiked === -1
                                        ? "icon heart"
                                        : "icon heart-highlighted anim-pump"
                                      : "login-trigger icon heart"
                                  }
                                  id={singlePost._id}
                                  name="like"
                                  onClick={this.myLikeHandler}
                                ></div>
                                <span className="hearts-number">
                                  {singlePost.postLikes}
                                </span>
                              </div>
                              <Link to={`/messaging/${singlePost.userId}`}>
                                <div className="icon post ml-10"></div>
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
            });
          }
        });
      }
    }
    return outPutArr;
  }
}

export default ArtGrid;
