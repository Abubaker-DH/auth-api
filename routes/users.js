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
  // check if the user send all the data
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registerd..");

  // hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = new User(lodash.pick(req.body, ["name", "email", "password"]));
  await user.save();
  // generate token
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-ayth-token")
    .send(lodash.pick(user, ["_id", "name", "email"]));
});

// Login or signIn route
router.post("/login", async (req, res, next) => {
  // check if the user send all the data
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password..");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).send("Invalid email or password..");

  // generate token
  const token = user.generateAuthToken();

  // res.send(lodash.pick(user, ["_id", "name", "email"]));
  res.send(token);
});

// Reset password route
router.put("/resetpassword/:resetToken", async (req, res, next) => {
  const token = req.params.resetToken;

  let user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) return res.status(404).send("Uesr not found..");

  const { error } = validateReset(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
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
  if (!user) return res.status(404).send("Uesr not found..");

  // create 32 random bytes or char
  const buffer = await crypto.randomBytes(32);
  if (error) return res.send(error);
  // convert buffer to string as Token
  const resetToken = buffer.toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + process.env.JWT_EXPIRE;
  res.send("Check your email to reset your password.");
});

module.exports = router;
