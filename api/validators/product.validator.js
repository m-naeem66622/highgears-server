const Joi = require("joi");

const createSchema = Joi.object({
  images: Joi.array().items(Joi.string().required()).required(),
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  sku: Joi.string()
    .pattern(/^[A-Za-z0-9_-]+$/)
    .trim()
    .required()
    .messages({
      "string.pattern.base":
        "SKU must be alphanumeric and can only contain _ and -",
    }),
  selling_price: Joi.number().min(0).required(),
  original_price: Joi.number().min(0).required(),
  brand: Joi.string().trim().required(),
  shipping_price: Joi.number().min(0).required(),
  available_colors: Joi.array().items(Joi.string().required()).required(),
  available_sizes: Joi.array().items(Joi.string().required()).required(),
  in_stock: Joi.boolean(),
});

const getSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(30),
  available_colors: Joi.array().items(Joi.string().required()),
  available_sizes: Joi.array().items(Joi.string().required()),
  name: Joi.string().trim(),
  price_range: Joi.array().items(Joi.number().min(0)).length(2),
  brand: Joi.string().trim(),
  queryType: Joi.string().trim().valid("list", "card", "default", "table"),
  include: Joi.array().items(
    Joi.string()
      .trim()
      .valid(
        "name",
        "description",
        "selling_price",
        "original_price",
        "brand",
        "available_colors",
        "available_sizes",
        "shipping_price",
        "avg_rating",
        "reviews_count",
        "in_stock"
      )
  ),
});

const getByIdSchema = {
  PARAMS: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
  QUERY: Joi.object({
    queryType: Joi.string().trim().valid("list", "card", "default"),
  }),
};

const updateSchema = Joi.object({
  images: Joi.array().items(Joi.string()).min(1),
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  sku: Joi.string()
    .pattern(/^[A-Za-z0-9_-]+$/)
    .trim()
    .messages({
      "string.pattern.base":
        "SKU must be alphanumeric and can only contain _ and -",
    }),
  selling_price: Joi.number().min(0),
  original_price: Joi.number().min(0),
  shipping_price: Joi.number().min(0),
  brand: Joi.string().trim(),
  available_colors: Joi.array().items(Joi.string().required()),
  available_sizes: Joi.array().items(Joi.string().required()),
  in_stock: Joi.boolean(),
});

module.exports = { createSchema, getSchema, getByIdSchema, updateSchema };
