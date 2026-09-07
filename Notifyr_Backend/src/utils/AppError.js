// Uniform error type so errorHandler.js can produce a consistent { error: { code, message } } shape.
export class AppError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}
