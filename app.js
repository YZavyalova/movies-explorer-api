import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import errorHandler from './errors/errorHandler.js';
import { login, createUser, logout } from './controllers/users.js';
import { validateRegister, validateLogin } from './middlewares/validation.js';
import usersRouter from './routes/users.js';
import moviesRouter from './routes/movies.js';
import auth from './middlewares/auth.js';
import ErrorNotFound from './errors/ErrorNotFound.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

export const {
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
  BD,
} = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? BD : 'mongodb://localhost:27017/bitfilmsdb');

app.use(cors({
  origin: [
    'https://api.yzavyalova.movies.nomoredomains.sbs',
    'https://yzavyalova.movies.nomoredomains.sbs',
    'http://yzavyalova.movies.nomoredomains.sbs',
    'https://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// роуты, не требующие авторизации,
app.post('/signup', validateRegister, createUser);
app.post('/signin', validateLogin, login);
app.delete('/signout', logout);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use(() => {
  throw new ErrorNotFound('Страница не найдена');
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}...`);
});
