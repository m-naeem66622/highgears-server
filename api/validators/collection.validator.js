const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().trim().required(),
  slug: Joi.string()
    .trim()
    .lowercase({ force: true })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.pattern.base":
        "Slug can only contain lowercase letters, numbers and hyphens",
    }),
  description: Joi.string().trim().required(),
  products: Joi.array().items(Joi.string().length(24).hex()),
  showOnHomepage: Joi.boolean(),
});

const getSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(30),
  name: Joi.string().trim(),
  slug: Joi.string().trim(),
  queryType: Joi.string().valid("default", "table", "card", "list"),
  showOnHomepage: Joi.boolean(),
});

const getBySlugSchema = {
  QUERY: Joi.object({
    queryType: Joi.string().valid("default", "list"),
  }),
  PARAMS: Joi.object({
    slug: Joi.string()
      .trim()
      .lowercase({ force: true })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required()
      .messages({
        "string.pattern.base":
          "Slug can only contain lowercase letters, numbers and hyphens",
      }),
  }),
};

const updateSchema = Joi.object({
  name: Joi.string().trim(),
  slug: Joi.string().trim(),
  description: Joi.string().trim(),
  products: Joi.array().items(Joi.string().required()),
  showOnHomepage: Joi.boolean(),
});

module.exports = { createSchema, getSchema, getBySlugSchema, updateSchema };
