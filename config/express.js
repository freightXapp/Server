const express = require("express");
const bodyParser = require("body-parser");
const cors = require("../middleware/cors");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(cookieParser());

};
