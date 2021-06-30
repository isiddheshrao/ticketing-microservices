import { CustomError } from "./custom-error";

export class NotfoundError extends CustomError {
  statusCode = 404

  constructor() {
    super('Route not found')

    Object.setPrototypeOf(this, NotfoundError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Not found' }]
  }
}