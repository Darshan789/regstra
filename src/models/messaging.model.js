const mongoose = require("mongoose");
const Schema = mongoose.Schema;

userSchema = new Schema(
  {
    messagingTo: { type: String },
    messagingFrom: { type: String },
    messages: { type: String },
    time:{type: Number},
    status:{type:String}
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Messages", userSchema, "Messages");
