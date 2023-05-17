import controllers from "../controllers/article.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getArticle from "../middlewares/article/getArticle.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccessToArticle from "../middlewares/auth/hasAccessToArticle.js";
import countArticleView from "../middlewares/article/countArticleView.js";
import { uploadThumbnail } from "../utils/multerConfig.js";

const router = express.Router();

router.param("articleId", getArticle);

router.get("", asyncMiddleware(controllers.getAllArticles));
router.get(
  "/my-articles",
  checkSessionValidity,
  asyncMiddleware(controllers.getAllUserArticles)
);
router.get(
  "/:articleId",
  countArticleView,
  asyncMiddleware(controllers.getArticleById)
);
router.post(
  "/",
  [checkSessionValidity, uploadThumbnail.single("thumbnail")],
  asyncMiddleware(controllers.createArticle)
);

router.put(
  "/:articleId",
  [checkSessionValidity, hasAccessToArticle],
  asyncMiddleware(controllers.updateArticle)
);

router.delete(
  "/:articleId",
  [checkSessionValidity, hasAccessToArticle],
  asyncMiddleware(controllers.deleteArticle)
);
router.patch(
  "/update-thumbnail/:articleId",
  [
    checkSessionValidity,
    hasAccessToArticle,
    uploadThumbnail.single("thumbnail"),
  ],
  asyncMiddleware(controllers.updateArticleThumbnail)
);

export default router;
