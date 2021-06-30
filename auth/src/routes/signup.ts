import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import { RequestValidationError } from '../errors/request-validation';
// import { DatabaseConnectionError } from '../errors/database-connection-errror';
import { BadRequestError } from '../errors/bad-request-error';

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
], async (req: Request, res: Response) => {
  
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }
  const { email, password } = req.body
  const ExistingUser = await User.findOne({ email })

  if (ExistingUser) {
    throw new BadRequestError('Email in use')
  }

  const user = User.build({ email, password })
  await user.save()
  res.status(201).send(user)
});

export { router as SignUpRouter }