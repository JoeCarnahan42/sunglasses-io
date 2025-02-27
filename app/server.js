const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require("../initial-data/users.json");
const brands = require("../initial-data/brands.json");
const products = require("../initial-data/products.json");

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Starting the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routes
app.get("/api/brands", (req, res) => {
  if (brands.length > 0) {
    res.status(200).json(brands);
  } else {
    res.status(400).json({ error: "No brands found" });
  }
});

app.get("/api/brands/:id/products", (req, res) => {
  if (brands && products) {
    const brandId = String(req.params.id);
    const filterProducts = products.filter((product) => {
      const categoryId = String(product.categoryId);
      return categoryId === brandId;
    });
    res.status(200).json(filterProducts);
  } else {
    res.status(400).json({ error: "No products found" });
  }
});

app.get("/api/products", (req, res) => {
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(400).json({ error: "No products found" });
  }
});

app.get("/api/me/cart", (req, res) => {
  if (user) {
    const cart = user.cart;
    return res.status(200).json(cart);
  }
  res.status(401).json({ error: "You must be logged in to view the cart" });
});

// Set user to null until a user is logged in
let user = null;
// Using optional revealed key in case tester does not have .env file with secret key
const JWT_KEY = process.env.SECRET_KEY || 84345512;

app.post("/api/login", (req, res) => {
  if (req.body.username && req.body.password) {
    const checkUser = users.find((user) => {
      return (
        user.login.username === req.body.username &&
        user.login.password === req.body.password
      );
    });
    if (checkUser) {
      const newAccessToken = jwt.sign(
        {
          id: checkUser.id,
          username: checkUser.login.username,
        },
        JWT_KEY
      );
      user = checkUser;
      user.token = newAccessToken;
      res.status(200).json(newAccessToken);
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } else {
    res.status(400).json({ error: "Incorrectly formatted response" });
  }
});

app.post("/api/me/cart", (req, res) => {
  if (user) {
    const item = req.body;
    const cart = user.cart;
    item.quantity = 1;
    cart.push(item);
    res.status(200).json(cart);
  } else {
    res
      .status(401)
      .json({ error: "You must be logged in to add items to the cart" });
  }
});

app.post("/api/me/cart/:productId", (req, res) => {
  if (user) {
    const cart = user.cart;
    const newQuantity = req.body.quantity;
    const productId = req.params.productId;
    const itemToUpdate = cart.find((item) => item.id === productId);
    if (itemToUpdate) {
      itemToUpdate.quantity = newQuantity;
      res.status(200).json(itemToUpdate);
    } else {
      const productToAdd = products.find((item) => item.id === productId);
      productToAdd.quantity = newQuantity;
      cart.push(productToAdd);
      res.status(200).json(productToAdd);
    }
  } else {
    res
      .status(401)
      .json({ error: "You must have a cart to change item quantities" });
  }
});

app.delete("/api/me/cart/:productId", (req, res) => {
  if (user) {
    let cart = user.cart;
    const productId = req.params.productId;
    const itemToRemove = cart.find((item) => item.id === productId);
    if (itemToRemove) {
      cart = cart.filter((item) => item.id != productId);
      res.status(200).json(cart);
    } else {
      res.status(200).json(cart);
    }
  } else {
    res.status(401).json({ error: "You need to have a cart to remove items" });
  }
});

module.exports = app;
