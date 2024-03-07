const express = require("express");
const router = express.Router();

// Import your route handlers
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

module.exports = router;
