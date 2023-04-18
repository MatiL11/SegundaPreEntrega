const mongoose = require("mongoose");

const collectionName = "product";

const userSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
});

const Products = mongoose.model(collectionName, userSchema);

module.exports = Products;
