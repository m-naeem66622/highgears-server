const express = require("express");
const router = express.Router();

const Controller = require("../controllers/product.controller");
const Validation = require("../validators/product.validator");
const validate = require("../middlewares/validateReq.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");
const uploadProductImages = require("../middlewares/image.middleware");

// Route for creating a new product
router.post(
  "/",
  authenticate,
  Authorize.isAdmin,
  uploadProductImages,
  validate(Validation.createSchema, "BODY"),
  Controller.createProduct
);

// Route for getting all products
router.get(
  "/",
  validate(Validation.getSchema, "QUERY"),
  Controller.getProducts
);

// Route for getting a single product by id
router.get(
  "/:id",
  validate(Validation.getByIdSchema, "PARAMS"),
  Controller.getProductById
);

// Route for updating a product by id
router.put(
  "/:id",
  authenticate,
  Authorize.isAdmin,
  uploadProductImages,
  validate(Validation.updateSchema, "BODY"),
  Controller.updateProduct
);

// Route for deleting a single product by id
router.delete(
  "/:id",
  authenticate,
  Authorize.isAdmin,
  validate(Validation.getByIdSchema, "PARAMS"),
  Controller.deleteProduct
);

module.exports = router;
