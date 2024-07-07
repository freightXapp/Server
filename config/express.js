const express = require("express");
const bodyParser = require("body-parser");
const cors = require("../middleware/cors");


module.exports = (app) => {
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
};
