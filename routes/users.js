const express = require("express");
const lodash = require("lodash");
const {
  User,
  validateRegister,
  validateForgote,
  validateReset,
  validateLogin,
} = require("../models/user");
const router = express.Router();

// SignUp or register or crate user route
router.post("/register", async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registerd..");

  user = new User(lodash.pick(req.body, ["name", "email", "password"]));

  res.send(lodash.pick(user, ["_id", "name", "email"]));
});

// Login or signIn route
router.post("/login", async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password..");

  res.send(lodash.pick(user, ["_id", "name", "email"]));
});

// Reset password route
router.put("/resetpassword/:resetToken", async (req, res, next) => {
  const token = req.params.resetToken;

  let user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) return res.status(400).send("Uesr not found..");

  const { error } = validateReset(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  user.save();
  res.send("reset password sucessfully.");
});

// Forgot Password route
router.post("/forgotpassword", async (req, res, next) => {
  const { error } = validateForgote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Uesr not found..");

  // create 32 random bytes or char
  const buffer = await crypto.randomBytes(32);
  if (error) return res.send(error);
  // convert buffer to string as Token
  const token = buffer.toString("hex");

  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000;
  res.send("Check your email to reset your password.");
});

module.exports = router;
