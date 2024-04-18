const { PROJECTION } = require("../../config/config");
const Collection = require("../services/collection.service");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Create a new collection
 * @route   POST /api/collections
 * @access  Private/Admin
 */
const createCollection = async (req, res, next) => {
  try {
    const { slug } = req.body;

    // Check if collection with current slug already exists
    const existingCollection = await Collection.checkSlugAvailability({ slug });
    if (existingCollection.status === "FAILED") {
      throwError(
        existingCollection.status,
        existingCollection.error.statusCode,
        existingCollection.error.message,
        existingCollection.error.identifier
      );
    }

    const collection = await Collection.create(
      req.body,
      PROJECTION.collection.nested
    );

    if (collection.status === "FAILED") {
      throwError(
        collection.status,
        collection.error.statusCode,
        collection.error.message,
        collection.error.identifier
      );
    }

    res.status(201).json({
      status: "SUCCESS",
      message: "Collection created successfully",
      data: collection.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all collections
 * @route   GET /api/collections
 * @access  Public
 */
const getCollections = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const queryType = req.query.queryType || "default";
    const showOnHomepage =
      req.query.showOnHomepage === "true"
        ? true
        : req.query.showOnHomepage === "false"
        ? false
        : null;

    const nestedProjection =
      queryType === "card"
        ? PROJECTION.collection.nested
        : queryType === "table"
        ? []
        : PROJECTION.collection.nested;

    const filter = { isDeleted: false };
    if (showOnHomepage !== null) filter.showOnHomepage = showOnHomepage;

    const totalCollections = await Collection.count({ isDeleted: false });
    const collections = await Collection.get(
      filter,
      nestedProjection, // nestedProjection
      page,
      limit
    );

    if (collections.status === "FAILED") {
      throwError(
        collections.status,
        collections.error.statusCode,
        collections.error.message,
        collections.error.identifier
      );
    }

    const pagination = {
      totalPages: Math.ceil(totalCollections.data / limit),
      currentPage: page,
      totalCollections: totalCollections.data,
      currentCollections: collections.data.length,
      limit,
    };

    res.status(200).json({
      status: "SUCCESS",
      pagination,
      data: collections.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single collection
 * @route   GET /api/collections/:slug
 * @access  Public
 */
const getCollection = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { queryType } = req.query;

    const nestedProjection =
      queryType === "list"
        ? ["_id", "name", "in_stock"]
        : PROJECTION.collection.nested;

    const filter = { isDeleted: false, slug };
    const collection = await Collection.getSingle(filter, nestedProjection);

    if (collection.status === "FAILED") {
      throwError(
        collection.status,
        collection.error.statusCode,
        collection.error.message,
        collection.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: collection.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a collection
 * @route   PATCH /api/collections/:slug
 * @access  Private/Admin
 */
const updateCollection = async (req, res, next) => {
  try {
    const slug = req.body.slug;

    if (slug && slug !== req.params.slug) {
      // Check if collection with current slug already exists
      const existingCollection = await Collection.checkSlugAvailability({
        slug,
      });
      if (existingCollection.status === "FAILED") {
        throwError(
          existingCollection.status,
          existingCollection.error.statusCode,
          existingCollection.error.message,
          existingCollection.error.identifier
        );
      }
    }

    const filter = { slug: req.params.slug, isDeleted: false };
    const updatedCollection = await Collection.update(
      filter,
      req.body,
      {},
      PROJECTION.collection.nested
    );

    if (updatedCollection.status === "FAILED") {
      throwError(
        updatedCollection.status,
        updatedCollection.error.statusCode,
        updatedCollection.error.message,
        updatedCollection.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Collection updated successfully",
      data: updatedCollection.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a collection
 * @route   DELETE /api/collections/:slug
 * @access  Private/Admin
 */
const deleteCollection = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const filter = { slug, isDeleted: false };
    const update = { isDeleted: true };

    const deletedCollection = await Collection.update(filter, update);

    if (deletedCollection.status === "FAILED") {
      throwError(
        deletedCollection.status,
        deletedCollection.error.statusCode,
        deletedCollection.error.message,
        deletedCollection.error.identifier
      );
    }

    res.status(204).json({
      status: "SUCCESS",
      message: "Collection deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
};
