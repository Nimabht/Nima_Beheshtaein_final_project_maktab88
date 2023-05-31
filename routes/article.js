import controllers from "../controllers/article.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getArticle from "../middlewares/article/getArticle.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccessToData from "../middlewares/auth/hasAccessToData.js";
import countArticleView from "../middlewares/article/countArticleView.js";
import { uploadThumbnail, uploadImage } from "../utils/multerConfig.js";

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
  [checkSessionValidity, hasAccessToData],
  asyncMiddleware(controllers.updateArticle)
);

router.delete(
  "/:articleId",
  [checkSessionValidity, hasAccessToData],
  asyncMiddleware(controllers.deleteArticle)
);
router.patch(
  "/update-thumbnail/:articleId",
  [checkSessionValidity, hasAccessToData, uploadThumbnail.single("thumbnail")],
  asyncMiddleware(controllers.updateArticleThumbnail)
);

router.post(
  "/uploadImage",
  [checkSessionValidity, uploadImage.single("image")],
  asyncMiddleware(controllers.uploadArticleImage)
);
export default router;
