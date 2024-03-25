const ALLOWED_VALIDATION_SCHEMA_SCOPES = {
  BODY: "BODY",
  PARAMS: "PARAMS",
  QUERY: "QUERY",
  NONE: "NONE",
};

const PROJECTION = {
  product: {
    default: { isDeleted: 0, admin: 0 },
    card: {
      images: { $slice: 1 },
      name: 1,
      selling_price: 1,
      original_price: 1,
      available_sizes: 1,
      available_colors: 1,
      brand: 1,
      avg_rating: 1,
      reviews_count: 1,
      in_stock: 1,
    },
    list: { name: 1, in_stock: 1 },
  },
  collection: {
    default: {
      name: 1,
      slug: 1,
      description: 1,
      showOnHomepage: 1,
      _id: 1,
      createdAt: 1,
      updatedAt: 1,
      __v: 1,
    },
    nested: [
      "_id",
      "images",
      "name",
      "selling_price",
      "original_price",
      "shipping_price",
      "available_sizes",
      "available_colors",
      "brand",
      "avg_rating",
      "reviews_count",
      "in_stock",
    ],
  },
};

module.exports = { ALLOWED_VALIDATION_SCHEMA_SCOPES, PROJECTION };
