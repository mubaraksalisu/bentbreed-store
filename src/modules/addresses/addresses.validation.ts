import Joi from "joi";

export const createAddressSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  fullName: Joi.string().min(3).max(100).required().trim(),
  phoneNumber: Joi.string().min(10).max(20).required().trim(),
  addressLine1: Joi.string().min(5).max(255).required().trim(),
  addressLine2: Joi.string().min(5).max(255).trim(),
  city: Joi.string().min(2).max(100).required().trim(),
  state: Joi.string().min(2).max(100).required().trim(),
  postalCode: Joi.string().min(3).max(20).trim(),
  country: Joi.string().min(2).max(100).required().trim(),
});
