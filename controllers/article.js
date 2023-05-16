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

// const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  getAllArticles: async (req, res, next) => {
    const articles = await Article.find().populate(
      "author",
      "-_id firstname lastname"
    );
    res.send(articles);
  },
  getArticleById: (req, res, next) => {
    res.send(res.locals.article);
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
  //   updateUser: async (req, res, next) => {
  //     const { error, value } = validators.validateUserForUpdate(req.body);
  //     if (!!error) {
  //       const ex = AppError.badRequest(error.details[0].message);
  //       return next(ex);
  //     }
  //     // Check if username already exists in database
  //     let existingUser = await User.findOne({
  //       username: value.username,
  //       _id: { $ne: res.locals.user._id }, // exclude user with specified id
  //     });
  //     if (!!existingUser) {
  //       const ex = AppError.badRequest("Use another username.");
  //       return next(ex);
  //     }
  //     const { firstname, lastname, username, gender } = value;
  //     const user = await User.findOneAndUpdate(
  //       { _id: res.locals.user._id },
  //       { $set: { firstname, lastname, username, gender } },
  //       { new: true }
  //     );
  //     console.log(user);
  //     const filteredUser = { ...user.toObject() };
  //     delete filteredUser.password;
  //     delete filteredUser.__v;
  //     res.status(200).send(filteredUser);
  //   },
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
