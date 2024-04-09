const Order = require("../models/order.model");
const { throwError } = require("../utils/error.util");

// CreateOrder
const create = async (order) => {
  try {
    const newOrder = await Order.create(order);

    if (newOrder) {
      return { status: "SUCCESS", data: newOrder };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000D00",
          message: "Failed to create order",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D01");
  }
};

// CountOrders
const count = async (filter) => {
  try {
    const count = await Order.countDocuments(filter);

    return { status: "SUCCESS", data: count };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D02");
  }
};

// GetOrders
const get = async (filter, projection, page = 1, limit, options) => {
  try {
    const orders = await Order.find(filter, projection.root, options)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", projection.user)
      .populate("products.product");

    if (orders?.length > 0) {
      return { status: "SUCCESS", data: orders };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D03",
          message: "No orders found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D04");
  }
};

// GetOrderById
const getSingle = async (filter, projection) => {
  try {
    const order = await Order.findOne(filter, projection.root)
      .populate("user", projection.user)
      .populate("products.product");

    if (order) {
      return { status: "SUCCESS", data: order };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D05",
          message: "Order not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D06");
  }
};

// UpdateOrder
const update = async (filter, update, options = {}) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true, ...options }
    );

    if (updatedOrder) {
      return { status: "SUCCESS", data: updatedOrder };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D07",
          message: "Order not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D08");
  }
};

module.exports = { create, count, get, getSingle, update };
