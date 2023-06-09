import AppError from "../utils/AppError.js";
import { join } from "node:path";
import fs from "node:fs/promises";
import resizeArticleThumbnail from "../utils/resizeImage/resizeArticleThumbnail.js";
import resizeArticleImage from "../utils/resizeImage/resizeArticleImage.js";
import { User } from "../models/user.js";
import { Article } from "../models/article.js";
import validators from "../validators/article.js";
import paginate from "../utils/pagination.js";
import articleSearch from "../utils/articleSearch.js";
import articleRemover from "../utils/articleRemover.js";

class ArticleController {
  async getAllArticles(req, res, next) {
    let { page, pageSize, search } = req.query;
    let query;

    if (!!search) {
      query = articleSearch(search);
    } else {
      query = Article.find()
        .populate("author", "-_id firstname lastname avatarFileName")
        .select("-views");
    }
    const queryCopy = query.clone();
    const total = (await queryCopy.exec()).length;
    if (!!page && !!pageSize) {
      query = paginate(query, page, pageSize);
    }

    const articles = await query.sort({ createdAt: -1 }).exec();
    res.json({
      total,
      page: Math.max(1, parseInt(page) || 1),
      data: articles,
    });
  }

  getArticleById(req, res, next) {
    const filteredArticle = { ...res.locals.article.toObject() };
    delete filteredArticle.views;
    delete filteredArticle.__v;
    res.send(filteredArticle);
  }

  async getAllUserArticles(req, res, next) {
    const userId = req.session.user._id;
    let { page, pageSize } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    let query = Article.find({ author: userId })
      .populate("author", "-_id firstname lastname avatarFileName")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "_id firstname lastname avatarFileName",
        },
      })
      .select("-views");
    if (page && pageSize) {
      query = paginate(query, page, pageSize);
    }
    const articles = await query.exec();
    res.json({
      total: await Article.countDocuments({ author: userId }),
      page: Math.max(1, parseInt(page) || 1),
      data: articles,
    });
  }

  async createArticle(req, res, next) {
    const { error, value } = validators.validateArticleForCreate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    if (!req.file) {
      const ex = AppError.badRequest("File is empty.");
      return next(ex);
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    let { title, sketch, content } = value;
    //sketch handling
    if (!sketch) {
      sketch = `Read this article that was written by ${user.firstname}...`;
    }
    //thumbnail handling
    const filename = await resizeArticleThumbnail(req.file);
    //article Image handling
    let imageFileNames = [];
    for (const block of JSON.parse(content).blocks) {
      if (block.type == "image") {
        const fileUrl = block.data.file.url;
        const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        imageFileNames.push(filename);
      }
    }
    const article = new Article({
      title,
      sketch,
      content,
      author: userId,
      thumbnailFileName: filename,
      imageFileNames,
    });
    await article.save();
    const filteredArticle = { ...article.toObject() };
    delete filteredArticle.content;
    delete filteredArticle.__v;

    res.status(201).send(filteredArticle);
  }

  async updateArticle(req, res, next) {
    const { error, value } = validators.validateArticleForUpdate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    const { title, sketch, content } = value;

    let newImageFileNames = [];
    for (const block of JSON.parse(content).blocks) {
      if (block.type == "image") {
        const fileUrl = block.data.file.url;
        const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        newImageFileNames.push(filename);
      }
    }
    const prevImageFileNames = res.locals.article.imageFileNames;
    const deprecatedImages = prevImageFileNames.filter(
      (item) => !newImageFileNames.includes(item)
    );
    for (const image of deprecatedImages) {
      const path = join("public", "articleImages", image);
      await fs.unlink(path);
    }
    const article = await Article.findOneAndUpdate(
      { _id: res.locals.article._id },
      { $set: { title, sketch, content, imageFileNames: newImageFileNames } },
      { new: true }
    ).select("-views");

    res.status(200).send(article);
  }

  async updateArticleThumbnail(req, res, next) {
    if (!req.file) {
      const ex = AppError.badRequest("File is empty.");
      return next(ex);
    }
    const article = res.locals.article;

    // delete the previous thumbnail
    const path = join("public", "thumbnails", article.thumbnailFileName);
    await fs.unlink(path);

    const filename = await resizeArticleThumbnail(req.file);
    article.thumbnailFileName = filename;
    await article.save();
    res.status(200).end();
  }

  async uploadArticleImage(req, res, next) {
    if (!req.file) {
      const ex = AppError.badRequest("File is empty.");
      return next(ex);
    }
    const filename = await resizeArticleImage(req.file);

    res.status(200).json({
      success: 1,
      file: {
        url: `/articleImages/${filename}`,
      },
    });
  }

  async deleteArticle(req, res, next) {
    const article = res.locals.article;
    await articleRemover(article._id);
    res.status(204).end();
  }
}

const articleController = new ArticleController();

export default articleController;
