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
    const results = await Promise.allSettled(articlePromises);
    const hasError = results.some((result) => result.status === "rejected");
    if (hasError) {
      // Handle the error
      throw new Error("An error occurred. Promises undone.");
    }
  } catch (error) {
    throw error;
  }
};

// import { Comment } from "../models/comment.js";
// import { Article } from "../models/article.js";
// import fs from "node:fs/promises";
// import { join } from "node:path";

// export default async (articleId) => {
//   const articlePromises = [];
//   const article = await Article.findById(articleId);
//   const path = join("public", "thumbnails", article.thumbnailFileName);
//   articlePromises.push(fs.unlink(path));
//   for (const image of article.imageFileNames) {
//     const path = join("public", "articleImages", image);
//     articlePromises.push(fs.unlink(path));
//   }
//   articlePromises.push(Comment.deleteMany({ article: article._id }));
//   articlePromises.push(article.deleteOne());
//   try {
//     //FIXME: use promise all setter
//     await Promise.all(articlePromises);
//   } catch (error) {
//     throw error;
//   }
// };
