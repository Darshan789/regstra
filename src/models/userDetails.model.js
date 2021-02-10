const mongoose = require("mongoose");
const Schema = mongoose.Schema;
userSchema = new Schema(
  {
    userId: { type: String },
    name: { type: String },
    title: { type: String },
    location: { type: String },
    websiteUrl: { type: String },
    bio: { type: String },
    behanceUrl: { type: String },
    dribbleUsername: { type: String },
    mediumUrl: { type: String },
    twitterUsername: { type: String },
    profilePic: { type: String },
    coverPic: { type: String },
    followers: { type: Number },
    followedBy: { type: String },
    following: { type: String },
  },
  { versionKey: false }
);
// var userModel = mongoose.model("users", mySchema, "users");
module.exports = mongoose.model("userDetails", userSchema, "userDetails");
