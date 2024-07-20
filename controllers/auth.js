const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const User = require("../models/User");
const isProduction = process.env.NODE_ENV === "production";
const halfHour = new Date(Date.now() + 30 * 60 * 1000); // 30 Min
const oneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days



const { sendValidationEmail } = require("../services/mailer");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send("Email or password is incorrect");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Email or password is incorrect");
  }

  // Invalidate previous refresh token
  user.refreshToken = null;
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  });
  res.json({ message: "Login successful" });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("Email =>", email);
  console.log("Password =>", password);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("Email is already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("HASHPASS => ", hashedPassword);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  const validationToken = generateValidationToken(user);

  console.log("validationToken", validationToken);
  await sendValidationEmail(user.email, validationToken);

  res.status(201).send("User registered. Please validate your email.");
});

router.post("/token", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send("Refresh Token Required");
  }

  const user = await User.findOne({ refreshToken: token });
  if (!user) {
    return res.status(403).send("Invalid Refresh Token");
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).send("Invalid Refresh Token");
  }
});

router.get("/dashboard", authenticateToken, (req, res) => {
  // JUST FOR TESTING
  console.log("DASH BOARD");
  if (!req.user.isEmailValidated) {
    return res
      .status(403)
      .send("Please validate your email to access the dashboard");
  }
  res.send("Welcome to the dashboard");
});

router.get("/validate-email", async (req, res) => {
  const { token } = req.query; // TODO REVALIDATE ???
  console.log("token => ", token);
  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    console.log('Decoded', decoded)
    const user = await User.findById(decoded.userId);
    console.log(user);
    if (!user) {
      return res.status(400).send("Invalid token");
    }

    user.isEmailValidated = true;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    console.log("Is Production =>", isProduction);
    setCookie(res, accessToken, refreshToken);
    console.log("send cookie");
    res.status(200).json({ message: "Email validated successfully" });
  } catch (error) {
    res.status(400).send("Invalid or expired token");
  }
});

function setCookie(res, accessToken, refreshToken){
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict", // TODO  change this to 'Strict' before go live !!!
      maxAge: 30 * 60 * 1000,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict", // TODO  change this to 'Strict' before go live !!!
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
}

function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

function generateValidationToken(user) {
  return jwt.sign({ userId: user._id }, process.env.EMAIL_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = router;
