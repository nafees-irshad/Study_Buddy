const joi = require("joi");

const assignmnetSchema = joi.object({
  title: joi
    .string()
    .max(30)
    .required()
    .messages({ "string.empty": "Title can not be empty" }),
  description: joi
    .string()
    .max(1000)
    .required()
    .messages({ "string.empty": "Description can not be empty" }),
  deadline: joi.date().required().empty("").messages({
    "any.required": "Date is required",
  }),
  baseRate: joi.number().required().min(1).messages({
    "any.required": "Base rate is required",
    "number.base": "Number must be a valid number",
    "number.min": "Number must be at least 1",
  }),
  subject: joi.string().max(100).required().messages({
    "string.empty": "Subject field can not be empty",
  }),
  complexityLevel: joi.string().required().messages({
    "string.empty": "Complexity level is required",
  }),
  assignmentType: joi.string().required().messages({
    "string.empty": "Kindly choose a field",
  }),
  keywords: joi.array().items(joi.string()).min(1).required().messages({
    "any.required": "Keywords are required",
    "array.min": "At least one keyword is required",
  }),
  attachments: joi
    .array()
    .items(
      joi.object({
        fileName: joi.string().required().messages({
          "any.required": "File name is required",
        }),
        fileUrl: joi.string().required().messages({
          "any.required": "File is required",
          "string.base": "File must word or PDF",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Attachments are required",
      "array.min": "At least one file is required",
    }),
});

module.exports = assignmnetSchema;
