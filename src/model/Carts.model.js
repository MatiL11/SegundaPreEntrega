const mongoose = require("mongoose");
const Product = require("./Products.model");
const collectionName = "cart";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

const Carts = mongoose.model(collectionName, userSchema);

module.exports = Carts;
