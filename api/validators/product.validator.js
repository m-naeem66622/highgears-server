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
  currency: Joi.string()
    .trim()
    .length(3)
    .uppercase()
    .required()
    .messages({ "string.length": "Currency must be ISO 4217 standard" }),
  brand: Joi.string().trim().required(),
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
  queryType: Joi.string().trim().valid("card", "default", "table"),
  include: Joi.array().items(
    Joi.string()
      .trim()
      .valid(
        "name",
        "description",
        "selling_price",
        "original_price",
        "currency",
        "brand",
        "available_colors",
        "available_sizes",
        "avg_rating",
        "reviews_count",
        "in_stock"
      )
  ),
});

const getByIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

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
  currency: Joi.string().trim().length(3).uppercase().messages({
    "string.length": "Currency must be ISO 4217 standard",
  }),
  brand: Joi.string().trim(),
  available_colors: Joi.array().items(Joi.string().required()),
  available_sizes: Joi.array().items(Joi.string().required()),
  in_stock: Joi.boolean(),
});

module.exports = { createSchema, getSchema, getByIdSchema, updateSchema };
