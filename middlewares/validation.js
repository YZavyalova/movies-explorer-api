import { celebrate, Joi, Segments } from 'celebrate';
import validator from 'validator';

export const validateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Имя не может быть пустым',
        'string.min': 'Имя должно быть больше 2 символов',
        'string.max': 'Имя должно быть не больше 30 символов',
      }),
  }),
});

export const validateRegister = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть больше 8 символов',
    }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Имя не может быть пустым',
        'string.min': 'Имя должно быть больше 2 символов',
        'string.max': 'Имя должно быть не больше 30 символов',
      }),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть больше 8 символов',
    }),
  }),
});

export const validateMovie = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri().messages({
      'any.required': 'Cсылка не указана',
      'string.uri': 'Cсылка некорректная',
    }),
    trailerLink: Joi.string().required().uri().messages({
      'any.required': 'Cсылка не указана',
      'string.uri': 'Cсылка некорректная',
    }),
    thumbnail: Joi.string().required().uri().messages({
      'any.required': 'Cсылка не указана',
      'string.uri': 'Cсылка некорректная',
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

export const validateId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().length(24).hex().required()
      .messages({
        'any.required': 'id не может быть пустым',
        'string.length': 'длина id должна быть 24 символа',
      }),
  }),
});
