import { Router } from 'express';
import {
  getMovies,
  createMovie,
  deleteMovie,
} from '../controllers/movies.js';

import { validateMovie, validateId } from '../middlewares/validation.js';

const moviesRouter = Router();

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateMovie, createMovie);
moviesRouter.delete('/movies/:id', validateId, deleteMovie);

export default moviesRouter;
