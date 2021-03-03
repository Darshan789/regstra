const mongoose = require("mongoose");
const Schema = mongoose.Schema;
notificationsSchema = new Schema(
  {
    to: { type: String },
    from: { type: String },
    postId:{type:String},
    notificationType: { type: String }, //1: For Like, 2:for Follow, 3:for Message
    seen: {type:Boolean}
  },
  { versionKey: false }
);
// var userModel = mongoose.model("users", mySchema, "users");
module.exports = mongoose.model("notifications", notificationsSchema, "notifications");
