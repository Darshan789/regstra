import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "/src/components/Loader";
import Login from "/src/components/Login";
import md5 from "md5";
import DropDown from "./components/DropDown";
import Alert from 'react-bootstrap/Alert';

class Admin extends Component {
  id = localStorage.getItem("id");
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      artlovers: [],
      posts: [],
      blogposts: [],
      selectedItem: "dashboard",
      isLoaded: false,
      email: "",
      newemail:'',
      password: "",
      newpassword:'',
      oldpassword:'',
      isAdmin: false,
      userPopUp: "",
      alertHtml:'',
      selectedValue:null,      
    };
    if (this.id) {
      this.checkAdmin();      
      //this.getAdminDetails();
    }    
    // else{
    //     window.location.replace('/login');
    // }
  }

  login = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }).then((data) => {
      data.json().then((finalData) => {
        if (finalData.length >= 1) {
          this.setState({ isAdmin: true });          
          this.getUserId();
        }
      });
    });
  };

  logout = (event) => {
    localStorage.removeItem("id");
    localStorage.removeItem("userType");
    window.location.replace("/");
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
        // console.log(finalData);
        localStorage.setItem("id", finalData.id);
        localStorage.setItem("userType", finalData.userType);
        if (localStorage.getItem("userType") != undefined) {
          location.reload();
        }
      });
    });
  };

  // getAdminDetails = () => {
  //   fetch("http://localhost:4000/getAdminDetails", {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({ id: this.id }),
  //   }).then((data) => {
  //     data.json().then((finalData) => {
  //       this.setState({email:finalData[0].email});
  //     });
  //   });
  // }

  checkAdmin = () => {
    fetch("http://localhost:4000/checkAdmin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: this.id }),
    }).then((data) => {
      data.json().then((finalData) => {
        if (finalData.length > 0) {
          this.setState({email:finalData[0].email});
          this.setState({newemail:finalData[0].email});
          this.setState({password:finalData[0].password});
          this.getData("dashboard");
        }
      });
    });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam == "password") {
      this.setState({ [nam]: md5(val) });
    }
    else if (nam == "oldpassword") {
      this.setState({ [nam]: md5(val) });
    }
    else if (nam == "newpassword") {
      this.setState({ [nam]: md5(val) });
    }
     else {
      this.setState({ [nam]: val });
    }
  };

  selectItem = (event) => {
    let id = "#" + event.target.id;
    $(".list-group-item").removeClass("active");
    $(id).addClass("active");
    this.setState({ selectedItem: event.target.id });
    this.getData(event.target.id);
  };

  getData = (selectedItem) => {
    // let selectedItem = this.state.selectedItem;
    let artists = [];
    let artlovers = [];
    if (selectedItem == "dashboard") {
      fetch("http://localhost:4000/getOnlyArtists").then((data) => {
        data.json().then((users) => {
          users.forEach((user) => {
            if (user.user[0].type == "user1") {
              artists.push(user);
            } else if (user.user[0].type == "user2") {
              artlovers.push(user);
            }
            this.setState({ artists: artists });
            this.setState({ artlovers: artlovers });
          });
        });
      });

      fetch("http://localhost:4000/getOnlyPosts").then((data) => {
        data.json().then((posts) => {
          // console.log(posts);
          this.setState({ posts: posts });
        });
      });

      fetch("http://localhost:4000/getOnlyBlogPosts").then((data) => {
        data.json().then((blogposts) => {
          this.setState({ blogposts: blogposts });
          this.setState({ isLoaded: true });
        });
      });
    }
    if (
      (selectedItem == "artist" || selectedItem == "artlover") &&
      (this.state.artists.length == 0 || this.state.artlovers.length == 0)
    ) {
      fetch("http://localhost:4000/getOnlyArtists").then((data) => {
        data.json().then((users) => {
          users.forEach((user) => {
            if (user.user[0].type == "user1") {
              artists.push(user);
            } else if (user.user[0].type == "user2") {
              artlovers.push(user);
            }
            this.setState({ artists: artists });
            this.setState({ artlovers: artlovers });
          });
          this.setState({ isLoaded: true });
        });
      });
    }
    if (selectedItem == "posts" && this.state.posts.length == 0) {
      fetch("http://localhost:4000/getOnlyPosts").then((data) => {
        data.json().then((posts) => {
          // console.log(posts);
          this.setState({ posts: posts });
          this.setState({ isLoaded: true });
        });
      });
    }
    if (selectedItem == "blogposts" && this.state.blogposts.length == 0) {
      fetch("http://localhost:4000/getOnlyBlogPosts").then((data) => {
        data.json().then((blogposts) => {
          this.setState({ blogposts: blogposts });
          this.setState({ isLoaded: true });
        });
      });
    }
  };

  approveArtist = (event) => {
    fetch("http://localhost:4000/approveUser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: event.target.id, approved: true }),
    }).then((data) => {
      data.json().then((finalData) => {
        let artists = [];
        let artlovers = [];
        fetch("http://localhost:4000/getOnlyArtists").then((data) => {
          data.json().then((users) => {
            users.forEach((user) => {
              if (user.user[0].type == "user1") {
                artists.push(user);
              } else if (user.user[0].type == "user2") {
                artlovers.push(user);
              }
            });
            this.setState({ artists: artists });
            this.setState({ artlovers: artlovers });
            this.setState({ isLoaded: true });
          });
        });
      });
    });
  };

  blockArtist = (event) => {
    fetch("http://localhost:4000/approveUser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: event.target.id, approved: false }),
    }).then((data) => {
      data.json().then((finalData) => {
        let artists = [];
        let artlovers = [];
        fetch("http://localhost:4000/getOnlyArtists").then((data) => {
          data.json().then((users) => {
            users.forEach((user) => {
              if (user.user[0].type == "user1") {
                artists.push(user);
              } else if (user.user[0].type == "user2") {
                artlovers.push(user);
              }
            });
            this.setState({ artists: artists });
            this.setState({ artlovers: artlovers });
          });
        });
      });
    });
  };

  publishPost = (event) => {
    fetch("http://localhost:4000/publishPost", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: event.target.id, publish: true }),
    }).then((data) => {
      data.json().then((finalData) => {
        fetch("http://localhost:4000/getOnlyPosts").then((data) => {
          data.json().then((posts) => {
            this.setState({ posts: posts });
            this.setState({ isLoaded: true });
          });
        });
      });
    });
  };

  blockPost = (event) => {
    fetch("http://localhost:4000/publishPost", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: event.target.id, publish: false }),
    }).then((data) => {
      data.json().then((finalData) => {
        fetch("http://localhost:4000/getOnlyPosts").then((data) => {
          data.json().then((posts) => {
            this.setState({ posts: posts });
            this.setState({ isLoaded: true });
          });
        });
      });
    });
  };

  deletePost = (event) => {
    fetch("http://localhost:4000/deletePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: event.target.id }),
    }).then((data) => {
      data.json().then((finalData) => {
        fetch("http://localhost:4000/getOnlyBlogPosts").then((data) => {
          data.json().then((blogposts) => {
            this.setState({ blogposts: blogposts });
            this.setState({ isLoaded: true });
          });
        });
      });
    });
  };

  dropDownChanged = (selectedDropdown) => {
    this.setState({selectedValue: selectedDropdown});        
  };

  updateAdminProfile = (event) => {
    event.preventDefault();  
    if(this.state.oldpassword != '' && this.state.newpassword != '' && 
    this.state.oldpassword != this.state.password){
      this.setState({alertHtml:
      [<Alert variant="danger" onClose={() => this.setState({alertHtml:''})} dismissible>
        <Alert.Heading>Old Password Does Not Match.</Alert.Heading>
      </Alert>]});
    }
    else if(this.state.oldpassword == '' && this.state.newpassword == '' && this.state.newemail == ''){
      this.setState({alertHtml:
      [<Alert variant="danger" onClose={() => this.setState({alertHtml:''})} dismissible>
        <Alert.Heading>Please Fill Email or Password.</Alert.Heading>
      </Alert>]});
    }
    else if(this.state.oldpassword != '' && this.state.newpassword != '' && 
    this.state.oldpassword == this.state.password){
      fetch('http://localhost:4000/updateAdminDetails',{
        method:'PUT',
        headers: {
        "Content-Type": "application/json",
        },
        body:JSON.stringify({
          _id:this.id,
          oldemail:this.state.email,
          email:this.state.newemail,
          password:this.state.newpassword
          })
      }).then(data=>{
        data.json().then(finalData => {          
          location.reload();
        });
      });
    }
    else if(this.state.email != '' && this.state.email == this.state.newemail){
      this.setState({alertHtml:
      [<Alert variant="warning" onClose={() => this.setState({alertHtml:''})} dismissible>
        <Alert.Heading>Nothing Changed.</Alert.Heading>
      </Alert>]});
    }
    else{
      fetch('http://localhost:4000/updateAdminDetails',{
        method:'PUT',
        headers: {
        "Content-Type": "application/json",
        },
        body:JSON.stringify({_id:this.id,oldemail:this.state.email,email:this.state.newemail})
      }).then(data=>{
        data.json().then(finalData => {          
          location.reload();
        });
      });
    }
  }

  render() {        
    let type;
    let style;
    let dimension;
    if(typeof this.state.selectedValue != 'undefined' && this.state.selectedValue != null){
      type = this.state.selectedValue.type;
      style = this.state.selectedValue.style;
      dimension = this.state.selectedValue.dimension;
    }
    let tableContent = [];
    let tbody = [];
    let content = [];
    let artloverHtml = [];
    let artistHtml = [];
    if (this.state.selectedItem == "artist") {
      tableContent.push(
        <thead>
          <tr>
            <td>#</td>
            <td>Profile Pic</td>
            <td>Name</td>
            <td>Title</td>
            <td>Location</td>
            <td>Website</td>
            <td>Bio</td>
            <td>Action</td>
          </tr>
        </thead>
      );
      this.state.artists.forEach((artist, count) => {
        tbody.push(
          <tr>
            <td>{++count}</td>
            <td>
              <Image
                className="avatar"
                src={
                  artist.profilePic
                    ? artist.profilePic
                    : "../images/avatar_default.png"
                }
              />
            </td>
            <td>{artist.name}</td>
            <td>{artist.title}</td>
            <td>{artist.location}</td>
            <td>{artist.websiteUrl}</td>
            <td>{artist.bio}</td>
            <td className="td-btn">
              <div>
                {artist.approved ? (
                  <button id={artist.userId} onClick={this.blockArtist}>
                    Block
                  </button>
                ) : (
                  <button id={artist.userId} onClick={this.approveArtist}>
                    Approve
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      });
    } else if (this.state.selectedItem == "artlover") {
      tableContent.push(
        <thead>
          <tr>
            <td>#</td>
            <td>Profile Pic</td>
            <td>Name</td>
            <td>Title</td>
            <td>Location</td>
            <td>Website</td>
            <td>Bio</td>
            <td>Action</td>
          </tr>
        </thead>
      );
      this.state.artlovers.forEach((artlover, count) => {
        tbody.push(
          <tr>
            <td>{++count}</td>
            <td>
              <Image
                className="avatar"
                src={
                  artlover.profilePic
                    ? artlover.profilePic
                    : "../images/avatar_default.png"
                }
              />
            </td>
            <td>{artlover.name}</td>
            <td>{artlover.title}</td>
            <td>{artlover.location}</td>
            <td>{artlover.websiteUrl}</td>
            <td>{artlover.bio}</td>
            <td className="td-btn">
              {artlover.approved ? (
                <button id={artlover.userId} onClick={this.blockArtist}>
                  Block
                </button>
              ) : (
                <button id={artlover.userId} onClick={this.approveArtist}>
                  Approve
                </button>
              )}
            </td>
          </tr>
        );
      });
    } else if (this.state.selectedItem == "posts") {
      tableContent.push(
        <thead>
          <tr>
            <td>#</td>
            <td>User Name</td>
            <td>Image</td>
            <td>Title</td>
            <td>Type</td>
            <td>Dimension</td>
            <td>Media</td>
            <td>Description</td>
            <td>Action</td>
          </tr>
        </thead>
      );
      this.state.posts.forEach((post, count) => {
        if(this.state.selectedValue){          
          if((type == post.postType.toLowerCase() && (style == ''||style == 'a') && 
            (dimension == '' || dimension == 'a')) ||
            (type == post.postType.toLowerCase() && style == post.postStyle.toLowerCase() 
            && (dimension == '' || dimension == 'a')) ||
            (type == post.postType.toLowerCase() && (style == ''||style == 'a') 
            && dimension == post.postDim) ||

            ((type == ''|| type == 'a') && style == post.postStyle.toLowerCase() && 
            (dimension == '' || dimension== 'a')) ||
            ((type == ''||type == 'a') && style == post.postStyle.toLowerCase() && dimension == post.postDim) ||

            ((type == ''||type == 'a') && (style == ''||style == 'a') && dimension == post.postDim) ||                  

            (this.state.selectedValue.type == post.postType.toLowerCase() &&
            this.state.selectedValue.style ==
            post.postStyle.toLowerCase() &&
            this.state.selectedValue.dimension == post.postDim)){
              tbody.push(
                <tr>
                  <td>{++count}</td>
                  <td>{post.userName}</td>
                  <td>
                    <Image src={post.postImage} width="40" height="40" />
                  </td>
                  <td>{post.postTitle}</td>
                  <td>{post.postType}</td>
                  <td>
                    {post.postLen} x {post.postWid} x {post.postHeight}
                  </td>
                  <td>{post.postArtMed}</td>
                  <td>{post.postDesc}</td>
                  <td className="td-btn">
                    {post.publish ? (
                      <button
                        id={post._id}
                        onClick={this.blockPost}
                        style={{ marginRight: "10px" }}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        id={post._id}
                        onClick={this.publishPost}
                        style={{ marginRight: "10px" }}
                      >
                        Publish
                      </button>
                    )}
                    <button id={post._id} onClick={this.deletePost}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }
            else if((type == 'a' && style == 'a' && dimension == 'a') || 
                (type == 'a' && style == '' && dimension == '') ||
                (type == 'a' && style == 'a' && dimension == '') || 
                (type == 'a' && style == '' && dimension == 'a') ||
                (type == '' && style == 'a' && dimension == '') ||
                (type == '' && style == 'a' && dimension == 'a') ||
                (type == '' && style == '' && dimension == 'a') ){
                  tbody.push(
                    <tr>
                      <td>{++count}</td>
                      <td>{post.userName}</td>
                      <td>
                        <Image src={post.postImage} width="40" height="40" />
                      </td>
                      <td>{post.postTitle}</td>
                      <td>{post.postType}</td>
                      <td>
                        {post.postLen} x {post.postWid} x {post.postHeight}
                      </td>
                      <td>{post.postArtMed}</td>
                      <td>{post.postDesc}</td>
                      <td className="td-btn">
                        {post.publish ? (
                          <button
                            id={post._id}
                            onClick={this.blockPost}
                            style={{ marginRight: "10px" }}
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            id={post._id}
                            onClick={this.publishPost}
                            style={{ marginRight: "10px" }}
                          >
                            Publish
                          </button>
                        )}
                        <button id={post._id} onClick={this.deletePost}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );        
                }
        }        
        else{
          tbody.push(
            <tr>
              <td>{++count}</td>
              <td>{post.userName}</td>
              <td>
                <Image src={post.postImage} width="40" height="40" />
              </td>
              <td>{post.postTitle}</td>
              <td>{post.postType}</td>
              <td>
                {post.postLen} x {post.postWid} x {post.postHeight}
              </td>
              <td>{post.postArtMed}</td>
              <td>{post.postDesc}</td>
              <td className="td-btn">
                {post.publish ? (
                  <button
                    id={post._id}
                    onClick={this.blockPost}
                    style={{ marginRight: "10px" }}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    id={post._id}
                    onClick={this.publishPost}
                    style={{ marginRight: "10px" }}
                  >
                    Publish
                  </button>
                )}
                <button id={post._id} onClick={this.deletePost}>
                  Delete
                </button>
              </td>
            </tr>
          );
        }        
      });
    } else if (this.state.selectedItem == "blogposts") {
      tableContent.push(
        <thead>
          <tr>
            <td>#</td>
            <td>User Name</td>
            <td>Image</td>
            <td>Title</td>
            <td>Description</td>
            <td>Action</td>
          </tr>
        </thead>
      );
      this.state.blogposts.forEach((blogpost, count) => {
        tbody.push(
          <tr>
            <td>{++count}</td>
            <td>{blogpost.userName}</td>
            <td>
              {blogpost.postImage ? (
                <Image src={blogpost.postImage} width="40" height="40" />
              ) : (
                "No Image"
              )}
            </td>
            <td>{blogpost.postTitle}</td>
            <td>{blogpost.postDesc}</td>
            <td className="td-btn">
              <button id={blogpost._id} onClick={this.deletePost}>
                Delete
              </button>
            </td>
          </tr>
        );
      });
    }
    if (this.state.selectedItem == "dashboard") {
      this.state.blogposts.forEach((blogpost, count) => {
        if (count >= 5) {
          return;
        }
        content.push(
          <Row className="blogpost-container">
            <Col lg={3}>
              {blogpost.postImage ? (
                <Image src={blogpost.postImage} className="blogpost-image" />
              ) : (
                <div className="blogpost-image">
                  <p>No Image</p>
                </div>
              )}
            </Col>
            <Col lg={9} className="blogpost-content">
              <div>{blogpost.postTitle}</div>
              <div>
                <p>
                  {blogpost.userName} | {blogpost.createdDate}
                </p>
              </div>
              <div
                style={{
                  paddingTop: "10px",
                  fontSize: "14px",
                  letterSpacing: "0.25px",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                {blogpost.postDesc}
              </div>
            </Col>
          </Row>
        );
      });
      this.state.artists.forEach((artist, count) => {
        if (count >= 5) {
          return;
        }
        artistHtml.push(
          <tr>
            <td>{++count}</td>
            <td>
              <Image
                className="avatar"
                src={
                  artist.profilePic
                    ? artist.profilePic
                    : "../images/avatar_default.png"
                }
              />
            </td>
            <td>{artist.name}</td>
          </tr>
        );
      });
      this.state.artlovers.forEach((artlover, count) => {
        if (count >= 5) {
          return;
        }
        artloverHtml.push(
          <tr>
            <td>{++count}</td>
            <td>
              <Image
                className="avatar"
                src={
                  artlover.profilePic
                    ? artlover.profilePic
                    : "../images/avatar_default.png"
                }
              />
            </td>
            <td>{artlover.name}</td>
          </tr>
        );
      });
    }
    if (this.state.isLoaded) {
      return (
        <React.Fragment>
          <main className="admin">
            <Container fluid>
              <Row>
                <Col
                  lg={2}
                  className="px-0 bg-white"
                  style={{
                    boxShadow: "0 4px 21px rgb(19 0 72 / 13%)",
                    minHeight: "100vh",
                    paddingRight: "20px !important",
                  }}
                >
                  <div style={{ padding: "10px 10px", textAlign: "center" }}>
                    <Image
                      src="../images/regestra_logo-1.svg"
                      style={{ width: "50px" }}
                    />
                  </div>
                  <ListGroup>
                    <ListGroup.Item
                      id="dashboard"
                      active
                      onClick={this.selectItem}
                    >
                      Dashboard
                    </ListGroup.Item>
                    <ListGroup.Item id="artist" onClick={this.selectItem}>
                      Artist
                    </ListGroup.Item>
                    <ListGroup.Item id="artlover" onClick={this.selectItem}>
                      Art Lover
                    </ListGroup.Item>
                    <ListGroup.Item id="posts" onClick={this.selectItem}>
                      Art Media
                    </ListGroup.Item>
                    <ListGroup.Item id="blogposts" onClick={this.selectItem}>
                      Social Posts
                    </ListGroup.Item>
                    <ListGroup.Item id="edit profile" onClick={this.selectItem}>
                      Edit Profile
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col lg={10} className="h-100vh py-4 right-main-col">
                  <Row className="logout-container p-2">
                    <button className="purple-grad" onClick={this.logout}>
                      Logout
                    </button>
                  </Row>
                  <Row className="artist-dash" style={{
                      display:
                        this.state.selectedItem == "dashboard"
                          ? "none"
                          : "",
                    }}>
                    <div>                    
                      <h1 style={{ textTransform: "capitalize" }}>
                        {this.state.selectedItem}
                      </h1>
                    </div>                     
                    <Col lg={12}>
                    <Row style={{
                          display:
                            this.state.selectedItem == "edit profile"
                              ? ""
                              : "none",
                        }}>
                      <Col className="pt-2">
                      {this.state.alertHtml}
                        <form onSubmit={this.updateAdminProfile}>                        
                          <input
                            className="block w-50"
                            type="text"
                            placeholder="Email"
                            name="newemail"
                            onChange={this.myChangeHandler}
                            value={this.state.newemail ? this.state.newemail : ''}
                          />
                          <input
                            className="block w-50"
                            type="password"
                            placeholder="Old Password"
                            name="oldpassword"
                            onChange={this.myChangeHandler}
                          />
                          <input
                            className="block w-50"
                            type="password"
                            placeholder="New Password"
                            name="newpassword"
                            onChange={this.myChangeHandler}
                          />
                          <button className="button w-25 purple-grad block" type="submit">
                            SUBMIT
                          </button>
                        </form>          
                      </Col>
                    </Row>
                    <Row style={{
                      display:
                        this.state.selectedItem == "dashboard" ||
                        this.state.selectedItem == "artlover" ||
                        this.state.selectedItem == "artist" ||
                        this.state.selectedItem == "blogposts" ||
                        this.state.selectedItem == "edit profile"
                          ? "none"
                          : "",
                    }}>
                      <DropDown selected={this.dropDownChanged} />                    
                    </Row>                       
                      <Table
                        hover
                        size="sm"
                        style={{
                          display:
                            this.state.selectedItem == "dashboard"
                              ? "none"
                              : "",
                        }}
                      >
                        {tableContent}
                        <tbody>{tbody}</tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display:
                        this.state.selectedItem == "dashboard" ? "" : "none",
                    }}
                  >
                    <h1>Dashboard</h1>
                  </Row>
                  <Row
                    className="dashboard"
                    style={{
                      display:
                        this.state.selectedItem == "dashboard" ? "" : "none",
                    }}
                  >
                    <Col
                      lg={3}
                      className="dashboard-col1"
                      id="artist"
                      onClick={this.selectItem}
                    >
                      <div id="artist" onClick={this.selectItem}>
                        Artist
                      </div>
                      <div id="artist" onClick={this.selectItem}>
                        <p id="artist" onClick={this.selectItem}>
                          {this.state.artists.length}
                        </p>
                      </div>
                    </Col>
                    <Col
                      lg={3}
                      className="dashboard-col1"
                      id="artlover"
                      onClick={this.selectItem}
                    >
                      <div id="artlover" onClick={this.selectItem}>
                        Art Lover
                      </div>
                      <div id="artlover" onClick={this.selectItem}>
                        <p id="artlover" onClick={this.selectItem}>
                          {this.state.artlovers.length}
                        </p>
                      </div>
                    </Col>
                    <Col
                      lg={3}
                      className="dashboard-col1"
                      id="posts"
                      onClick={this.selectItem}
                    >
                      <div id="posts" onClick={this.selectItem}>
                        Art Media
                      </div>
                      <div id="posts" onClick={this.selectItem}>
                        <p id="posts" onClick={this.selectItem}>
                          {this.state.posts.length}
                        </p>
                      </div>
                    </Col>
                    <Col
                      lg={3}
                      className="dashboard-col1"
                      id="blogposts"
                      onClick={this.selectItem}
                    >
                      <div id="blogposts" onClick={this.selectItem}>
                        Social Posts
                      </div>
                      <div id="blogposts" onClick={this.selectItem}>
                        <p id="blogposts" onClick={this.selectItem}>
                          {this.state.blogposts.length}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display:
                        this.state.selectedItem == "dashboard" ? "" : "none",
                    }}
                  >
                    <Col lg={12} className="latest-blogposts">
                      <div>
                        <h1>Latest Blog Posts</h1>
                      </div>
                      {/* <Table hover size="sm">
                              {tableContent}
                              <tbody>
                                  {tbody}
                              </tbody>
                          </Table> */}
                      <div id="content">{content}</div>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display:
                        this.state.selectedItem == "dashboard" ? "" : "none",
                    }}
                  >
                    <Col lg={6} className="artist-dash">
                      <div>
                        <h1>Artists</h1>
                      </div>
                      <Table hover size="sm">
                        <thead>
                          <tr>
                            <td>#</td>
                            <td>Profile Pic</td>
                            <td>Name</td>
                          </tr>
                        </thead>
                        <tbody>{artistHtml}</tbody>
                      </Table>
                    </Col>
                    <Col className="artist-dash">
                      <div>
                        <h1>Art Lovers</h1>
                      </div>
                      <Table hover size="sm">
                        <thead>
                          <tr>
                            <td>#</td>
                            <td>Profile Pic</td>
                            <td>Name</td>
                          </tr>
                        </thead>
                        <tbody>{artloverHtml}</tbody>
                      </Table>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </main>
        </React.Fragment>
      );
    } else if (!this.state.isLoaded && this.id != null && this.state.isAdmin) {
      return (
        <React.Fragment>
          <main className="admin">
            <Container fluid>
              <Row className="logout-container p-2">
                <button className="purple-grad" onClick={this.logout}>
                  Logout
                </button>
              </Row>
              <Row>
                <Col
                  lg={2}
                  className="px-0 bg-white"
                  style={{ boxShadow: "0 4px 21px rgb(19 0 72 / 13%)" }}
                >
                  <ListGroup>
                    <ListGroup.Item
                      id="artist"
                      active
                      onClick={this.selectItem}
                    >
                      Artist
                    </ListGroup.Item>
                    <ListGroup.Item id="artlover" onClick={this.selectItem}>
                      Art Lover
                    </ListGroup.Item>
                    <ListGroup.Item id="posts" onClick={this.selectItem}>
                      Posts
                    </ListGroup.Item>
                    <ListGroup.Item id="blogposts" onClick={this.selectItem}>
                      Blog Posts
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col
                  lg={10}
                  className="h-100vh py-4 bg-white"
                  style={{ boxShadow: "0 4px 21px rgb(19 0 72 / 13%)" }}
                >
                  <Loader />
                </Col>
              </Row>
            </Container>
          </main>
        </React.Fragment>
      );
    } else if (this.id == null) {
      return (
        <React.Fragment>
          <div id="login" className="admin">
            <div className="modal d-flex align-items-center">
              {/* <div className="modal-head">
                        <div className="logo-white"></div>
                        <p className="modal-tagline">
                        CREATING AN ART MARKET YOU CAN TRUST
                        </p>
                        <div className="main-illustration"></div>
                    </div> */}
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
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Loader />
        </React.Fragment>
      );
    }
  }
}

export default Admin;
