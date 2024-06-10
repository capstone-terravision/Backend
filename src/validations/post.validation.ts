import Joi from "joi";

export const createProperty = {
  body: Joi.object({
    propertyName: Joi.string().required().messages({
      "string.empty": "Property name is required",
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required",
    }),
    bedroom: Joi.number().integer().positive().required().messages({
      "number.base": "Bedroom must be a number",
      "number.integer": "Bedroom must be an integer",
      "number.positive": "Bedroom must be a positive number",
      "any.required": "Bedroom is required",
    }),
    bathroom: Joi.number().integer().positive().required().messages({
      "number.base": "Bathroom must be a number",
      "number.integer": "Bathroom must be an integer",
      "number.positive": "Bathroom must be a positive number",
      "any.required": "Bathroom is required",
    }),
    buildingArea: Joi.number().positive().required().messages({
      "number.base": "Building area must be a number",
      "number.positive": "Building area must be a positive number",
      "any.required": "Building area is required",
    }),
    landArea: Joi.number().positive().required().messages({
      "number.base": "Land area must be a number",
      "number.positive": "Land area must be a positive number",
      "any.required": "Land area is required",
    }),
    floor: Joi.number().integer().positive().required().messages({
      "number.base": "Floor must be a number",
      "number.integer": "Floor must be an integer",
      "number.positive": "Floor must be a positive number",
      "any.required": "Floor is required",
    }),
    year: Joi.number().integer().positive().required().messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be an integer",
      "number.positive": "Year must be a positive number",
      "any.required": "Year is required",
    }),
  }),
};
