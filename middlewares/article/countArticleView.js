import AppError from "../../utils/AppError.js";

export default async (req, res, next) => {
  try {
    const article = res.locals.article;
    const sessionId = req.session ? req.session.id : null;

    if (article.views.includes(sessionId) || article.views.includes(req.ip)) {
      return next();
    }

    if (req.session) {
      article.views.push(sessionId);
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
