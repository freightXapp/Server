const { create } = require("../services/user");

module.exports = (app) => {
  app.post("/login", async (req, res) => {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    const createdData = await create(data);
    res.json({
      createdData,
      message: "User Login Successfuly",
    });
  });
};
