class AppError extends Error {
  constructor(message, status, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new AppError(message, "fail", 400);
  }

  static notFound(message) {
    return new AppError(message, "fail", 404);
  }

  static internal(message) {
    return new AppError(message, "error", 500);
  }
}

export default AppError;
