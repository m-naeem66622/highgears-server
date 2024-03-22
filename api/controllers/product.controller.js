const { PROJECTION } = require("../../config/config");
const Product = require("../services/product.service");
const deleteImages = require("../utils/deleteImages.util");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const adminId = req.user._id;

    req.body.admin = adminId;
    const product = await Product.create(req.body);

    if (product.status === "FAILED") {
      throwError(
        product.status,
        product.error.statusCode,
        product.error.message,
        product.error.identifier
      );
    }

    product.data.isDeleted = undefined;
    product.data.admin = undefined;

    res.status(201).json({
      status: "SUCCESS",
      message: "Product created successfully",
      data: product.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const {
      available_colors,
      available_sizes,
      queryType,
      include = [],
      exclude = [],
      ...restQuery
    } = req.query;
    delete restQuery.page;
    delete restQuery.limit;

    console.log("queryType", req.query.queryType);

    const projection =
      queryType === "card"
        ? PROJECTION.card
        : queryType === "table"
        ? include.reduce(
            (acc, key) => {
              acc[key] = 1;
              return acc;
            },
            {
              images: { $slice: 1 },
              name: 1,
              currency: 1,
              selling_price: 1,
              in_stock: 1,
            }
          )
        : PROJECTION.default;
    const filter = { isDeleted: false, ...restQuery };

    if (available_colors?.length > 0) {
      filter.available_colors = {
        $in: available_colors.map((colors) => new RegExp(colors, "i")),
      };
    }

    if (available_sizes?.length > 0) {
      filter.available_sizes = {
        $in: available_sizes.map((size) => new RegExp(size, "i")),
      };
    }

    const totalProducts = await Product.count(filter);
    const products = await Product.get(filter, projection, page, limit);

    if (products.status === "FAILED") {
      throwError(
        products.status,
        products.error.statusCode,
        products.error.message,
        products.error.identifier
      );
    }

    const pagination = {
      totalPages: Math.ceil(totalProducts.data / limit),
      currentPage: page,
      totalProducts: totalProducts.data,
      currentProducts: products.data.length,
      limit,
    };

    res.status(200).json({
      status: "SUCCESS",
      pagination,
      data: products.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const filter = { _id: id };
    const projection = { isDeleted: 0, admin: 0 };
    const product = await Product.getSingle(filter, projection);

    if (product.status === "FAILED") {
      throwError(
        product.status,
        product.error.statusCode,
        product.error.message,
        product.error.identifier
      );
    }

    res.status(200).json({ status: "SUCCESS", data: product.data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PATCH /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    // const admin = req.user._id;

    const filter = { _id };
    const existingProduct = await Product.getSingle(filter);

    if (existingProduct.status === "FAILED") {
      throwError(
        existingProduct.status,
        existingProduct.error.statusCode,
        existingProduct.error.message,
        existingProduct.error.identifier
      );
    }

    const imagesToDelete = existingProduct.data.images.filter(
      (image) => !req.body.images.includes(image)
    );

    deleteImages(imagesToDelete);

    const updatedProduct = await Product.update(_id, req.body);

    if (updatedProduct.status === "FAILED") {
      throwError(
        updatedProduct.status,
        updatedProduct.error.statusCode,
        updatedProduct.error.message,
        updatedProduct.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Product has been successfully updated",
      data: updatedProduct.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    // const admin = req.user._id;

    const filter = { _id };
    const existingProduct = await Product.getSingle(filter);

    if (existingProduct.status === "FAILED") {
      throwError(
        existingProduct.status,
        existingProduct.error.statusCode,
        existingProduct.error.message,
        existingProduct.error.identifier
      );
    }

    const updatedProduct = await Product.deleteOne(_id);

    if (updatedProduct.status === "FAILED") {
      throwError(
        updatedProduct.status,
        updatedProduct.error.statusCode,
        updatedProduct.error.message,
        updatedProduct.error.identifier
      );
    }

    deleteImages(existingProduct.data.images);

    res.status(204).json({
      status: "SUCCESS",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
