const express = require("express");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send("Invalid email or password.");
  }

  let user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return res.status(400).json({ email: "worng email - try agin " });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ password: "Invalid password." });

  res.json({
    name: user.name,
    token: user.generateAuthToken(),
    seller: user.seller,
    user_id: user._id,
  });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = router;
