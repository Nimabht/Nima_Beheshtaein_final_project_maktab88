import AppError from "../../utils/AppError.js";

export default (req, res, next) => {
  const session = req.session;

  let userIdInModel = "";
  if (!!res.locals.article) {
    userIdInModel = res.locals.article.author._id.toString();
  } else if (!!res.locals.comment) {
    userIdInModel = res.locals.comment.user._id.toString();
  } else if (!!res.locals.user) {
    console.log(res.locals.user);
    userIdInModel = res.locals.user._id.toString();
  }

  if (userIdInModel === session.user._id) {
    return next();
  }

  const ex = new AppError("Forbidden", "fail", 403);
  return next(ex);
};
