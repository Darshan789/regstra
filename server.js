const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const { Db } = require("mongodb");
const usersModel = require("./src/models/users.model");
const { json } = require("body-parser");
const userDetailsModel = require("./src/models/userDetails.model");
const MessagesModel = require("./src/models/messaging.model");
const postsModel = require("./src/models/posts.model");
const { count } = require("./src/models/users.model");
const messagingModel = require("./src/models/messaging.model");
const PORT = 4000;
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use('/.netlify/functions/server', router);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static("./images"));
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

app.use(cors());

var connection = mongoose.connect(
  "mongodb+srv://registra_user:R3g_user_db@cluster0.8sq3b.mongodb.net/test_db?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

Schema = mongoose.Schema;
mySchema = new Schema({ name: { type: String } }, { versionKey: false });
var model = mongoose.model("test_collection", mySchema, "test_collection");

app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({ imageUrl: "./images/uploads/" + req.file.filename });
  } else {
    res.status(409).json("No files Uploaded");
  }
});

app.post("/signup", function (req, res) {
  let signup = new usersModel(req.body);
  signup
    .save()
    .then((signup) => {
      res.status(200).json({ user: "User Added Successfully", req: req.body });
    })
    .catch((err) => {
      res.status(400).send("User Not Added Successfully");
    });
});

app.post("/userid", function (req, res) {
  usersModel.find(req.body, (err, data) => {
    if (data.length >= 1) {
      res.json({ id: data[0].id, userType: data[0].type });
    } else {
      res.json({ error: "User not found" });
    }
  });
});

app.post("/getUser", function (req, res) {
  usersModel.find({ _id: req.body.userId }, (err, data) => {
    if (data.length >= 1) {
      res.json({ email: data[0].email });
    } else {
      res.json({ error: "User not found" });
    }
  });
});

app.post("/emailCheck", function (req, res) {
  usersModel.find(req.body, (err, data) => {
    if (data.length >= 1) {
      res.json({ id: data[0].id });
    } else {
      res.json({ error: "User not found" });
    }
  });
});

app.get("/suggest", function (req, res) {
  model.find({}, function (err, data) {
    res.send(data);
  });
});

app.post("/getUserDetails", function (req, res) {
  let userId = req.body.userId;
  userDetailsModel.find({ userId: userId }, function (err, data) {
    res.send(data);
  });
});

app.post("/userDetails", function (req, res) {
  let userDetails = new userDetailsModel(req.body);
  userDetails
    .save()
    .then((userDetails) => {
      res.status(200).json({ user: "User Details Added Successfully" });
    })
    .catch((err) => {
      res.status(400).send("User Details Not Added Successfully");
    });
});

app.put("/updateUserDetails", function (req, res) {
  let userDetails = new userDetailsModel(req.body);
  userDetailsModel.updateOne(
    { userId: req.body.userId },
    req.body,
    function (err, data) {
      res.send(data);
    }
  );
});

app.post("/login", function (req, res) {
  usersModel.find(
    { email: req.body.email, password: req.body.password },
    function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
});

app.post("/getPostsSingleArtist", function (req, res) {
  postsModel.find({ userId: req.body.userId }, function (err, data) {
    res.send(data);
  });
});

app.post("/uploadPosts", function (req, res) {
  let model = new postsModel(req.body);
  model.save().then((posts) => {
    res.send(posts);
  });
});

app.post("/getUserPics", function (req, res) {
  userDetailsModel.find({ userId: req.body.userId }, function (err, data) {
    res.send(data);
  });
});

app.post("/getPostsPics", function (req, res) {
  postsModel.find({ userId: req.body.userId }, function (err, data) {
    res.send(data);
  });
});

app.get("/getAllPosts", function (req, res) {
  userDetailsModel
    .aggregate([
      {
        $lookup: {
          from: "Arts",
          localField: "userId",
          foreignField: "userId",
          as: "postData",
        },
      },
    ])
    .then((data) => {
      res.send(data);
    });
});

app.post("/getLikeCounts", function (req, res) {
  postsModel.find({ _id: req.body.postId }, function (err, data) {
    res.send(data);
  });
});

app.post("/getFollowCounts", function (req, res) {
  userDetailsModel.find({ userId: req.body.userId }, function (err, data) {
    res.send(data);
  });
});

app.put("/likedPost", function (req, res) {
  // let postDetails = new postsModel(req.body);
  postsModel.updateOne(
    { _id: req.body.postId },
    req.body.data,
    function (err, data) {
      res.send(data);
    }
  );
});

app.put("/followed", function (req, res) {
  // let postDetails = new postsModel(req.body);
  userDetailsModel.updateOne(
    { userId: req.body.userId },
    req.body.data,
    function (err, data) {
      res.send(data);
    }
  );
});

app.put("/following", function (req, res) {
  // let postDetails = new postsModel(req.body);
  userDetailsModel.updateOne(
    { userId: req.body.userId },
    req.body.data,
    function (err, data) {
      res.send(data);
    }
  );
});

app.get("/getArtists", function (req, res) {
  let artists = [];
  userDetailsModel.find({}, function (err, data) {
    data.forEach((singleData) => {
      artists.push(singleData.name);
    });
    res.send(artists);
  });
});

app.get("/getAllArtists", function (req, res) {
  userDetailsModel.find({}, function (err, data) {
    res.send(data);
  });
});

app.get("/getAllTags", function (req, res) {
  let tags = [];
  postsModel.find({}, function (err, data) {
    data.forEach((singleData) => {
      tags.push(singleData.postTags);
    });
    res.send(tags);
  });
});

app.post("/CheckMessages", function (req, res) {
  messagingModel.find({ $or: [ { messagingFrom: req.body.userId }, { messagingTo: req.body.userId } ] }, function (err, data) {
    res.send(data);
  });
});

app.post("/MessageUser", function (req, res) {
  let model = new messagingModel(req.body);
  model.save().then((message) => {
    res.send(message);
  });
});

app.put("/getFollowingPosts", function (req, res) {
  userDetailsModel
    .aggregate([
      { $match: { userId: req.body.userId } },
      {
        $lookup: {
          from: "Arts",
          localField: "userId",
          foreignField: "userId",
          as: "posts",
        },
      },
    ])
    .then((data) => res.send(data));
});

app.post('/getAllMessages', function(req, res){
  userDetailsModel
    .aggregate([
      { $match:  { $or: [ { userId: req.body.userId } ] }},
      {
        $lookup: {
          from: "Messages",
          localField: "userId",
          foreignField: "messagingFrom",
          as: "messageSent",
        },        
      },
      {
        $lookup: {
          from: "Messages",
          localField: "userId",
          foreignField: "messagingTo",
          as: "messageReceived",
        },
      },                  
    ])
    .then((data) => {
      res.send(data);
    });
});


app.post('/getBulkUsers', function(req,res){
  // res.send(req.body.data);  
  // userDetailsModel.find({userId:req.body.userId},function(err,data){
  //   res.send(data);
  // });
  userDetailsModel.aggregate([
    { $match: { userId: req.body.userId } },
    {
      $lookup: {
        from: "Messages",
        localField: "userId",
        foreignField: "messagingTo",
        as: "lastSentMessage",
      },
    },
    { 
      $addFields: {
        lastSentMessage: { $slice: ["$lastSentMessage", -1] }
      }
    },
    {
      $lookup: {
        from: "Messages",
        localField: "userId",
        foreignField: "messagingFrom",
        as: "lastReceivedMessage",
      },
    },
    { 
      $addFields: {
        lastReceivedMessage: { $slice: ["$lastReceivedMessage", -1] }
      }
    },    
  ]).then((data)=>{
    res.send(data);
  })
});


app.post('/changereadstatus',function(req, res){
  let count;
  count = messagingModel.countDocuments({
    status : { $in: ["unread"] },
    messagingFrom : { $in: [req.body.userId,req.body.senderId ] },
    messagingTo : { $in: [req.body.userId,req.body.senderId ] }}, function(err, data){
      res.status(200).json({ count:data });
    });  
  // console.log(count);
});


app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
