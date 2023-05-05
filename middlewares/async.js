import AppError from "../utils/AppError.js";

export default function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      const ex = AppError.internal(error.message);
      return next(ex);
    }
  };
}
