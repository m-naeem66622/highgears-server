const express = require("express");
const router = express.Router();

// Import your route handlers
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const productRoutes = require("./product.route");
const collectionRoutes = require("./collection.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/products", productRoutes);
router.use("/collections", collectionRoutes);

module.exports = router;
