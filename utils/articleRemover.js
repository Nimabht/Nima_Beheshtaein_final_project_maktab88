import { Comment } from "../models/comment.js";
import { Article } from "../models/article.js";
import fs from "node:fs/promises";
import { join } from "node:path";

export default async (articleId) => {
  const articlePromises = [];
  const article = await Article.findById(articleId);
  const path = join("public", "thumbnails", article.thumbnailFileName);
  articlePromises.push(fs.unlink(path));
  for (const image of article.imageFileNames) {
    const path = join("public", "articleImages", image);
    articlePromises.push(fs.unlink(path));
  }
  articlePromises.push(Comment.deleteMany({ article: article._id }));
  articlePromises.push(article.deleteOne());
  try {
    await Promise.all(articlePromises);
  } catch (error) {
    throw error;
  }
};
