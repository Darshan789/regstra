import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";

class SocialBar extends Component {
  id = localStorage.getItem("id");
  constructor(props){
    super(props);
    this.state = {
      open:false,
      height:'55px',
      profilePic:props.profilePic,
      userName:props.name,
      postTitle:'',
      postDesc:'',
      artPostType:'2',
      postImage:'',
      postLikes: 0,
      likedBy: "",
      approved: props.approved,
      postData:[],
      isLoaded:false,
      isLoggedIn: false,
      currentDateTime: Date().toLocaleString()
    }
    if (this.id) {
      this.setState({ isLoggedIn: true });
    } else {
      this.setState({ isLoggedIn: false });
    }
    this.getBlogPosts();
  }

  

  getBlogPosts = () => {
    fetch('http://localhost:4000/getBlogPosts').then((data)=>{
      data.json().then((finalData)=>{
        this.setState({postData:finalData});
        this.setState({isLoaded:true});
        this.setState({open: false});
        this.setState({height: '55px'});
      })
    })
  }

  componentDidMount(){
    $('#file-upload-icon_for').on('click', function(){
      console.log('yes');
      $('#file-upload-input-for').trigger('click');
    });
  }

  postOptions = () => {
    this.setState({open: true});
    this.setState({height: '110px'});
  }

  myLikeHandler = (event) => {
    if (this.id) {
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
                fetch("http://localhost:4000/getBlogPosts")
                  .then((res) => res.json())
                  .then(
                    (result) => {
                      this.setState({
                        isLoaded: true,
                        postData: result,                        
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

  picUpload = (event) => {
    let images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter((image) =>
      image.name.match(/\.(jpg|jpeg|png|gif)$/)
    );
    // let message = `${images.length} valid image(s) selected`;
    this.setState({ postImage: images });
  };

  uploadImages = (event) => {
    event.preventDefault();
    if (Array.isArray(this.state.postImage)) {
      const profileUploads = this.state.postImage.map((image) => {
        const data = new FormData();
        data.append("image", image, image.name);
        return axios
          .post("http://localhost:4000/upload", data)
          .then((response) => {
            this.setState({ postImage: response.data.imageUrl });
          });
      });
      axios
        .all(profileUploads)
        .then(() => {
          console.log("done");
          this.postUpload(event);
        })
        .catch((err) => console.log(err));
    } else {
      this.postUpload(event);
    }
  };

  postUpload = (event) => {
    if (typeof event != "undefined") {
      event.preventDefault();
    }
    //this.setState({ userId: this.id });
    if((this.state.postTitle && this.state.postDesc) || this.state.postImage){
      fetch("http://localhost:4000/uploadPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId:this.id,
        userName:this.state.userName,
        postTitle : this.state.postTitle,
        postDesc : this.state.postDesc,
        postImage:this.state.postImage,
        artPostType:this.state.artPostType,
        postLikes: this.state.postLikes,
        likedBy: this.state.likedBy,
        createdDate : this.state.currentDateTime,
      }),
      }).then((data) => {
        // console.log(data);
        data.json().then((finalData) => {
          // location.replace("/profile");
          this.setState({
            postTitle:'',
            postDesc:'',
            postImage:'',            
          });
          this.getBlogPosts();
          $('[name="postTitle"]').val('')
          $('[name="postDesc"]').val('')
        });
      });
    }    
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });    
  };

  render() {
    const {isLoaded} = this.state;  
    let postArr = [];
    if(isLoaded){
      this.state.postData.forEach(user => {
        var checkLike = new RegExp(this.id, "g");
        let isLiked = user.likedBy.search(checkLike);
        let className = "login-trigger icon heart";
        if(isLiked === -1){
          className = "icon heart";
        }else{
          className = "icon heart-highlighted anim-pump";
        }
        let displayStyle = "block";
        let griClass = "panel-body grid-33-67";
        let postImage = user.postImage;
        if(user.postImage === ''){
          displayStyle = "none";
          postImage = '../images/articles/6.jpg'
        }
        if(user.artPostType == 2){
        postArr.push(
          <article className="panel">
              <div className="panel-head">
                <a className="no-decor" href="#">
                  <div className="flex-row-sb">
                    <Image src={user.userData[0].profilePic} className="avatar" />
                    <div>
                      <h3>{user.userData[0].name}</h3>
                      <p>{user.userData[0].title}</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className={griClass}>
                <Image src={postImage}/>
                <div>
                  <div>
                    <h3>
                      {user.postTitle}
                    </h3>
                    <p>
                      {user.postDesc}
                    </p>
                  </div>
                  <div className="panel-footer">
                    <a href="#">Read More</a>
                    <div className="relative" style={{display:this.state.approved ? "":"none"}}>
                      <div
                        className={className}
                        id={user._id}
                        name="like"
                        onClick={this.myLikeHandler}
                      ></div>
                      <span className="hearts-number">{user.postLikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>);
        }
      });
      return (
      <div className="social pos-bottom-bar">
        <div className="social-content p-0">
        {/* grid-fixed-auto */}
          <div className="relative">
            <section>
              <article className="panel panel-thin" style={{height : this.state.height}}>
                <form class="social-bar-collapse-form" onSubmit={this.uploadImages} style={{display:this.state.approved ? "":"none"}}>
                  <div className="flex-row-sb">
                    <div className="flex-row">
                      <Image src={
                        this.state.profilePic
                        ? "." + this.state.profilePic
                        : "../images/avatar_default.png"
                        } 
                        className="avatar" />
                      <input
                        type="text"
                        name="postTitle"
                        placeholder="Share an idea, article, thought..."
                        onClick = {this.postOptions}
                        onChange = {this.myChangeHandler}
                      />
                    </div>
                    <button>post</button>                  
                  </div>  
                  <Collapse in={this.state.open}>
                    <div className="social-bar-collapse">
                      <input
                        type="text"
                        name="postDesc"
                        placeholder="Summary"
                        onChange = {this.myChangeHandler}
                      />
                      <div class="pack_in_one_cover">
                      <i class="fas fa-image px-4 py-1" id="file-upload-icon_for"></i>
                      <input 
                        type="file" 
                        id='file-upload-input-for' 
                        name="postPhoto" 
                        onChange={this.picUpload}
                      />
                      </div>
                    </div>                  
                  </Collapse>                  
                </form>
              </article>            
              {postArr}         
            </section>
            <div className="social-handle"></div>
          </div>
        </div>
      </div>
    );
    }
    else{
      return (
      <div className="social pos-bottom-bar">
        <div className="social-content p-0">
          <div className="grid-fixed-auto relative">
            <aside className="panel article-min">
              <div className="article-min-cont">
                <Image src="../images/user1.jpeg" className="avatar" />
                <p className="">
                  What types of documents do museums ask for from donors and
                  dealers in addition to provenance and history?
                </p>
              </div>
              <div className="events hide">
                <h3>Upcoming events near you</h3>
                <ul className="txt-s">
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">
                        ARTS & LETTERS LIVE: LOU BERNEY...
                      </h4>
                      <p className="m-0">Dallas Museum of Art</p>
                      <time>10/07/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue2.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue3.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">DANCEAFRICA</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>10/05/2018 - 10/06/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue4.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">FIRST SONG: CHILDREN’S CHORUS...</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>09/30/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">
                        ARTS & LETTERS LIVE: LOU BERNEY...
                      </h4>
                      <p className="m-0">Dallas Museum of Art</p>
                      <time>10/07/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue2.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue3.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">DANCEAFRICA</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>10/05/2018 - 10/06/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue4.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">FIRST SONG: CHILDREN’S CHORUS...</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>09/30/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
            <section>
              <article className="panel panel-thin" style={{height : this.state.height}}>
                <form class="social-bar-collapse-form" onSubmit={this.uploadImages}>
                  <div className="flex-row-sb">
                    <div className="flex-row">
                      <Image src={
                        this.state.profilePic
                        ? "." + this.state.profilePic
                        : "../images/avatar_default.png"
                        } 
                        className="avatar" />
                      <input
                        type="text"
                        name="postTitle"
                        placeholder="Share an idea, article, thought..."
                        onClick = {this.postOptions}
                        onChange = {this.myChangeHandler}
                      />
                    </div>
                    <button>post</button>                  
                  </div>  
                  <Collapse in={this.state.open}>
                    <div className="social-bar-collapse">
                      <input
                        type="text"
                        name="postDesc"
                        placeholder="Summary"
                        onChange = {this.myChangeHandler}
                      />
                      <i class="fas fa-image px-4 py-1" id="file-upload-icon"></i>
                      <input 
                        type="file" 
                        id='file-upload-input' 
                        name="postPhoto" 
                        style={{ display: "none" }} 
                        onChange={this.picUpload}
                      />
                    </div>                  
                  </Collapse>                  
                </form>
              </article>
            <article className="panel">
                <div className="panel-head">
                  <a className="no-decor" href="#">
                    <div className="flex-row-sb">
                      <Image src="../images/user1.jpeg" className="avatar" />
                      <div>
                        <h3>Joan Cox</h3>
                        <p>Oil Painting Artist</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="panel-body grid-33-67">
                  <Image src="../images/articles/6.jpg" />
                  <div>
                    <div>
                      <h3>
                        What types of documents do museums ask for from donors
                        and dealers in addition to provenance and history?
                      </h3>
                      <p>
                        I think that some important overlooked documents in a
                        museum registrars toolbox would be documents related to
                        the objects. Aenean commodo ligula...
                      </p>
                    </div>
                    <div className="panel-footer">
                      <a href="#">Read More</a>
                      <div className="relative">
                        <div className="icon heart"></div>
                        <span className="hearts-number hide"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>              
            </section>
            <div className="social-handle"></div>
          </div>
        </div>
      </div>
    );
    }


    
  }
}

export default SocialBar;
