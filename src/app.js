const express = require("express");
const morgan = require("morgan");
const { PORT } = require("./config/app.config");
const router = require("./router");
const mongoConnect = require("../db");
const paginationMiddleware = require("./dao/paginationMiddleware");

const app = express();

// Middlewares
app.use(paginationMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

mongoConnect();
router(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
