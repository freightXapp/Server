const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = model("User", userSchema);
module.exports = User;
