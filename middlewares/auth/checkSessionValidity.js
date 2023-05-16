import AppError from "../../utils/AppError.js";

export default (req, res, next) => {
  const session = req.session;
  if (!session || !session.user) {
    // session not found or user not logged in
    const ex = new AppError("Unauthorized", "fail", 401);
    return next(ex);
  }

  next();
};
