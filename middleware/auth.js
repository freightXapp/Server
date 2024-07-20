require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateToken(req, res, next) {
    console.log("REQ COOKIES =>", req.cookies);
  try {
    console.log('test')
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).send("Access Denied");
    }

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(verified.userId);
    console.log("VERIFIED =>", verified);
    console.log("USER =>", user);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({message: "Invalid Token"});
  }
}


module.exports = { authenticateToken };