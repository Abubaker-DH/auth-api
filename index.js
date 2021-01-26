require("dotenv").config({ path: "./config.env" });
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/db")();
require("./startup/prod")(app);
require("./startup/routes")(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => winston.info(`Listening on PORT ${PORT}...`));
