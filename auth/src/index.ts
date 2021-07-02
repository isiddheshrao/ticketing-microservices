import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { SignOutRouter } from './routes/signout';
import { SignUpRouter } from './routes/signup';
import { errorHandler, NotfoundError } from '@srticketapp/common';

const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
)

app.use(currentUserRouter)
app.use(signInRouter)
app.use(SignUpRouter)
app.use(SignOutRouter)

app.all('*', () => {
  throw new NotfoundError();
})

app.use(errorHandler)

// Database connectivity
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  
  try {
    await mongoose.connect(
      'mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Auth service on 3000')
  });
}

start();