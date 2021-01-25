const express = require("express");
const auth = require("../routes/users");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use(error);
  // we add error middleware at the last so we
  // can handle all error from other middleware
};
