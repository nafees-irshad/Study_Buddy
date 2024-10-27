const joi = require("joi");

const tutorSchema = joi.object({
  bio: joi
    .string()
    .max(1000)
    .required()
    .messages({ "string.empty": "Bio can not be empty" }),
  subjects: joi
    .array()
    .min(1)
    .required()
    .messages({
      "array.min": "At least one subject is required",
    })
    .items(
      joi.object({
        name: joi.string().required().messages({
          "string.empty": "subject name is required",
          "any.required": "subject name is required",
        }),
        yearsOfExperience: joi.number().min(0).required().messages({
          "number.base": "Years of experience must be a number",
          "number.min": "Years of experience cannot be less than 0",
          "any.required": "Experience is required",
        }),
        price: joi.number().min(1).required().messages({
          "number.base": "Price must be a number ",
          "number.min": "Price cannot be 0",
          "any.required": "Price is required",
        }),
      })
    ),
  qualification: joi.object({
    degree: joi
      .string()
      .required()
      .messages({ "string.empty": "plese choose a field" }),
  }),

  certification: joi.array().items(
    joi.object({
      title: joi
        .string()
        .required()
        .messages({ "string.empty": "Title field can not be empty" }),
      institution: joi
        .string()
        .required()
        .messages({ "string.empty": "Institution is required" }),
      year: joi
        .string()
        .pattern(/^\d{4}$/)
        .required()
        .messages({
          "string.pattern.base": "Date must be a valid date",
          "any.required": "Passing year is required", // For empty or missing field
        }),
    })
  ),
  rate: joi.number().min(1).required().messages({
    "any.required": "rate is required",
    "number.base": "rate must be above 0 ",
  }),
  paymentDetails: joi.string().required().messages({
    "any.required": "Please select a field",
    "string.empty": "Payment details can not be empty",
  }),
  accountNo: joi.string().required().messages({
    "any.required": "Bank account number is required",
    "string.empty": "Bank account number cannot be empty",
  }),
});

module.exports = tutorSchema;
