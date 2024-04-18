const Joi = require("joi");

const createOrder = Joi.object().keys({
  _id: Joi.string().length(24).hex().required(),
  products: Joi.array().items(
    Joi.object().keys({
      product: Joi.string().length(24).hex().required(),
      quantity: Joi.number().required(),
      price: Joi.number().required(),
      size: Joi.string().required(),
      color: Joi.string().required(),
    })
  ),
  itemsPrice: Joi.number().required(),
  shippingPrice: Joi.number().required(),
  discountedPrice: Joi.number().required(),
  totalPrice: Joi.number().required(),
  shippingAddress: Joi.object({
    country: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    street: Joi.string().trim(),
    zipCode: Joi.string().trim().required(),
  }).required(),
  paymentMethod: Joi.string().required(),
  paymentStatus: Joi.string()
    .uppercase({ force: true })
    .valid("PENDING", "PAID"),
});

const checkoutSchema = Joi.object().keys({
  products: Joi.array().items(
    Joi.object().keys({
      product: Joi.string().length(24).hex().required(),
      quantity: Joi.number().required(),
      size: Joi.string().required(),
      color: Joi.string().required(),
    })
  ),
});

const getSingleSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

const getSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(30),
  orderStatus: Joi.string()
    .uppercase({ force: true })
    .valid("PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"),
  exclude: Joi.array().items(
    "user",
    "products",
    "itemsPrice",
    "shippingPrice",
    "discountedPrice",
    "totalPrice",
    "paymentMethod",
    "orderStatus"
  ),
  include: Joi.object().keys({
    root: Joi.array().items(
      Joi.string().valid(
        "user",
        "products",
        "itemsPrice",
        "shippingPrice",
        "discountedPrice",
        "totalPrice",
        "paymentMethod",
        "orderStatus"
      )
    ),
    user: Joi.array().items(
      Joi.string().valid(
        "firstName",
        "lastName",
        "gender",
        "email",
        "address",
        "phoneNumber"
      )
    ),
    products: Joi.array().items(
      Joi.string().valid(
        "images",
        "name",
        "description",
        "sku",
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
  }),
  queryType: Joi.string().valid("default", "table"),
});

const updateSchema = Joi.object({
  orderStatus: Joi.string()
    .uppercase()
    .when("$role", {
      is: "ADMIN",
      then: Joi.valid(
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED"
      ).required(),
      otherwise: Joi.valid("CANCELLED").required(),
    }),
});

module.exports = {
  createOrder,
  checkoutSchema,
  getSingleSchema,
  getSchema,
  updateSchema,
};
