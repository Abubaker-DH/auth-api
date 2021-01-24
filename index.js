require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();

// connect to Database
require("./startup/db")();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`listening on port ${PORT} ...`)
);

module.exports = server;
