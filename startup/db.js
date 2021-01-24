const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  console.log("MongoDb connected ...");
};
