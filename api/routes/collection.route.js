const express = require("express");
const router = express.Router();

const Controller = require("../controllers/collection.controller");
const Validation = require("../validators/collection.validator");
const validate = require("../middlewares/validateReq.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// Route for creating a new collection
router.post(
  "/",
  authenticate,
  Authorize.isAdmin,
  validate(Validation.createSchema, "BODY"),
  Controller.createCollection
);

// Route for getting all collections
router.get(
  "/",
  validate(Validation.getSchema, "QUERY"),
  Controller.getCollections
);

// Route for getting a single collection by slug
router.get(
  "/:slug",
  validate(Validation.getBySlugSchema.PARAMS, "PARAMS"),
  validate(Validation.getBySlugSchema.QUERY, "QUERY"),
  Controller.getCollection
);

// Route for updating a collection by slug
router.put(
  "/:slug",
  authenticate,
  Authorize.isAdmin,
  validate(Validation.updateSchema, "BODY"),
  Controller.updateCollection
);

// Route for deleting a single collection by slug
router.delete(
  "/:slug",
  authenticate,
  Authorize.isAdmin,
  validate(Validation.getBySlugSchema.PARAMS, "PARAMS"),
  Controller.deleteCollection
);

module.exports = router;
