const  TransportRequest = require("../controllers/transportRequest");
const Auth = require("../controllers/auth.js");

module.exports = (app) => {
  app.use("/auth", Auth);
  app.use("/trs", TransportRequest);
};
