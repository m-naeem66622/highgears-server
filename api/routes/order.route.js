const express = require("express");
const router = express.Router();

const Controller = require("../controllers/order.controller");
const Validation = require("../validators/order.validator");
const validate = require("../middlewares/validateReq.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// Route for creating a new order
router.post(
  "/",
  authenticate,
  validate(Validation.createOrder, "BODY"),
  Authorize.isUser,
  Controller.createOrder
);

// Route for checking out products
router.post(
  "/checkout",
  authenticate,
  validate(Validation.checkoutSchema, "BODY"),
  Authorize.isUser,
  Controller.checkout
);

// Route for getting all orders
router.get(
  "/",
  authenticate,
  validate(Validation.getSchema, "QUERY"),
  Authorize.isAdminOrUser,
  Controller.getOrders
);

// Route for getting a single order
router.get(
  "/:id",
  authenticate,
  validate(Validation.getSingleSchema, "PARAMS"),
  Authorize.isAdminOrUser,
  Controller.getSingleOrder
);

module.exports = router;
