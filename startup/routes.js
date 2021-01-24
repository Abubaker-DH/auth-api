const express = require("express");
const auth = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
};
