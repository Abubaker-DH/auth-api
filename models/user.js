const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true }
);

function validateRegister(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}

function validateReset(user) {
  const schema = Joi.object({
    password: Joi.string().required(),
  });
  return schema.validate(user);
}

function validateForgote(user) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });
  return schema.validate(user);
}

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET
  );
  return token;
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports.User = mongoose.model("User", userSchema);
module.exports.validateRegister = validateRegister;
module.exports.validateLogin = validateLogin;
module.exports.validateReset = validateReset;
module.exports.validateForgote = validateForgote;
