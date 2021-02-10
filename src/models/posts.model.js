const mongoose = require("mongoose");
const Schema = mongoose.Schema;
userSchema = new Schema(
  {
    userId: { type: String },
    userName: { type: String },
    postImage: { type: String },
    postTitle: { type: String },
    postType: { type: String },
    postLen: { type: String },
    postHeight: { type: String },
    postWid: { type: String },
    postDim: { type: String },
    postStyle: { type: String },
    postArtMed: { type: String },
    postTags: { type: String },
    postDesc: { type: String },
    postLikes: { type: Number },
    likedBy: { type: String },
  },
  { versionKey: false }
);
module.exports = mongoose.model("Arts", userSchema, "Arts");
