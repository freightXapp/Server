const express = require("express");
const expressConfig = require("./config/express");
const databaseConfig = require("./config/database");
const routerConfing = require("./config/routes");
require("dotenv/config");

start();

async function start() {
  const app = express();
  expressConfig(app);
  await databaseConfig(app);
  routerConfing(app);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log("app listening on port " + port + "!");
  });
}
