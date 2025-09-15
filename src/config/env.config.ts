import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // APP
  NODE_ENV: Joi.string().required().messages({
    'any.required': 'The environment variable NODE_ENV is required',
  }),
  BACKEND_URL: Joi.string().required().messages({
    'any.required': 'The environment variable BACKEND_URL is required',
  }),
  PORT: Joi.number().default(3000),

  // DATABASE
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
  USE_MIGRATIONS: Joi.boolean().default(true).messages({
    'boolean.base': 'The environment variable USE_MIGRATIONS must be a boolean',
  }),

  // AUTH
  JWT_SECRET: Joi.string().required().messages({
    'any.required': 'The environment variable JWT_SECRET is required',
  }),

  // CONFIGURATION
  // CORS
  ORIGIN: Joi.string().required().messages({
    'any.required': 'The environment variable CORS is required',
  }),

  // Rate limiting configuration
  THROTTLE_TTL: Joi.number().default(60000).messages({
    'number.base': 'The environment variable THROTTLE_TTL must be a number',
  }),
  THROTTLE_LIMIT: Joi.number().default(100).messages({
    'number.base': 'The environment variable THROTTLE_LIMIT must be a number',
  }),

  // Cache configuration
  CACHE_TTL: Joi.number().default(10).messages({
    'number.base': 'The environment variable CACHE_TTL must be a number',
  }),
  CACHE_MAX: Joi.number().default(100).messages({
    'number.base': 'The environment variable CACHE_MAX must be a number',
  }),
  CACHE_STORE: Joi.string().default('memory').messages({
    'string.base': 'The environment variable CACHE_STORE must be a string',
  }),
  // JWT configuration
  JWT_EXPIRES_IN: Joi.alternatives()
    .try(Joi.number(), Joi.string())
    .default('30m')
    .messages({
      'alternatives.types':
        'The environment variable JWT_EXPIRES_IN must be a number (seconds) or a string',
    }),

  REFRESH_TOKEN_EXPIRES_IN: Joi.alternatives()
    .try(Joi.number(), Joi.string())
    .default('5d')
    .messages({
      'alternatives.types':
        'The environment variable REFRESH_TOKEN_EXPIRES_IN must be a number (seconds) or a string',
    }),

  REMEMBER_ME_TOKEN_EXPIRES_IN: Joi.alternatives()
    .try(Joi.number(), Joi.string())
    .default('15d')
    .messages({
      'alternatives.types':
        'The environment variable REMEMBER_ME_TOKEN_EXPIRES_IN must be a number (seconds) or a string',
    }),

  // Maximum attempts to request the .env variables
  DEFAULT_LIMIT: Joi.number().default(5),
});
