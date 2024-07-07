const { create } = require("../services/user");
const  TransportRequest = require("../controllers/transportRequest");
const TestServer = require("../controllers/data.js");

module.exports = (app) => {
  app.use("/", TestServer);
  app.use("/trs", TransportRequest);
};
