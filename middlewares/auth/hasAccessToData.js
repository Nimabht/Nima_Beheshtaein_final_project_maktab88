import AppError from "../../utils/AppError.js";

//FIXME: if admin pass this middleware (that it passes through) he can edit the article or the comment. i should stop this and only give access to the admin for deleting the article or the comment.
export default (req, res, next) => {
  const session = req.session;
  //If user is admin, can access to the next middleware
  if (session.user.role === "admin") {
    return next();
  }
  //If user is blogger, can access to the next middleware if it's requested its own data (article / comment)

  let userIdInModel = "";
  if (!!res.locals.article) {
    userIdInModel = res.locals.article.author._id.toString();
  }
  if (!!res.locals.comment) {
    userIdInModel = res.locals.comment.user._id.toString();
  }
  if (userIdInModel === session.user._id) {
    return next();
  }

  const ex = new AppError("Unauthorized", "fail", 401);
  return next(ex);
};
