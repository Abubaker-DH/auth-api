const mongoose = require("mongoose");
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
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
}

function validateLogin(user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
}

function validateReset(user) {
  const schema = {
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
}

function validateForgote(user) {
  const schema = {
    email: Joi.string().required().email(),
  };
  return Joi.validate(user, schema);
}
module.exports.User = mongoose.model("User", userSchema);
module.exports.validateRegister = validateRegister;
module.exports.validateLogin = validateLogin;
module.exports.validateReset = validateReset;
module.exports.validateForgote = validateForgote;
