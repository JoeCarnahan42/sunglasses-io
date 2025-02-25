const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml"); // Replace './swagger.yaml' with the path to your Swagger file
const app = express();
require("dotenv").config();

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require("../initial-data/users.json");
const brands = require("../initial-data/brands.json");
const products = require("../initial-data/products.json");

// Local Data
const cart = [];

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Brand routes
app.get("/brands", (req, res) => {
  res.status(200).json(brands);
});

app.get("/brands/:id/products", (req, res) => {
  // return an array of products from a particular brand
  const brandId = String(req.params.id);
  const filterProducts = products.filter((product) => {
    const categoryId = String(product.categoryId);
    return categoryId === brandId;
  });
  res.status(200).json(filterProducts);
});

app.get("/products", (req, res) => {
  res.status(200).json(products);
});

app.get("/me/cart", (req, res) => {
  res.status(200).json(cart);
});

module.exports = app;
