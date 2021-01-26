const mongoose = require("mongoose");
const winston = require("winston");

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    })
    .then(() => winston.info("Connected to MongoDB..."));
};
