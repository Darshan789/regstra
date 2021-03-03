import React from "react";
import { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Loader from "./Loader";
import Image from "react-bootstrap/Image";

class UserProfile extends Component {
  id = localStorage.getItem("id");  
  likeCount = 0;
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      id: props.match.params.id,      
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
      coverPic: "../images/image34.jpg",
      isLoaded: false,
      piecesOfArt: "",
      followedBy :'',
      socialPost:'',
      posts: [],
      show: false,
      currentUserApproval : '',
    };
    if (this.state.id) {
      this.getUserDetails();
      if(this.id){
        this.getCurrentUserDetails();
      }
    }      
  }

  getUserDetails = () => {
    fetch("http://localhost:4000/getUserDetails", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: this.state.id }),
      }).then((res) =>{
        res.json().then((result) => {
          this.setState(result[0]); 
          console.log(result[0]);         
        });
      });
  }


  getCurrentUserDetails = () => {
    fetch("http://localhost:4000/getUserDetails", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: this.id }),
      }).then((res) =>
        res.json().then((result) => {
          this.setState({currentUserApproval:result[0].approved}); 
          console.log(result[0]);         
        })
      );
      this.getArtistPosts(this.state.id);
  } 

  getArtistPosts = (id) => {
    fetch("http://localhost:4000/getPostsSingleArtist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id }),
    }).then((data) => {
      data.json().then((finalData) => {
        var lengthArt = 0;
        var countSocialPost = 0;
        finalData.forEach((post) => {
          if(post.artPostType == '1'){
            lengthArt++;
            this.setState({ piecesOfArt: lengthArt });              
          }
          if(post.artPostType == '2'){
            countSocialPost++;
            this.setState({ socialPost: countSocialPost });              
          }
        });
        this.setState({ isLoaded: true });
        this.setState({ posts: finalData });
      });
    });
  };

  myLikeHandler = (event) => {
    console.log('mylikehandler');
    fetch("http://localhost:4000/getLikeCounts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId: event.target.id }),
    }).then((res) =>
      res.json().then((result) => {
        var re = new RegExp(this.id, "g");
        if (result[0].likedBy.search(re) === -1) {
          result[0].likedBy += ", " + this.id;
          result[0].postLikes = ++result[0].postLikes;
          // console.log(JSON.stringify(result[0]));
          fetch("http://localhost:4000/likedPost", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ data: result[0], postId: result[0]._id }),
          }).then((res) => {
            res.json().then((getData) => {
              this.render();
            });
          });
        } else {
          result[0].likedBy = "";
          result[0].postLikes = --result[0].postLikes;
          // console.log(JSON.stringify(result[0]));
          fetch("http://localhost:4000/likedPost", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ data: result[0], postId: result[0]._id }),
          }).then((res) => {
            res.json().then((getData) => {
              this.render();
            });
          });
        }
      })
    );
  };

  followHandler = (event) => {
    if (this.id) {
      // console.log('ID');
      // console.log(this.id);      
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
                    this.pushNotifications(event, 'follow', result[0].userId);
                  }
                } else {
                  if (finalData[0].following.length == 0) {
                    finalData[0].following += result[0].userId;                    
                  } else {
                    finalData[0].following += "," + result[0].userId;                    
                  }
                  if (result[0].followedBy.length == 0) {
                    result[0].followedBy += this.id;
                    this.pushNotifications(event, 'follow', result[0].userId);
                  } else {
                    result[0].followedBy += "," + this.id;
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
                        userId: this.id,
                        data: finalData[0],
                      }),
                    }).then((out) =>
                      out.json().then((finalOut) => {                        
                          fetch("http://localhost:4000/getAllPosts")
                            .then((res) => res.json())
                            .then(
                              (result) => {
                                this.setState({
                                  isLoaded: true,
                                  items: result,
                                  isShuffle: true,
                                });
                                this.getUserDetails();
                              },
                              (error) => {
                                this.setState({
                                  isLoaded: true,
                                  error,
                                });
                              }
                            );
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

   pushNotifications = (event, notificationType, to) => {
    let postId = event.target.id;
    let from = this.id;
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

  render() {
    this.likeCount = 0;   
    if (!this.state.isLoaded) {
      return <Loader />;
    } else {
      let ArtArr = [];
      let imgArr = [];
      let follow_like = []; 
      $('input[type="checkbox"]').click(function(){
        $('.modal-wrapper').toggleClass('d-none');                    
      });
      if(this.id != this.state.id){
        var checkFollow = new RegExp(this.id, "g");
        let isFollowedBy = this.state.followedBy.search(checkFollow);
        follow_like.push(
          <div class="txt-align-c">
            <button class="follow mrl-5 mt-8" id={this.state.id} onClick={this.followHandler}
            style={{display:this.state.currentUserApproval ? 'inline-block' : 'none'}}>
              <span id={this.state.id} onClick={this.followHandler}>{isFollowedBy === -1
                ? "Follow"
                : "Following"}
              </span>
            </button>
            <Link to={`/messaging/${this.state.id}`}
            style={{display:this.state.currentUserApproval ? 'inline-block' : 'none'}}>
              <button class="mrl-5 mt-8">Contact</button>
            </Link>            
          </div>
        );
      }
      
      this.state.posts.forEach((post) => {
        if (imgArr.length >= 4) {
          return;
        }
        imgArr.push(<Image src={post.postImage} className="img-thumbnail" />);
      });
      this.state.posts.forEach((post) => {
        this.likeCount += post.postLikes ? post.postLikes : 0;
        var re = new RegExp(this.id, "g");
        if(post.artPostType == '1'){
          ArtArr.push(
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
                  <div className="relative"
                  style={{display:this.state.currentUserApproval ? 'block' : 'none'}}>
                    <div
                      className={
                        post.likedBy.search(re) === -1
                          ? "icon heart"
                          : "icon heart-highlighted anim-pump"
                      }
                      id={post._id}
                      name="like"
                      onClick={this.myLikeHandler}
                    ></div>
                    <span
                      className={
                        post.likedBy.search(re) === -1
                          ? "hearts-number hide"
                          : "hearts-number"
                      }
                    >
                      {post.postLikes}
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
                            <button className="follow"
                            style={{display:this.state.currentUserApproval ? 'block' : 'none'}}>
                              <span>Follow</span>
                            </button>
                          </div>
                          <div className="flex-row-sb">{imgArr}</div>
                        </div>
                      </div>
                      <div className="flex-row">
                        <div className="relative flex-row"
                        style={{display:this.state.currentUserApproval ? 'block' : 'none'}}>
                          <div
                            className={
                              post.likedBy.search(re) === -1
                                ? "icon heart"
                                : "icon heart-highlighted anim-pump"
                            }
                            id={post._id}
                            name="like"
                            onClick={this.myLikeHandler}
                          ></div>
                          <span
                            className={
                              post.likedBy.search(re) === -1
                                ? "hearts-number hide"
                                : "hearts-number"
                            }
                          >
                            {post.postLikes}
                          </span>
                        </div>
                        <div className="icon post ml-10"
                        style={{display:this.state.currentUserApproval ? 'block' : 'none'}}></div>
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
                            {post.postLen} x {post.postWid} x{post.postHeight} in
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
        else{
          let displayStyle = "block";
            let postImage = '';
            if(post.postImage === ''){
              displayStyle = "none";
              postImage = '../images/articles/6.jpg'
            }else{
              postImage = post.postImage;
            }
            ArtArr.push(
              <article class="panel">
                  <div class="panel-head">
                      <div class="flex-row-sb">
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
                              <h3>{this.state.name}</h3>
                              <p>{this.state.title}</p>
                          </div>
                      </div>
                  </div>
                  <div class="panel-body">
                      <img src={postImage} />
                      <h3>{post.postTitle}</h3>
                      <p>{post.postDesc}</p>
                  </div>
                  <div class="panel-footer">
                      <a href="#">Read more</a>
                      <div class="relative" 
                      style={{display:this.state.currentUserApproval ? 'block' : 'none'}}>
                          <div class={
                          post.likedBy.search(re) === -1
                            ? "icon heart"
                            : "icon heart-highlighted anim-pump"
                        }></div>
                        <span
                              className={
                                post.likedBy.search(re) === -1
                                  ? "hearts-number"
                                  : "hearts-number"
                              }
                            >
                              {post.postLikes}
                            </span>
                      </div>
                  </div>
              </article>
            );
        }
      });
      return (
        <React.Fragment>
          <main>
            <div
              className="profile-head bg-photo34"
              style={{ backgroundImage: "url(" + this.state.coverPic + ")" }}
            >
              <div className="profile-info grid-33-33-33 mw-1100">
                <div className="small-p-margins flex-col">
                  <div className="flex-row-sb">
                    <Image
                      src={
                        this.state.profilePic
                          ? this.state.profilePic
                          : "../images/avatar_default.png"
                      }
                      alt=""
                      className="avatar-big"
                    />
                    <div>
                      <h1>{this.state.name}</h1>
                      <p className="txt-s">{this.state.location}</p>
                      <p className="txt-s">{this.state.websiteUrl}</p>
                    </div>
                    <div></div>
                  </div>
                  {follow_like}
                </div>
                <div className="flex-col mw-380">
                  <p>{this.state.bio}</p>
                  <table id="profile-stats">
                    <colgroup>
                      <col width="33.33%" />
                      <col width="33.33%" />
                      <col width="33.33%" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>
                          {this.state.piecesOfArt ? this.state.piecesOfArt : 0}
                        </th>
                        <th>{this.state.socialPost ? this.state.socialPost : 0}</th>
                        <th>{this.likeCount}</th>
                      </tr>
                      <tr>
                        <td>Pieces of Art</td>
                        <td>Social Posts</td>
                        <td>Loves</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex-col">
                  <h3>Art Media</h3>
                  <div>
                    <span className="tag">Oil Painting</span>
                    <span className="tag">Airbrush</span>
                    <span className="tag">Oil Pastel</span>
                  </div>
                  <h3>On the web</h3>
                  <div>
                    <a href={this.state.behanceUrl}>
                      <span className="icon-round">
                        <i className="fab fa-behance"></i>
                      </span>
                    </a>
                    <span className="icon-round">
                      <i className="fab fa-facebook-f"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="overlay-dark"></div>
            </div>
            <section className="stripe">
              <div className="input-section">
                <div className="input-container">
                  <input
                    type="checkbox"
                    id="checkbox-1"
                    className="articles-checkbox"
                  />
                  <label htmlFor="checkbox-1">
                    <span className="checkbox">
                      Show {this.state.name ? this.state.name : "User"}'s Social
                      Posts
                    </span>
                  </label>
                </div>
              </div>
            </section>
            <section className="art-grid">
              <div id="columns" className="p-0">
                {ArtArr}
              </div>
            </section>
          </main>
        </React.Fragment>
      );
    }
  }
}
export default UserProfile;
