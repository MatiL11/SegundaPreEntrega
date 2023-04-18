const Products = require("../model/Products.model");

const paginationMiddleware = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || null;

  const products = await Products.find();

  if (!products) {
    return res
      .status(404)
      .json({ status: "error", message: "No products found" });
  }

  let filteredProducts = products;
  if (sort) {
    filteredProducts = filteredProducts.sort((a, b) => {
      if (sort === "asc") {
        return a.price - b.price;
      } else if (sort === "desc") {
        return b.price - a.price;
      }
    });
  }

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const response = {
    payload: paginatedProducts,
    status: "success",
    totalPages: totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    page: page,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevLink:
      page > 1 ? `/?limit=${limit}&page=${page - 1}&sort=${sort}` : null,
    nextLink:
      page < totalPages
        ? `/?limit=${limit}&page=${page + 1}&sort=${sort}`
        : null,
  };

  res.locals.paginatedResponse = response;

  next();
};

module.exports = paginationMiddleware;
