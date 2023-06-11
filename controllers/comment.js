import AppError from "../utils/AppError.js";
// import { User } from "../models/user.js";
import { Article } from "../models/article.js";
import { Comment } from "../models/comment.js";
import validators from "../validators/comment.js";
import paginate from "../utils/pagination.js";

class CommentController {
  getCommentById(req, res, next) {
    const filteredComment = { ...res.locals.comment.toObject() };
    delete filteredComment.__v;
    res.send(filteredComment);
  }

  async getAllComments(req, res, next) {
    let { page, pageSize } = req.query;
    let query = Comment.find()
      .populate("article", " _id title ")
      .populate("user", "_id firstname lastname");

    const queryCopy = query.clone();
    const total = (await queryCopy.exec()).length;
    if (!!page && !!pageSize) {
      query = paginate(query, page, pageSize);
    }
    const comments = await query.sort({ createdAt: -1 }).exec();

    res.json({
      total,
      page: Math.max(1, parseInt(page) || 1),
      data: comments,
    });
  }

  async getAllUserComments(req, res, next) {
    const userId = req.session.user._id;
    let comments = await Comment.find({ user: userId });
    res.send(comments);
  }

  async createComment(req, res, next) {
    const { error, value } = validators.validateCommentForCreate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }

    const { content, articleId } = value;
    const article = await Article.findById(articleId);
    if (!article) {
      const ex = AppError.badRequest("Article not found");
      return next(ex);
    }

    const userId = req.session.user._id;

    const comment = new Comment({
      article: articleId,
      content,
      user: userId,
    });

    await Article.findByIdAndUpdate(articleId, {
      $push: { comments: comment._id },
    });

    await comment.save();
    const filteredComment = { ...comment.toObject() };
    delete filteredComment.__v;

    res.status(201).send(filteredComment);
  }

  async updateComment(req, res, next) {
    const { error, value } = validators.validateCommentForUpdate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    const { content } = value;
    const comment = await Comment.findByIdAndUpdate(
      {
        _id: res.locals.comment._id,
      },
      { $set: { content } },
      { new: true }
    ).select("-__v");
    res.status(200).send(comment);
  }

  async deleteComment(req, res, next) {
    const comment = res.locals.comment;
    await comment.deleteOne();
    res.status(204).end();
  }
}
const commentController = new CommentController();
export default commentController;

// export default {
//   getCommentById: (req, res, next) => {
//     const filteredComment = { ...res.locals.comment.toObject() };
//     delete filteredComment.__v;
//     res.send(filteredComment);
//   },
//   getAllComments: async (req, res, next) => {
//     let { page, pageSize } = req.query;
//     let query = Comment.find()
//       .populate("article", " _id title ")
//       .populate("user", "_id firstname lastname");

//     const queryCopy = query.clone();
//     const total = (await queryCopy.exec()).length;
//     if (!!page && !!pageSize) {
//       query = paginate(query, page, pageSize);
//     }
//     const comments = await query.sort({ createdAt: -1 }).exec();

//     res.json({
//       total,
//       page: Math.max(1, parseInt(page) || 1),
//       data: comments,
//     });
//     // let comments = await Comment.find()
//     //   .populate("article", " _id title ")
//     //   .populate("user", "_id firstname lastname");
//     // res.send(comments);
//   },
//   getAllUserComments: async (req, res, next) => {
//     const userId = req.session.user._id;
//     let comments = await Comment.find({ user: userId });
//     res.send(comments);
//   },
//   createComment: async (req, res, next) => {
//     const { error, value } = validators.validateCommentForCreate(req.body);
//     if (!!error) {
//       const ex = AppError.badRequest(error.details[0].message);
//       return next(ex);
//     }

//     const { content, articleId } = value;
//     const article = await Article.findById(articleId);
//     if (!article) {
//       const ex = AppError.badRequest("Article not found");
//       return next(ex);
//     }

//     const userId = req.session.user._id;

//     const comment = new Comment({
//       article: articleId,
//       content,
//       user: userId,
//     });

//     await Article.findByIdAndUpdate(articleId, {
//       $push: { comments: comment._id },
//     });

//     await comment.save();
//     const filteredComment = { ...comment.toObject() };
//     delete filteredComment.__v;

//     res.status(201).send(filteredComment);
//   },
//   updateComment: async (req, res, next) => {
//     const { error, value } = validators.validateCommentForUpdate(req.body);
//     if (!!error) {
//       const ex = AppError.badRequest(error.details[0].message);
//       return next(ex);
//     }
//     const { content } = value;
//     const comment = await Comment.findByIdAndUpdate(
//       {
//         _id: res.locals.comment._id,
//       },
//       { $set: { content } },
//       { new: true }
//     ).select("-__v");
//     res.status(200).send(comment);
//   },
//   deleteComment: async (req, res, next) => {
//     const comment = res.locals.comment;
//     await comment.deleteOne();
//     res.status(204).end();
//   },
// };
