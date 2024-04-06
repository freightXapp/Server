const express = require("express");
const expressConfig = require("./config/express");
const databaseConfig = require("./config/database");
const routerConfing = require("./config/routes");

start();

async function start() {
  const app = express();
  expressConfig(app);
  await databaseConfig(app);
  routerConfing(app);

  app.listen(3000, () => console.log("Rest Service Started"));
}
