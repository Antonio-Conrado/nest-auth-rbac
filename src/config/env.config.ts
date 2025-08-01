import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required().messages({
    'any.required': 'The environment variable NODE_ENV is required',
  }),
  BACKEND_URL: Joi.string().required().messages({
    'any.required': 'The environment variable BACKEND_URL is required',
  }),
  DATABASE_HOST: Joi.string().required().messages({
    'any.required': 'The environment variable DATABASE_HOST is required',
  }),
  DATABASE_PORT: Joi.number().required().messages({
    'any.required': 'The environment variable DATABASE_PORT is required',
  }),
  DATABASE_USER: Joi.string().required().messages({
    'any.required': 'The environment variable DATABASE_USER is required',
  }),
  DATABASE_PASSWORD: Joi.string().required().messages({
    'any.required': 'The environment variable DATABASE_PASSWORD is required',
  }),
  DATABASE_NAME: Joi.string().required().messages({
    'any.required': 'The environment variable DATABASE_NAME is required',
  }),
  JWT_SECRET: Joi.string().required().messages({
    'any.required': 'The environment variable JWT_SECRET is required',
  }),
  PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(5),
});
