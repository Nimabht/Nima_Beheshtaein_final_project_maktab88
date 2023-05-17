import AppError from "../../utils/AppError.js";
import isValidObjectId from "../../validators/ObjectId.js";
import { Article } from "../../models/article.js";

export default async function (req, res, next, articleId) {
  try {
    if (!isValidObjectId(articleId)) {
      const ex = AppError.badRequest("Invalid articleId");
      return next(ex);
    }
    const article = await Article.findById(articleId).select("-__v -views");
    if (!article) {
      const ex = AppError.notFound("Article not found");
      return next(ex);
    }
    res.locals.article = article;
    next();
  } catch (error) {
    const ex = AppError.internal(error.message);
    return next(ex);
  }
}
