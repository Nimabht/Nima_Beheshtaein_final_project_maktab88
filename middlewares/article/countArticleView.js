import AppError from "../../utils/AppError.js";

export default async (req, res, next) => {
  try {
    const article = res.locals.article;
    const userId = req.session.user ? req.session.user.id : null;

    if (article.views.includes(userId) || article.views.includes(req.ip)) {
      return next();
    }

    if (req.session.user) {
      article.views.push(userId);
    } else {
      article.views.push(req.ip);
    }
    article.viewsCount++;
    await article.save();

    next();
  } catch (error) {
    const ex = AppError.internal(error.message);
    return next(ex);
  }
};
