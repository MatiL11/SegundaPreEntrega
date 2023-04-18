const { Router } = require("express");
const Products = require("../model/Products.model");
const paginationMiddleware = require("../dao/paginationMiddleware");

const router = Router();

router.use(paginationMiddleware);

router.get("/", async (req, res) => {
  try {
    res.json(res.locals.paginatedResponse);
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
