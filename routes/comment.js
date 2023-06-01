import controllers from "../controllers/comment.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
// import getComment from "../middlewares/article/getArticle.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccessToData from "../middlewares/auth/hasAccessToData.js";
import getComment from "../middlewares/comment/getComment.js";

const router = express.Router();

router.param("commentId", getComment);

// router.get("", asyncMiddleware(controllers.getAllArticles));
// router.get(
//   "/my-articles",
//   checkSessionValidity,
//   asyncMiddleware(controllers.getAllUserArticles)
// );
router.get("/:commentId", asyncMiddleware(controllers.getCommentById));
router.post(
  "/",
  checkSessionValidity,
  asyncMiddleware(controllers.createComment)
);

router.put(
  "/:commentId",
  [checkSessionValidity, hasAccessToData],
  asyncMiddleware(controllers.updateComment)
);

router.delete(
  "/:commentId",
  [checkSessionValidity, hasAccessToData],
  asyncMiddleware(controllers.deleteComment)
);
// router.patch(
//   "/update-thumbnail/:articleId",
//   [
//     checkSessionValidity,
//     hasAccessToArticle,
//     uploadThumbnail.single("thumbnail"),
//   ],
//   asyncMiddleware(controllers.updateArticleThumbnail)
// );

// router.post(
//   "/uploadImage",
//   [checkSessionValidity, uploadImage.single("image")],
//   asyncMiddleware(controllers.uploadArticleImage)
// );
export default router;
