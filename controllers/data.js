require("dotenv/config");
const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json("DB is connected");
});

module.exports = router;
