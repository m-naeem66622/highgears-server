const User = require("../models/user.model");
const { throwError } = require("../utils/error.util");

// CheckEmailAvailability
const checkEmailAvailability = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) return { status: "SUCCESS" };

    return {
      status: "FAILED",
      error: {
        statusCode: 409,
        identifier: "0x000A01",
        message: "Email already exists",
      },
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A02");
  }
};

// CreateUser
const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    if (newUser) {
      return { status: "SUCCESS", data: newUser };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000A03",
          message: "Failed to create user",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A04");
  }
};

// GetUserById
const getUserById = async (userId, projection) => {
  try {
    const user = await User.findOne(
      { _id: userId, isDeleted: false },
      projection
    );

    if (user) {
      return { status: "SUCCESS", data: user };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A05",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A06");
  }
};

// GetUserByEmail
const getUserByEmail = async (email, projection) => {
  try {
    const user = await User.findOne({ email, isDeleted: false }, projection);

    if (user) {
      return { status: "SUCCESS", data: user };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A07",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A08");
  }
};

// UpdateUserById
const updateUserById = async (userId, update, options = {}) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      update,
      { new: true, ...options }
    );

    if (updatedUser) {
      return { status: "SUCCESS", data: updatedUser };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000A09",
          message: "Failed to update user",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A10");
  }
};

// DeleteUserById
const deleteUserById = async (userId, options = {}) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
      { new: true, ...options }
    );

    if (user.isDeleted) {
      return { status: "SUCCESS", data: user };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A11",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A12");
  }
};

module.exports = {
  checkEmailAvailability,
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
