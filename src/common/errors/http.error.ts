export default class HttpError extends Error {
  public statusCode: number;
  public isOperational: boolean = true;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
