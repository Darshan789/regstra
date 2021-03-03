import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import Loader from "./Loader";

class profile extends Component {
  id = localStorage.getItem("id");
  userType = localStorage.getItem("userType");
  likeCount = 0;
  constructor(props) {
    super(props);
    this.state = {
      userId: this.id,
      name: props.name,
      title: props.title,
      location: props.location,
      websiteUrl: props.websiteUrl,
      bio: props.bio,
      behanceUrl: props.behanceUrl,
      dribbleUsername: props.dribbleUsername,
      mediumUrl: props.mediumUrl,
      twitterUsername: props.twitterUsername,
      profilePic: props.profilePic,
      coverPic: props.coverPic ? props.coverPic : "../images/image34.jpg",
      piecesOfArt: "",
      socialPost: "",
      posts: [],
      postsView: "",
      isLoaded: false,
    };
    if (this.id) {
      this.getArtistPosts(this.id);
      this.getUserDetails(this.id);
    }
  }

  // componentDidMount () {
  //   const script = document.createElement("script");
  //   script.innerHTML = `$('input[type=""]').click(function(){
  //     if($(this).prop("checked") == true){
  //         console.log("Checkbox is checked.");
  //     }
  //     else if($(this).prop("checked") == false){
  //         console.log("Checkbox is unchecked.");
  //     }
  //     console.log('clicked');
  //   });`;
  //   document.body.appendChild(script);
  // }

  getUserDetails = (id) => {
    fetch("http://localhost:4000/getUserDetails", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: id }),
    }).then((res) =>
      res.json().then((result) => {
        // console.log(result);
      })
    );
  };

  getArtistPosts = (id) => {
    if (this.userType === "user2") {
      let followingUserArr = [];
      let finalArr = [];
      fetch("http://localhost:4000/getUserDetails", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: this.id }),
      }).then((res) =>
        res.json().then((result) => {
          //console.log(result);
          // if(result[0].following.split(",").length > 1){
          // }
          followingUserArr.push(result[0].following.split(","));
          followingUserArr.forEach((element) => {
            if (element !== "") {
              element.forEach((el) => {
                el = el.trim();
                if (el != "") {
                  fetch("http://localhost:4000/getFollowingPosts", {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ userId: el }),
                  }).then((data) => {
                    data.json().then((finalData) => {
                      // console.log(finalData);
                      finalData.forEach((final) => finalArr.push(final));
                      this.setState({
                        isLoaded: true,
                        posts: finalArr,
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
      fetch("http://localhost:4000/getPostsSingleArtist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      }).then((data) => {
        data.json().then((finalData) => {
          // this.setState({ piecesOfArt: finalData.length });
          var lengthArt = 0;
          var countSocialPost = 0;
          finalData.forEach((post) => {
            if (post.artPostType == "1") {
              lengthArt++;
              this.setState({ piecesOfArt: lengthArt });
            }
            if (post.artPostType == "2") {
              countSocialPost++;
              this.setState({ socialPost: countSocialPost });
            }
          });
          this.setState({ isLoaded: true });
          this.setState({ posts: finalData });
          // finalData.forEach((post) => {});
        });
      });
    }
  };

  myLikeHandler = (event) => {
    fetch("http://localhost:4000/getLikeCounts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId: event.target.id }),
    }).then((res) =>
      res.json().then((result) => {
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
            if (this.userType === "user2") {
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
                          fetch("http://localhost:4000/getFollowingPosts", {
                            method: "PUT",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ userId: el }),
                          }).then((data) => {
                            data.json().then((finalData) => {
                              finalData.forEach((final) =>
                                finalArr.push(final)
                              );
                              this.setState({
                                isLoaded: true,
                                posts: finalArr,
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
              fetch("http://localhost:4000/getPostsSingleArtist", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: this.id }),
              }).then((data) => {
                data.json().then((finalData) => {
                  var lengthArt = 0;
                  var countSocialPost = 0;
                  // this.setState({ piecesOfArt: finalData.length });
                  this.setState({ isLoaded: true });
                  this.setState({ posts: finalData });
                  finalData.forEach((post) => {
                    if (post.artPostType === 1) {
                      this.setState({ piecesOfArt: lengthArt });
                      lengthArt++;
                    }
                    if (post.artPostType === 2) {
                      this.setState({ socialPost: countSocialPost });
                      countSocialPost++;
                    }
                  });
                });
              });
            }
          })
        );
      })
    );
  };

  render() {
    if (!this.state.isLoaded) {
      return <Loader />;
    } else {
      $('input[type="checkbox"]').click(function () {
        $(".modal-wrapper").toggleClass("d-none");
      });
      let ArtArr = [];
      let imgArr = [];
      let LikeArr = [];
      let Tags = [];
      this.state.posts.forEach((post) => {
        if (post.postTags != "" && post.postTags != undefined) {
          Tags.push(<span className="tag">{post.postTags}</span>);
        }
      });
      if (this.userType === "user2") {
        var re = new RegExp(this.id, "g");
        this.state.posts.forEach((user) => {
          user.posts.forEach((post) => {
            if (post.artPostType == 1) {
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
                      <div className="relative">
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
                                user.profilePic
                                  ? user.profilePic
                                  : "../images/avatar_default.png"
                              }
                              alt=""
                              className="avatar"
                            />
                            <a href="joancox.html" className="no-decor">
                              <div>
                                <h3>{post.userName}</h3>
                                <p>
                                  {user.title ? user.title : "Registra User"}
                                </p>
                              </div>
                            </a>
                          </div>
                          <div className="flex-row">
                            <div className="relative flex-row">
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
                                {post.postLen} x {post.postWid} x
                                {post.postHeight} in
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
        });
      } else {
        this.state.posts.forEach((post) => {
          LikeArr.push(post.postLikes);
        });

        let likeCount = LikeArr.reduce(function (acc, val) {
          return acc + val;
        }, 0);
        this.state.posts.forEach((post) => {
          if (imgArr.length >= 4) {
            return;
          }
          imgArr.push(<Image src={post.postImage} className="img-thumbnail" />);
        });
        this.state.posts.forEach((post) => {
          this.likeCount += post.postLikes;
          var re = new RegExp(this.id, "g");

          if (post.artPostType == 1) {
            ArtArr.push(
              <div
                className="modal-wrapper with_rounded_corner"
                key={post._id.toString()}
              >
                <figure className="painting abstract geometric large">
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
                            src="../images/avatar_default.png"
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
                        </div>
                        <div className="flex-row">
                          <div className="relative flex-row">
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
                                  ? "hearts-number"
                                  : "hearts-number"
                              }
                            >
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
          } else {
            let displayStyle = "block";
            let postImage = "";
            if (post.postImage === "") {
              displayStyle = "none";
              postImage = "../images/articles/6.jpg";
            } else {
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
                  <div class="relative">
                    <div
                      class={
                        post.likedBy.search(re) === -1
                          ? "icon heart"
                          : "icon heart-highlighted anim-pump"
                      }
                    ></div>
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
      }
      return (
        <React.Fragment>
          <main>
            <div
              className="profile-head bg-photo34"
              style={{ backgroundImage: 'url("' + this.state.coverPic + '")' }}
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
                        <th>
                          {this.state.socialPost ? this.state.socialPost : 0}
                        </th>
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
                  <div>{Tags}</div>
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

export default profile;
