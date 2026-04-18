import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().min(3).max(100).required().trim(),
  lastName: Joi.string().min(3).max(100).required().trim(),
  phoneNumber: Joi.string().min(10).max(20).required().trim(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
