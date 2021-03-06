// 'use strict';
// const serverless = require('serverless-http');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const { Db } = require("mongodb");
const nodemailer = require("nodemailer");
const usersModel = require("./src/models/users.model");
const { json } = require("body-parser");
const userDetailsModel = require("./src/models/userDetails.model");
const MessagesModel = require("./src/models/messaging.model");
const postsModel = require("./src/models/posts.model");
const { count } = require("./src/models/users.model");
const messagingModel = require("./src/models/messaging.model");
const notificationModel = require("./src/models/notifications.model");
const PORT = 4000;
// app.use(bodyParser.json());
//const router = express.Router();
// app.use('/.netlify/functions/server', router);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

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

app.get("/getBlogPosts", function (req, res) {
  postsModel.aggregate([
    { $sort : {createdDate:-1} },
    {
      $lookup:
        {
          from: "userDetails",
          localField: "userId",
          foreignField: "userId",
          as: "userData"
        }
   }
 ]).then((data) => res.send(data));
  // postsModel.find({artPostType:2},function(arr,data){res.send(data);}).sort({createdDate:-1});
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

app.post('/postNotification', function(req,res){
  let notifications = new notificationModel(req.body);
  notifications.save()
    .then((notification) => {
      res.status(200).json({ message: "Notification Added Successfully", req: req.body });
    })
    .catch((err) => {
      res.status(400).send("Notification Not Added Successfully");
    });
});

app.post('/getNotifications', function(req,res){
  // notificationModel.find({to:req.body.userId},function(err,data){
  //   res.send(data);
  // });
  notificationModel.aggregate([
      { $match: { to: req.body.userId } },
      {
        $lookup: {
          from: "userDetails",
          localField: "from",
          foreignField: "userId",
          as: "user",
        },
      },
    ])
    .then((data) => res.send(data));

});

app.post('/deleteNotification',function(req,res){
  notificationModel.deleteOne({_id:req.body.id}).then((data)=>{
    res.send(data);
  })
});

app.post('/checkAdmin',function(req,res){
  usersModel.find({ $and: [ { _id: req.body.id }, {type:'user0'} ] }).then((data)=>{
    res.send(data);
  })
});

// app.put('/updateAdminDetails',function())

app.put("/updateAdminDetails", function (req, res) {
  let users = new usersModel(req.body);
  usersModel.updateOne(
    { email: req.body.oldemail },
    users,
    function (err, data) {
      res.send(data);
    }
  );
});

app.put('/approveUser',function(req,res){
  let userDetails = new userDetailsModel(req.body);
  userDetailsModel.updateOne(
    { userId: req.body.userId },
    req.body,
    function (err, data) {
      res.send(data);
    }
  );
});

app.put('/publishPost',function(req,res){  
  postsModel.findByIdAndUpdate(req.body._id,
    {$set:{publish:req.body.publish}},
    function(err,data){
      res.send(data);
    }
  )
});

app.post('/deletePost',function(req,res){
  postsModel.deleteOne({_id:req.body._id},function(err,data){
    res.send(data);
  })
});

app.get('/getOnlyArtists',function(req,res){
  userDetailsModel.aggregate([
    {
      $lookup: {
        from: "users",        
        let: { "id": "$userId"},
        pipeline: [          
          { $match: { $expr: { $eq: [ '$_id',{$toObjectId:"$$id"}] }}},
          { $project: { type: 1 }}
        ],
        as: "user",
      },
    },  
  ]).then((data)=>res.send(data));
});


app.get('/getOnlyPosts',function(req,res){
  postsModel.find({artPostType:'1'},function(err,data){
    res.send(data);
  });
});

app.get('/getOnlyBlogPosts',function(req,res){  
  // postsModel.find({artPostType:"2"},function(err,data){
  //   res.send(data);
  // })
  postsModel.aggregate([
    {$match:{artPostType:"2"}},
    { $sort : {createdDate:-1}}
  ]).then(data=>{
    res.send(data);
  });
});

app.post('/sendOtp',function(req,res){  

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'regestra.mailer@gmail.com',
      pass:'Jack@789'
    }
  });

  let mailOptions ={
    from:"'Regestra' <regestra.mailer@gmail.com>",
    to:req.body.email,
    subject:'OTP',
    html:'<div align="center"><h1>OTP</h1></br><b>'+req.body.otp+'</b></div>'
  }

  transporter.sendMail(mailOptions, function(err,data){
    if(err){
      res.send(err);
    }
    else{
      res.send(data);
    }
  });
});


app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

// module.exports = app;
// module.exports.handler = serverless(app);