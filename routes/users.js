import { Router } from 'express';
import {
  getCurrentUser,
  updateProfile,
} from '../controllers/users.js';
import { validateProfile } from '../middlewares/validation.js';

const usersRouter = Router();

usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', validateProfile, updateProfile);

export default usersRouter;
