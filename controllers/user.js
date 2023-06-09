import { User } from "../models/user.js";
import validators from "../validators/user.js";
import AppError from "../utils/AppError.js";
import { join, basename } from "node:path";
import fs from "node:fs/promises";
import resizeUserAvatar from "../utils/resizeImage/resizeUserAvatar.js";
import { Article } from "../models/article.js";
import articleRemover from "../utils/articleRemover.js";
import { Comment } from "../models/comment.js";
import userSearch from "../utils/userSearch.js";
import paginate from "../utils/pagination.js";

class UserController {
  async getAllUsers(req, res, next) {
    let { page, pageSize, search } = req.query;
    let query;
    if (!!search) {
      query = userSearch(search);
    } else {
      query = User.find().select("-__v -password");
    }
    const queryCopy = query.clone();
    const total = (await queryCopy.exec()).length;
    if (!!page && !!pageSize) {
      query = paginate(query, page, pageSize);
    }
    const users = await query.sort({ createdAt: -1 }).exec();
    res.json({
      total,
      page: Math.max(1, parseInt(page) || 1),
      data: users,
    });
  }

  getUserById(req, res, next) {
    res.send(res.locals.user);
  }

  async updateUser(req, res, next) {
    const { error, value } = validators.validateUserForUpdate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    // Check if username already exists in database
    let existingUser = await User.findOne({
      username: value.username,
      _id: { $ne: res.locals.user._id }, // exclude user with specified id
    });
    if (!!existingUser) {
      const ex = AppError.badRequest("Use another username.");
      return next(ex);
    }
    const { firstname, lastname, username, gender } = value;

    const user = await User.findOneAndUpdate(
      { _id: res.locals.user._id },
      { $set: { firstname, lastname, username, gender } },
      { new: true }
    );
    const filteredUser = { ...user.toObject() };
    delete filteredUser.password;
    delete filteredUser.__v;
    res.status(200).send(filteredUser);
  }

  async updateUserAvatar(req, res, next) {
    if (!req.file) {
      const ex = AppError.badRequest("File is empty.");
      return next(ex);
    }

    const user = res.locals.user;
    // delete the previous avatar
    if (
      user.avatarFileName !== "male-anonymous.png" &&
      user.avatarFileName !== "female-anonymous.png"
    ) {
      const path = join("public", "avatars", user.avatarFileName);
      await fs.unlink(path);
    }
    const filename = await resizeUserAvatar(req.file);
    user.avatarFileName = filename;
    await user.save();
    res.status(200).end();
  }

  async deleteUser(req, res, next) {
    const user = res.locals.user;
    const userArticles = await Article.find({ author: user._id });
    for (const article of userArticles) {
      await articleRemover(article._id);
    }
    await Comment.deleteMany({ user: user._id });
    if (
      user.avatarFileName !== "male-anonymous.png" &&
      user.avatarFileName !== "female-anonymous.png"
    ) {
      const path = join("public", "avatars", user.avatarFileName);
      await fs.unlink(path);
    }

    await user.deleteOne();
    res.status(204).end();
  }
}

const userController = new UserController();
export default userController;
