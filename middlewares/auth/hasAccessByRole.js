import AppError from "../../utils/AppError.js";

export default (allowedRoles) => (req, res, next) => {
  const session = req.session;
  const userRole = session.user.role;

  // Check if the user's role is included in the allowedRoles array
  if (allowedRoles.includes(userRole)) {
    return next();
  }

  const error = new AppError("Unauthorized", "fail", 401);
  return next(error);
};
