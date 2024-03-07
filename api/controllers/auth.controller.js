const bcrypt = require("bcrypt");
const User = require("../services/user.service");
const { throwError } = require("../utils/error.util");
const { generateToken } = require("../utils/jwt.util");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userExists = await User.checkEmailAvailability(email);

    if (userExists.status === "FAILED") {
      throwError(
        userExists.status,
        userExists.error.statusCode,
        userExists.error.message,
        userExists.error.identifier
      );
    }

    const newUser = await User.createUser(req.body);

    if (newUser.status === "FAILED") {
      throwError(
        newUser.status,
        newUser.error.statusCode,
        newUser.error.message,
        newUser.error.identifier
      );
    }

    const signedToken = await generateToken(newUser.data._id, "USER");

    // Soft delete properties
    newUser.data.password = undefined;
    newUser.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newUser.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let projection = { isDeleted: 0 };
    const user = await User.getUserByEmail(email, projection);

    if (user.status === "FAILED") {
      throwError(
        user.status,
        user.error.statusCode,
        user.error.message,
        user.error.identifier
      );
    }

    const isMatch = await bcrypt.compare(password, user.data.password);

    if (!isMatch) {
      throwError("FAILED", 401, "Invalid credentials", "0x000A05");
    }

    let role = user.data.isAdmin ? "ADMIN" : "USER";
    const signedToken = await generateToken(user.data._id, role);

    // Soft delete properties
    user.data.password = undefined;

    res.status(200).json({
      status: "SUCCESS",
      data: user.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
