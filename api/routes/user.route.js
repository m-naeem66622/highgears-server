const express = require("express");
const router = express.Router();

const Controller = require("../controllers/user.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/user.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// Route for getting authenticated user profile
router.get("/profile", authenticate, Controller.getUserProfile);

// Route for updating authenticated user profile
router.patch(
  "/profile",
  validate(Validation.updateProfileSchema, "BODY"),
  authenticate,
  Controller.updateUserProfile
);

// Route for deleting authenticated user profile
router.delete("/profile", authenticate, Controller.deleteUserProfile);

module.exports = router;
