const Product = require("../models/product.model");
const { throwError } = require("../utils/error.util");

// CreateProduct
const create = async (product) => {
  try {
    const newProduct = await Product.create(product);

    if (newProduct) {
      return { status: "SUCCESS", data: newProduct };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000B00",
          message: "Failed to create product",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B01");
  }
};

// CountProducts
const count = async (filter) => {
  try {
    const count = await Product.countDocuments(filter);

    return { status: "SUCCESS", data: count };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B02");
  }
};

// GetProducts
const get = async (filter, projection, page, limit, options) => {
  try {
    const products = await Product.find(filter, projection, options)
      .skip((page - 1) * limit)
      .limit(limit);

    if (products?.length > 0) {
      return { status: "SUCCESS", data: products };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B03",
          message: "No products found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B04");
  }
};

// GetProductById
const getSingle = async (filter, projection) => {
  try {
    const product = await Product.findOne(
      { isDeleted: false, ...filter },
      projection
    );

    if (product) {
      return { status: "SUCCESS", data: product };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B05",
          message: "Product not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B06");
  }
};

// UpdateProductById
const update = async (productId, update, options = {}) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { $set: update },
      { new: true, ...options }
    );

    if (updatedProduct) {
      return { status: "SUCCESS", data: updatedProduct };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B07",
          message: "Product not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B08");
  }
};

// DeleteProductById
const deleteOne = async (productId, options = {}) => {
  try {
    const deletedProduct = await Product.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { isDeleted: true },
      { new: true, ...options }
    );

    if (deletedProduct?.isDeleted === true) {
      return { status: "SUCCESS", data: deletedProduct };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B09",
          message: "Product not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0A");
  }
};

module.exports = { create, count, get, getSingle, update, deleteOne };
