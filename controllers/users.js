import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ValidationError from '../errors/ValidationError.js';
import ErrorConflict from '../errors/ErrorConflict.js';
import ErrorNotFound from '../errors/ErrorNotFound.js';

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;

export const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new ErrorNotFound())
    .then((user) => res.status(200).send(user))
    .catch(next);
};

export const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        throw new ErrorConflict();
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send({ user }))
    .catch(next);
};

export const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new ErrorNotFound())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные в методы обновления профиля'));
      } else if (err.codeName === 'DuplicateKey') {
        next(new ErrorConflict());
      } else {
        next(err);
      }
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          expires: new Date(Date.now() + 7 * 24 * 3600000),
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

export const logout = (req, res, next) => {
  res.clearCookie('jwt');
  next();
};
