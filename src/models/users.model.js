const mongoose = require("mongoose");
const Schema = mongoose.Schema;
userSchema = new Schema(
  {
    type: { type: String },
    email: { type: String },
    password: { type: String },
  },
  { versionKey: false }
);
// var userModel = mongoose.model("users", mySchema, "users");
module.exports = mongoose.model("users", userSchema, "users");
