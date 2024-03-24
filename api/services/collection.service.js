const { PROJECTION } = require("../../config/config");
const Collection = require("../models/collection.model");
const { throwError } = require("../utils/error.util");

// CreateCollection
const create = async (collection, nestedProjection = []) => {
  try {
    const newCollection = await Collection.create(collection);

    const populatedCollection = await Collection.aggregate([
      {
        $match: {
          slug: collection.slug,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          products: {
            $map: {
              input: "$products",
              in: nestedProjection.reduce((acc, key) => {
                acc[key] =
                  key === "images"
                    ? { $slice: [`$$this.${key}`, 1] }
                    : `$$this.${key}`;
                return acc;
              }, {}),
            },
          },
          showOnHomepage: 1,
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);

    if (populatedCollection[0]) {
      return { status: "SUCCESS", data: populatedCollection[0] };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000C01",
          message: "Failed to create collection",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C02");
  }
};

// CountCollections
const count = async (filter) => {
  try {
    const count = await Collection.countDocuments(filter);
    return { status: "SUCCESS", data: count };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C03");
  }
};

// GetCollections
const get = async (filter, nestedProjection = [], page, limit, options) => {
  try {
    const aggreagtionPipeline = [
      { $match: filter },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
    ];

    if (nestedProjection.length > 0) {
      aggreagtionPipeline.push({
        $project: {
          ...PROJECTION.collection.default,
          products: {
            $map: {
              input: "$products",
              in: nestedProjection.reduce((acc, key) => {
                acc[key] =
                  key === "images"
                    ? { $slice: [`$$this.${key}`, 1] }
                    : `$$this.${key}`;
                return acc;
              }, {}),
            },
          },
        },
      });
    } else {
      aggreagtionPipeline.push({
        $addFields: {
          productsCount: {
            $size: "$products",
          },
          products: "$$REMOVE",
          isDeleted: "$$REMOVE",
        },
      });
    }

    const collections = await Collection.aggregate(aggreagtionPipeline);

    if (collections?.length > 0) {
      return { status: "SUCCESS", data: collections };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C04",
          message: "No collections found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C05");
  }
};

// GetCollection
const getSingle = async (filter, nestedProjection) => {
  try {
    const collection = await Collection.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          products: {
            $map: {
              input: "$products",
              in: nestedProjection.reduce((acc, key) => {
                acc[key] =
                  key === "images"
                    ? { $slice: [`$$this.${key}`, 1] }
                    : `$$this.${key}`;
                return acc;
              }, {}),
            },
          },
          showOnHomepage: 1,
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);

    if (collection[0]) {
      return { status: "SUCCESS", data: collection[0] };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C06",
          message: "Collection not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C07");
  }
};

// UpdateCollection
const update = async (filter, update, options = {}, nestedProjection = []) => {
  try {
    const updatedCollection = await Collection.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true, ...options }
    );

    if (!updatedCollection) {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C08",
          message: "Collection not found",
        },
      };
    }

    const populatedCollection = await Collection.aggregate([
      { $match: { slug: updatedCollection.slug } },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          products: {
            $map: {
              input: "$products",
              in: nestedProjection.reduce((acc, key) => {
                acc[key] =
                  key === "images"
                    ? { $slice: [`$$this.${key}`, 1] }
                    : `$$this.${key}`;
                return acc;
              }, {}),
            },
          },
          showOnHomepage: 1,
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);

    if (populatedCollection[0]) {
      return { status: "SUCCESS", data: populatedCollection[0] };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C09",
          message: "Collection not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C0A");
  }
};

// DeleteCollection
const remove = async (filter, options = {}) => {
  try {
    const deletedCollection = await Collection.findByIdAndUpdate(
      { isDeleted: false, ...filter },
      { isDeleted: true },
      { new: true, ...options }
    );
    if (deletedCollection.isDeleted) {
      return { status: "SUCCESS", data: deletedCollection };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C0B",
          message: "Collection not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C0C");
  }
};

// CheckSlugAvailability
const checkSlugAvailability = async (filter) => {
  try {
    const existingCollection = await Collection.findOne(filter);

    if (existingCollection) {
      return {
        status: "FAILED",
        error: {
          statusCode: 409,
          identifier: "0x000C0D",
          message: "Collection with this slug already exists",
        },
      };
    } else {
      return { status: "SUCCESS" };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C0E");
  }
};

module.exports = {
  create,
  count,
  get,
  getSingle,
  update,
  remove,
  checkSlugAvailability,
};
