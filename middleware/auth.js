require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    console.log("REQ COOKIES =>", req.cookies);
  try {
    console.log('test')
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).send("Access Denied");
    }

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({message: "Invalid Token"});
  }
}


module.exports = { authenticateToken };