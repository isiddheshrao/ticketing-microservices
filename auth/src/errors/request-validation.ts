import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    // Have to do the next line since we are extending a built in object & using typescript
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param }
    })
  }
}