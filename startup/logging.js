const winston = require("winston");
// we use it to log errors in mongoDB
require("winston-mongodb");
require("express-async-errors");

// the bset parctes is to exst(1) or end the process and restarted with clean state
// ther are tool to manage the process called process manager
module.exports = function () {
  // when we have an exception in the node process but no ware
  // we have handle that exception using Catch block  (handle node exception)
  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  // when we call then() and don't call catch()
  // or don't use try/catch when using async / await
  // (handle promise exception)
  process.on("unhandledRejection", (ex) => {
    // becouse handleException() method don't log unhandledRejection errors
    // so we theow the ex to handleEception so will log it in the file
    throw ex;
  });

  // this is a default logger
  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: process.env.MONGO_URI,
    level: "info", // we specifiy the level of error
  });
};
