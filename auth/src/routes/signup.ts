import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { body } from 'express-validator'
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';

import { User } from '../models/user';

const router = express.Router()

router.post('/api/users/signup', [
  body('email')
  .isEmail()
  .withMessage('Enter a valid email'),
  body('password')
  .trim()
  .isLength({min: 4, max: 10})
  .withMessage('Password should be minimum 4 & max 20 characters')
],
validateRequest,
async (req: Request, res: Response) => 
{
  const { email, password } = req.body
  const ExistingUser = await User.findOne({ email })

  if (ExistingUser) {
    throw new BadRequestError('Email in use')
  }

  const user = User.build({ email, password })
  await user.save()

  // generate json web token & store it on session object
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!)

  req.session = {
    jwt: userJwt
  }

  res.status(201).send(user)
});

export { router as SignUpRouter }