// import * as cheerio from "cheerio";
// import sharp from "sharp";
// import { fileURLToPath } from "url";
import AppError from "../utils/AppError.js";
import { join } from "node:path";
import fs from "node:fs/promises";
import resizeArticleThumbnail from "../utils/resizeImage/resizeArticleThumbnail.js";
import { User } from "../models/user.js";
import { Article } from "../models/article.js";
import validators from "../validators/article.js";
import paginate from "../utils/pagination.js";
// const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  getAllArticles: async (req, res, next) => {
    let { page, pageSize } = req.query;
    let query = Article.find()
      .populate("author", "-_id firstname lastname")
      .select("-views");
    if (page && pageSize) {
      query = paginate(query, page, pageSize);
    }
    const articles = await query.exec();
    res.send(articles);
  },
  getArticleById: (req, res, next) => {
    const filteredArticle = { ...res.locals.article.toObject() };
    delete filteredArticle.views;
    delete filteredArticle.__v;
    res.send(filteredArticle);
  },
  getAllUserArticles: async (req, res, next) => {
    const userId = req.session.user._id;
    let { page, pageSize } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    let query = Article.find({ author: userId })
      .populate("author", "-_id firstname lastname")
      .select("-views");
    if (page && pageSize) {
      query = paginate(query, page, pageSize);
    }
    const articles = await query.exec();
    res.send(articles);
  },
  createArticle: async (req, res, next) => {
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
    if (!sketch) {
      sketch = `Read this article that was written by ${user.firstname}...`;
    }
    const filename = await resizeArticleThumbnail(req.file);
    const article = new Article({
      title,
      sketch,
      content,
      author: userId,
      thumbnailFileName: filename,
    });
    await article.save();
    const filteredArticle = { ...article.toObject() };
    delete filteredArticle.content;
    delete filteredArticle.__v;

    res.status(201).send(filteredArticle);
  },
  // test: async (req, res, next) => {
  //   let htmlContent = req.body.content;
  //   const $ = cheerio.load(htmlContent);
  //   const imgTags = $("img");
  //   imgTags.each((index, element) => {
  //     const imgSrc = $(element).attr("src");
  //     const base64Data = imgSrc.replace(/^data:image\/\w+;base64,/, "");
  //     const imageDataBuffer = Buffer.from(base64Data, "base64");
  //     return sharp(imageDataBuffer)
  //       .resize(500, 500)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(
  //         join(
  //           __dirname,
  //           `../public/articleImages/${Date.now()}-image${index}.jpeg`
  //         )
  //       );
  //   });
  //   res.status(1).end();
  // },
  updateArticle: async (req, res, next) => {
    console.log(req.body);
    const { error, value } = validators.validateArticleForUpdate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    const { title, sketch, content } = value;
    const article = await Article.findOneAndUpdate(
      { _id: res.locals.article._id },
      { $set: { title, sketch, content } },
      { new: true }
    ).select("-views");

    // const filteredUser = { ...article.toObject() };
    // delete filteredUser.password;
    // delete filteredUser.__v;
    res.status(200).send(article);
  },
  updateArticleThumbnail: async (req, res, next) => {
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
  },
  deleteArticle: async (req, res, next) => {
    const article = res.locals.article;
    const path = join("public", "thumbnails", article.thumbnailFileName);
    await fs.unlink(path);
    await article.deleteOne();
    res.status(204).end();
  },
};
