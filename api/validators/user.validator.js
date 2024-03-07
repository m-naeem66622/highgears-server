const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().uppercase().required(),
  lastName: Joi.string().trim().uppercase().required(),
  gender: Joi.string()
    .trim()
    .uppercase()
    .valid("MALE", "FEMALE", "OTHER")
    .required(),
  email: Joi.string()
    .trim()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .required(),
  password: Joi.string().required(),
  address: Joi.object({
    country: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    street: Joi.string().trim(),
    zipCode: Joi.string().trim().required(),
  }).required(),
  phoneNumber: Joi.object({
    countryCode: Joi.string().trim().required(),
    dialCode: Joi.number().integer().required(),
    number: Joi.number().integer().required(),
    format: Joi.string().trim().required(),
  }).required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().uppercase().required(),
  lastName: Joi.string().trim().uppercase().required(),
  gender: Joi.string()
    .trim()
    .uppercase()
    .valid("MALE", "FEMALE", "OTHER")
    .required(),
  address: Joi.object({
    country: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    street: Joi.string().trim(),
    zipCode: Joi.string().trim().required(),
  }).required(),
  phoneNumber: Joi.object({
    countryCode: Joi.string().trim().required(),
    dialCode: Joi.string().trim().required(),
    number: Joi.string().trim().required(),
    format: Joi.string().trim().required(),
  }).required(),
  password: Joi.string().required(),
  oldPassword: Joi.string()
    .when("password", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .invalid(Joi.ref("password"))
    .messages({
      "any.invalid": "password and oldPassword must not be same",
    }),
})
  .with("oldPassword", "password")
  .label("password")
  .messages({
    "object.with": "password is required",
  });

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
