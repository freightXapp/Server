const User = require("../model/User");

async function create(user) {
  const newUser = new User(user);
  return await newUser.save();
}

module.exports = { create };
