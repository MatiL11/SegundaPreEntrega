const mongoose = require("mongoose");
const {
  dbAdmin,
  dbPassword,
  dbHost,
  dbName,
} = require("../src/config/db.config");

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

module.exports = mongoConnect;
