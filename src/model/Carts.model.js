const mongoose = require("mongoose");

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
          ref: "product",
        },
      },
    ],
    default: [],
  },
});

const Carts = mongoose.model(collectionName, userSchema);

module.exports = Carts;
