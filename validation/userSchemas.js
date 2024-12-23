const joi = require("joi");

const userSchema = joi.object({
  userName: joi
    .string()
    .max(30)
    .pattern(/^[a-z0-9]+$/)
    .messages({
      "string.empty": "Username can not be empty",
      "string.pattern.base":
        "Username must contain only lowercase letters and/or numbers",
    }),
  name: joi
    .string()
    .max(30)
    .messages({ "string.empty": "Name field cannot be empty." }),
  email: joi.string().email().required().messages({
    "string.empty": "Email field can not empty",
    "string.email": "Please enter a valid email address",
  }),
  password: joi
    .string()
    .pattern(
      new RegExp(
        '^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-{};:"<>,./?])(?=.*[0-9]).{8,}$'
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long",
      "string.empty": "Password cannot be empty.",
    }),
  role: joi.string().valid("tutor", "student").required().messages({
    "any.only": "Role must be one of tutor, student",
  }),
  keyWords: joi
    .array()
    .items(
      joi
        .string()
        .regex(/^#[^\s#]+$/)
        .min(2)
    ) // Ensure each keyword starts with # and keyword must be at least 2 characters
    .min(3) // Minimum 3 keywords
    .max(10) // Maximum 10 keywords
    .messages({
      "array.min": "At least 3 keywords are required",
      "array.max": "No more than 10 keywords are allowed",
      "string.pattern.base":
        "Each keyword must start with a hashtag (#) and must not contain spaces.",
      "array.items.min": "Each keyword must be at least 2 characters long",
    }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email can not be empty",
    "string.email": "Please enter a valid email address",
  }),
  password: joi
    .string()
    .required()
    .messages({ "string.empty": "Password cannot be empty." }),
});

const changePasswordSchema = joi.object({
  currentPassword: joi
    .string()
    .required()
    .messages({ "string.empty": "Current password cannot be empty." }),
  newPassword: joi
    .string()
    .pattern(
      new RegExp(
        '^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-{};:"<>,./?])(?=.*[0-9]).{8,}$'
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long",
      "string.empty": "New password cannot be empty.",
    }),
});

const updateSchema = joi
  .object({
    name: joi.string().max(30).optional().messages({
      "string.empty": "Name field can not be empty",
    }),
    email: joi.string().email().optional().messages({
      "string.empty": "Email field can not be empty",
      "string.email": "Enter a valid email address",
    }),
    location: joi.string().optional().messages({
      "string.empty": "Location field can not be empty",
    }),
  })
  .or("name", "email", "location");
module.exports = {
  userSchema,
  loginSchema,
  changePasswordSchema,
  updateSchema,
};
