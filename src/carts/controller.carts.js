const { Router } = require("express");
const Carts = require("../model/Carts.model");
const FilesDao = require("../dao/files.dao");

const cartsFile = new FilesDao("Carts.json");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await Carts.find();
    res.json({ status: "success", message: carts });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

router.get("/loadData", async (req, res) => {
  try {
    const carts = await cartsFile.getItems();
    const newCarts = await Carts.insertMany(carts);
    res.json({ status: "success", message: newCarts });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newCartsInfo = {
      name,
    };
    const newCart = await Carts.create(newCartsInfo);
    res.json({ status: "success", message: newCart });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;

    const cart = await Carts.findOne({ _id: id });
    console.log(cart);
    cart.products.push({ product });

    const response = await Carts.updateOne({ _id: id }, cart);

    res.json({ status: "success", message: response });
  } catch (error) {
    //console.log(error);
    res.status(400).json({ status: "error", error });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Carts.deleteMany();
    res.json({ status: "success", message: "All carts deleted" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
