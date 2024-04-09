const User = require("../services/user.service");
const bcrypt = require("bcrypt");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Get authenticated user's profile
 * @route   GET /api/user
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const projection = { isDeleted: 0, password: 0 };
    const user = await User.getUserById(_id, projection);

    if (user.status === "FAILED") {
      throwError(
        user.status,
        user.error.statusCode,
        user.error.message,
        user.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update authenticated user's profile
 * @route   PATCH /api/user
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (req.body.password) {
      let user = await User.getUserById(_id, { password: 1 });

      if (user.status === "FAILED") {
        throwError(
          user.status,
          user.error.statusCode,
          user.error.message,
          user.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        user.data.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: "FAILED",
          message: "Data Validation Failed",
          errors: { oldPassword: "Old password is incorrect" },
        });
      }
    }

    const options = { fields: { password: 0, isDeleted: 0 } };
    const updatedUser = await User.updateUserById(_id, req.body, options);

    if (updatedUser.status === "FAILED") {
      throwError(
        updatedUser.status,
        updatedUser.error.statusCode,
        updatedUser.error.message,
        updatedUser.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Profile updated successfully",
      data: updatedUser.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete authenticated user's profile
 * @route   DELETE /api/user
 * @access  Private
 */
const deleteUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const deletedUser = await User.deleteUserById(_id);

    if (deletedUser.status === "FAILED") {
      throwError(
        deletedUser.status,
        deletedUser.error.statusCode,
        deletedUser.error.message,
        deletedUser.error.identifier
      );
    }

    res.status(204).json({
      status: "SUCCESS",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
