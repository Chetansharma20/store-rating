const Joi = require('joi');
const AppError = require('./appError');

const userValidationSchema = Joi.object({
  name: Joi.string().min(20).max(60).messages({
    'string.min': "Name must be between 20 and 60 characters.",
    'string.max': "Name must be between 20 and 60 characters."
  }),
  address: Joi.string().max(400).allow('', null).messages({
    'string.max': "Address must be at most 400 characters."
  }),
  email: Joi.string().email({ tlds: { allow: false } }).messages({
    'string.email': "Email must follow standard validation rules."
  }),
  password: Joi.string().min(8).max(16)
    .pattern(/[A-Z]/)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/)
    .messages({
      'string.min': "Password must be between 8 and 16 characters.",
      'string.max': "Password must be between 8 and 16 characters.",
      'string.pattern.base': "Password must include at least one uppercase letter and one special character."
    })
});

const validateUserFields = (data) => {
  const { error } = userValidationSchema.validate(data, { abortEarly: true });
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
};

module.exports = {
  validateUserFields,
};
