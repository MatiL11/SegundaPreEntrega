const { Router } = require("express");
const Products = require("../model/Products.model");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Products.find();
    res.json({ status: "success", message: products });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, category, price } = req.body;
    const newProductInfo = {
      title,
      category,
      price,
    };
    const newProduct = await Products.create(newProductInfo);
    res.json({ status: "success", message: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

module.exports = router;
