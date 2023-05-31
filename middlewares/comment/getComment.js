import AppError from "../../utils/AppError.js";
import isValidObjectId from "../../validators/ObjectId.js";
import { Comment } from "../../models/comment.js";

export default async function (req, res, next, commentId) {
  try {
    if (!isValidObjectId(commentId)) {
      const ex = AppError.badRequest("Invalid commentId");
      return next(ex);
    }
    let comment = await Comment.findById(commentId);
    if (!comment) {
      const ex = AppError.notFound("Comment not found");
      return next(ex);
    }
    comment = await Comment.findById(commentId)
      .populate("user", "_id firstname lastname avatarFileName")
      .select("-__v");
    res.locals.comment = comment;
    next();
  } catch (error) {
    const ex = AppError.internal(error.message);
    return next(ex);
  }
}
