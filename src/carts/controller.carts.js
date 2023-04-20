const { Router } = require("express");
const Carts = require("../model/Carts.model");
const FilesDao = require("../dao/files.dao");

const cartsFile = new FilesDao("Carts.json");
const router = Router();

//obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await Carts.find().populate("products.product");
    res.json({ status: "success", message: carts });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

//obtener un carrito por id
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Carts.findById(req.params.cid).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los productos del carrito" });
  }
});

//cargar datos de un archivo json a la base de datos
router.get("/loadData", async (req, res) => {
  try {
    //obtiene los datos del archivo json y los carga a la base de datos
    const carts = await cartsFile.getItems();
    const newCarts = await Carts.insertMany(carts);
    res.json({ status: "success", message: newCarts });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

//agegar un carrito
router.post("/", async (req, res) => {
  try {
    //obtiene el nombre del carrito a crear
    const { name } = req.body;
    const newCartsInfo = {
      name,
    };
    //crea el carrito
    const newCart = await Carts.create(newCartsInfo);
    res.json({ status: "success", message: newCart });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

//agregar un producto al carrito
router.patch("/:cid", async (req, res) => {
  try {
    //obtiene el id del carrito y el producto a agregar
    const { cid } = req.params;
    const { product } = req.body;

    //busca el carrito y agrega el producto
    const cart = await Carts.findOne({ _id: cid });
    //console.log(cart);
    cart.products.push({ product });

    //guarda el carrito
    const response = await Carts.updateOne({ _id: cid }, cart);

    res.json({ status: "success", message: response });
  } catch (error) {
    //console.log(error);
    res.status(400).json({ status: "error", error });
  }
});

//actualizar la cantidad de un producto en un carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    //obtiene el carrito con el id pasado por parametro y verifica que exista
    const cart = await Carts.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }

    //obtiene el producto con el id pasado por parametro y verifica que exista
    const product = cart.products.find((p) => p.id === req.params.pid);

    if (!product) {
      return res
        .status(404)
        .json({ error: "No se encontró el producto en el carrito" });
    }

    //actualiza la cantidad del producto
    product.quantity = req.body.quantity;

    //guarda el carrito
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Error al actualizar la cantidad de ejemplares del producto en el carrito",
    });
  }
});

//borrar todos los carritos
router.delete("/", async (req, res) => {
  try {
    await Carts.deleteMany();
    res.json({ status: "success", message: "All carts deleted" });
  } catch (error) {
    console.log(error);
  }
});

//borrar un producto de un carrito en particular
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    //obtiene el carrito con el id pasado por parametro
    const cart = await Carts.findById(req.params.cid);
    //console.log(cart);

    //verifica que el carrito exista y que el producto este en el carrito
    if (!cart) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === req.params.pid
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "No se encontró el producto en el carrito" });
    }

    //elimina el producto del carrito
    cart.products.splice(productIndex, 1);

    //guarda el carrito
    await cart.save();

    res.json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
});

//borrar todos los productos de un carrito en particular
router.delete("/:cid", async (req, res) => {
  try {
    //obtiene el carrito con el id pasado por parametro y verifica que exista
    const cart = await Carts.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }

    //elimina todos los productos del carrito
    cart.products = [];

    //guarda el carrito
    await cart.save();

    res.json({ message: "Se eliminaron todos los productos del carrito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar todos los productos del carrito" });
  }
});

module.exports = router;
