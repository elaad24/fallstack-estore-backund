const express = require("express");
const { validate, User } = require("../models/users");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/", function (req, res, next) {
  res.json({ ans: "work" });
});

router.post("/singup", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).send({ errors: listErrors });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .send({ errors: { email: "User alreaady registerd." } });
  }
  user = new User(_.pick(req.body, ["name", "email", "password", "seller"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
