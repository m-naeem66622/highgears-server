const express = require("express");
const router = express.Router();

// Import your route handlers
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const productRoutes = require("./product.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/products", productRoutes);

module.exports = router;
