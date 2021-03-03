import React, { Component, useState } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";

class editProfileUser extends Component {
  id = localStorage.getItem("id");
  sectionStyle;
  image;
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
      coverPic: props.coverPic,
      followers: 0,
      followedBy: "",
      following: "",
    };
  }

  componentDidMount() {
    $("#upload_cover").on("click", function () {
      $("#imgupload").trigger("click");
    });
  }

  updateProfile(event) {
    console.log(this.state);
    if (typeof event != "undefined") {
      event.preventDefault();
    }
    //this.setState({ userId: this.id });
    fetch("http://localhost:4000/updateUserDetails", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then((data) => {
      // console.log(data);
      data.json().then((finalData) => {
        location.replace("/profile");
      });
    });
  }

  profilePicUpload = (event) => {
    let images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter((image) =>
      image.name.match(/\.(jpg|jpeg|png|gif)$/)
    );
    // let message = `${images.length} valid image(s) selected`;
    this.setState({ profilePic: images });
  };

  uploadImages = (event) => {
    event.preventDefault();

    if (Array.isArray(this.state.profilePic)) {
      const profileUploads = this.state.profilePic.map((image) => {
        const data = new FormData();
        data.append("image", image, image.name);
        return axios
          .post("http://localhost:4000/upload", data)
          .then((response) => {
            this.setState({ profilePic: response.data.imageUrl });
          });
      });
      axios
        .all(profileUploads)
        .then(() => {
          console.log("done");
          this.updateProfile(event);
        })
        .catch((err) => console.log(err));
    } else if (Array.isArray(this.state.coverPic)) {
      const coverUploads = this.state.coverPic.map((coverImage) => {
        const data = new FormData();
        data.append("image", coverImage, coverImage.name);
        return axios
          .post("http://localhost:4000/upload", data)
          .then((response) => {
            this.setState({ coverPic: response.data.imageUrl });
          });
      });
      axios
        .all(coverUploads)
        .then(() => {
          console.log("done");
          this.updateProfile(event);
        })
        .catch((err) => console.log(err));
    } else {
      this.updateProfile(event);
    }
  };

  coverPicUpload = (event) => {
    let images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter((image) =>
      image.name.match(/\.(jpg|jpeg|png|gif)$/)
    );
    // let message = `${images.length} valid image(s) selected`;
    this.setState({ coverPic: images });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  render() {
    return (
      <React.Fragment>
        <main>
          <div
            className="profile-head bg-photo34"
            style={{ backgroundImage: "url(" + this.state.coverPic + ")" }}
          >
            <div className="profile-info flex-col">
              <button id="upload_cover" type="submit">Upload cover image</button>
              <input
                type="file"
                id="imgupload"
                name="coverPicUpload"
                onChange={this.coverPicUpload}
                style={{ display: "none" }}
              />
            </div>
            <div className="overlay-dark"></div>
          </div>

          <section className="small-container mt-40">
            <form onSubmit={this.uploadImages}>
              <div className="grid-33-67">
                <div className="image-upload-wrap flex-col">
                  <div className="avatar-upload relative">
                    <input
                      className="file-upload-input"
                      type="file"
                      onChange={this.profilePicUpload}
                      accept="image/*"
                    />
                    {/* <Image images ={this.image}/> */}
                    {/* <img src={this.state.file} /> */}
                    <div
                      style={{
                        backgroundImage: "url(" + this.state.profilePic + ")",
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <input
                    className="block mb-3rem"
                    type="text"
                    placeholder="Name"
                    onChange={this.myChangeHandler}
                    name="name"
                    value={this.state.name}
                  />
                  <input
                    className="block mb-3rem"
                    type="text"
                    placeholder="Title"
                    onChange={this.myChangeHandler}
                    name="title"
                    value={this.state.title}
                  />
                  <input
                    className="block mb-3rem"
                    type="text"
                    placeholder="Location"
                    name="location"
                    onChange={this.myChangeHandler}
                    value={this.state.location}
                  />
                  <input
                    className="block"
                    type="text"
                    placeholder="Website URL"
                    name="websiteUrl"
                    onChange={this.myChangeHandler}
                    value={this.state.websiteUrl}
                  />
                </div>
              </div>

              <textarea
                rows="6"
                placeholder="Bio"
                name="bio"
                className="mt-40"
                onChange={this.myChangeHandler}
                value={this.state.bio}
              ></textarea>
              <div className="flex-row-sb">
                <span className="icon-round">
                  <i className="fab fa-behance white"></i>
                </span>
                <input
                  className="block ml-10"
                  type="text"
                  placeholder="Behance URL"
                  name="behanceUrl"
                  onChange={this.myChangeHandler}
                  value={this.state.behanceUrl}
                />
              </div>
              <div className="flex-row-sb">
                <span className="icon-round">
                  <i className="fab fa-dribbble white"></i>
                </span>
                <input
                  className="block ml-10"
                  type="text"
                  placeholder="Dribbble Username"
                  name="dribbleUsername"
                  onChange={this.myChangeHandler}
                  value={this.state.dribbleUsername}
                />
              </div>
              <div className="flex-row-sb">
                <span className="icon-round">
                  <i className="fab fa-medium white"></i>
                </span>
                <input
                  className="block ml-10"
                  type="text"
                  placeholder="Medium URL"
                  name="mediumUrl"
                  onChange={this.myChangeHandler}
                  value={this.state.mediumUrl}
                />
              </div>
              <div className="flex-row-sb">
                <span className="icon-round">
                  <i className="fab fa-twitter white"></i>
                </span>
                <input
                  className="block ml-10"
                  type="text"
                  name="twitterUsername"
                  placeholder="Twitter Username"
                  onChange={this.myChangeHandler}
                  value={this.state.twitterUsername}
                />
              </div>
              <button className="purple-grad mt-20" type="submit">
                Save profile
              </button>
            </form>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default editProfileUser;
