const ALLOWED_VALIDATION_SCHEMA_SCOPES = {
  BODY: "BODY",
  PARAMS: "PARAMS",
  QUERY: "QUERY",
  NONE: "NONE",
};

const PROJECTION = {
  default: { isDeleted: 0, admin: 0 },
  card: {
    images: { $slice: 1 },
    name: 1,
    selling_price: 1,
    original_price: 1,
    currency: 1,
    brand: 1,
    avg_rating: 1,
    reviews_count: 1,
    in_stock: 1,
  },
};

module.exports = { ALLOWED_VALIDATION_SCHEMA_SCOPES, PROJECTION };
