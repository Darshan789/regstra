import React from "react";
import { Component } from "react";
import Loader from "./Loader";
import Image from "react-bootstrap/Image";

class UserProfile extends Component {
  id = localStorage.getItem("id");
  likeCount = 0;
  constructor(props) {
    super(props);
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
      posts: [],
    };
    if (this.state.id) {
      fetch("http://localhost:4000/getUserDetails", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: this.state.id }),
      }).then((res) =>
        res.json().then((result) => {
          this.setState(result[0]);
        })
      );
      this.getArtistPosts(this.state.id);
    }
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
        this.setState({ piecesOfArt: finalData.length });
        this.setState({ isLoaded: true });
        this.setState({ posts: finalData });
      });
    });
  };

  myLikeHandler = (event) => {
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
          console.log(JSON.stringify(result[0]));
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
          console.log(JSON.stringify(result[0]));
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

  render() {
    console.log(this.state);
    if (!this.state.isLoaded) {
      return <Loader />;
    } else {
      let ArtArr = [];
      let imgArr = [];
      this.state.posts.forEach((post) => {
        if (imgArr.length >= 4) {
          return;
        }
        imgArr.push(<Image src={post.postImage} className="img-thumbnail" />);
      });
      this.state.posts.forEach((post) => {
        this.likeCount += post.postLikes ? post.postLikes : 0;
        var re = new RegExp(this.id, "g");
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
                        <div className="flex-row-sb">{imgArr}</div>
                      </div>
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
                        <th>0</th>
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
                    checked="checked"
                    readOnly
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
