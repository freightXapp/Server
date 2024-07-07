require("dotenv").config();
const mongoose = require("mongoose");
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

module.exports = async (app) => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");

    mongoose.connection.on("error", (err) => {
      console.error(`DB Error: ${err.message}`);
      console.log(err);
    });
  } catch (err) {
    console.error(`${err.message}: Error with connectection to Database`);
    process.exit(1);
  }
};
