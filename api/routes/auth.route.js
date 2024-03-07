const express = require("express");
const router = express.Router();

const Controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/user.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// Route for registering user
router.post(
  "/register",
  validate(Validation.registerSchema, "BODY"),
  Controller.registerUser
);

// Route for logging in user
router.post(
  "/login",
  validate(Validation.loginSchema, "BODY"),
  Controller.loginUser
);

module.exports = router;
