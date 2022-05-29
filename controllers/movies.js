import movieModel from '../models/movie.js';
import Forbidden from '../errors/Forbidden.js';
import ErrorNotFound from '../errors/ErrorNotFound.js';
import ValidationError from '../errors/ValidationError.js';

export const getMovies = (req, res, next) => {
  const owner = req.user._id;
  movieModel.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

export const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные в методы создания фильма'));
      } else {
        next(err);
      }
    });
};

export const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params.id)
    .orFail(() => new ErrorNotFound('Фильм не найден'))
    .then(({ owner }) => {
      if (owner.toString() === req.user._id) {
        movieModel.findByIdAndDelete(req.params.id).then(() => {
          res.send({ message: 'Фильм удалён' });
        });
      } else {
        throw new Forbidden('Недостаточно прав');
      }
    })
    .catch(next);
};
