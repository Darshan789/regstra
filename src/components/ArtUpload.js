import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import AutoComplete from "./AutoComplete";
import axios from "axios";

class ArtUpload extends Component {
  id = localStorage.getItem("id");
  tagsArr = ["Moon", "Sun", "Painting", "Play"];
  imgArray = [];
  constructor(props) {
    super(props);
    this.state = {
      userId: this.id,
      userName: props.name,
      postImage: "",
      postTitle: "",
      postType: "",
      postLen: "",
      postHeight: "",
      postWid: "",
      postDim: "",
      postArtMed: "",
      postStyle: "",
      postTags: "",
      postDesc: "",
      postLikes: 0,
      likedBy: "",
      previewImage: "",
      isTags: false,
    };

    fetch("http://localhost:4000/getAllTags", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => {
      data.json().then((finalData) => {
        finalData.forEach((element) => {
          element.length === 0 ? this.tagsArr : this.tagsArr.push(element);
        });
      });
    });
  }

  mySubmitHandler = (event) => {
    if (typeof event != "undefined") {
      event.preventDefault();
    }
    this.setState({ previewImage: "" });
    delete this.state.previewImage;
    fetch("http://localhost:4000/uploadPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then((data) => {
      data.json().then((finalData) => {
        // console.log(finalData);
        location.replace("/profile");
      });
    });
  };

  artUploads = (event) => {
    event.preventDefault();
    const postImgUploads = this.state.postImage.map((artImage) => {
      const data = new FormData();
      data.append("image", artImage, artImage.name);
      return axios
        .post("http://localhost:4000/upload", data)
        .then((response) => {
          this.setState({ postImage: response.data.imageUrl });
        });
    });
    axios
      .all(postImgUploads)
      .then(() => {
        console.log("done");
        this.mySubmitHandler(event);
      })
      .catch((err) => console.log(err));
  };

  imgUploadHandler = (event) => {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.setState({ previewImage: reader.result.toString() });
    };
    let images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter((image) =>
      image.name.match(/\.(jpg|jpeg|png|gif)$/)
    );
    this.setState({ postImage: images });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
    if (event.target.name == "postWid") {
      if (parseInt(event.target.value) < 20) {
        this.setState({ postDim: "small" });
      }
      if (
        parseInt(event.target.value) > 20 &&
        parseInt(event.target.value) < 60
      ) {
        this.setState({ postDim: "medium" });
      }
      if (parseInt(event.target.value) > 60) {
        this.setState({ postDim: "large" });
      }
    }
    console.log(this.state);
  };

  render() {
    let myTags = [];
    this.tagsArr.forEach((tag) =>
      myTags.push(<option value={tag}>{tag}</option>)
    );
    return (
      <React.Fragment>
        <main className="small-container flex-col">
          <section></section>
          <section>
            <form onSubmit={this.artUploads}>
              <div className="image-upload-wrap panel">
                <div
                  className="grey-light-bg flex-col-center h-350 small-p-margins"
                  style={{
                    backgroundImage: "url(" + this.state.previewImage + ")",
                    backgroundSize: "cover",
                  }}
                >
                  <input
                    className="file-upload-input"
                    type="file"
                    onChange={this.imgUploadHandler}
                    accept="image/*"
                  />
                  <div
                    className="upload_icons"
                    style={
                      this.state.postImage != "" ? { display: "none" } : {}
                    }
                  >
                    <span className="icon-large upload-highlighted"></span>
                    <h3>Drag and drop to upload</h3>
                    <p>or</p>
                    <h3>click to choose a file from your device</h3>
                  </div>
                </div>
                <div
                  style={{
                    backgroundImage: "url(" + this.state.postImage + ")",
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
              <div className="file-upload-content">
                <img
                  className="file-upload-image panel"
                  src="#"
                  alt="my artwork"
                />
              </div>
              <input
                className="block"
                type="text"
                placeholder="Title"
                name="postTitle"
                onChange={this.myChangeHandler}
              />
              <div className="flex-row-sb input-section">
                <span className="input-container">
                  <input
                    type="radio"
                    name="postType"
                    id="radio-1"
                    value="Painting"
                    onChange={this.myChangeHandler}
                  />
                  <label htmlFor="radio-1">
                    <span className="radio">Painting</span>
                  </label>
                </span>
                <span className="input-container">
                  <input
                    type="radio"
                    name="postType"
                    id="radio-2"
                    value="Sculpture"
                    onChange={this.myChangeHandler}
                  />
                  <label htmlFor="radio-2">
                    <span className="radio">Sculpture</span>
                  </label>
                </span>
                <span className="input-container">
                  <input
                    type="radio"
                    name="postType"
                    id="radio-3"
                    value="Mixed Media"
                    onChange={this.myChangeHandler}
                  />
                  <label htmlFor="radio-3">
                    <span className="radio">Mixed media</span>
                  </label>
                </span>
                <span className="input-container">
                  <input
                    type="radio"
                    name="postType"
                    id="radio-4"
                    value="Digital"
                    onChange={this.myChangeHandler}
                  />
                  <label htmlFor="radio-4">
                    <span className="radio">Digital</span>
                  </label>
                </span>
              </div>
              <div className="flex-row-sb">
                <input
                  className="block"
                  type="text"
                  name="postLen"
                  placeholder="Length (in)"
                  onChange={this.myChangeHandler}
                />
                <div className="mr-20 ml-20 txt-l txt-grey">&times;</div>
                <input
                  className="block"
                  type="text"
                  name="postHeight"
                  placeholder="Height (in)"
                  onChange={this.myChangeHandler}
                />
                <div className="mr-20 ml-20 txt-l txt-grey">&times;</div>
                <input
                  className="block"
                  type="text"
                  name="postWid"
                  placeholder="Width (in)"
                  onChange={this.myChangeHandler}
                />
              </div>
              <input
                className="block"
                type="text"
                name="postArtMed"
                placeholder="Art media"
                onChange={this.myChangeHandler}
              />
              <select
                className="block"
                name="postStyle"
                onChange={this.myChangeHandler}
              >
                <option value="abstract">Abstract</option>
                <option value="b-w">Black & White</option>
                <option selected value="collage">
                  Collage
                </option>
                <option value="figurative">Figurative Art</option>
                <option value="geomatric">Geomatric</option>
                <option value="impression">Impressionistic</option>
              </select>

              <input
                list="suggestions"
                name="postTags"
                className="block"
                onChange={this.myChangeHandler}
                type="text"
                id="tag"
              />
              <datalist id="suggestions">{myTags}</datalist>
              <textarea
                name="postDesc"
                rows="6"
                placeholder="Description"
                onChange={this.myChangeHandler}
              ></textarea>
              <div className="mt-20">
                <button className="purple-grad">Publish</button>
                <button className="ml-20">Cancel</button>
              </div>
            </form>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default ArtUpload;
