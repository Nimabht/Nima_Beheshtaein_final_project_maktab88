import articleController from "../controllers/article.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getArticle from "../middlewares/article/getArticle.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
// import hasAccessToData from "../middlewares/auth/hasAccessToData.js";
import countArticleView from "../middlewares/article/countArticleView.js";
import { uploadThumbnail, uploadImage } from "../utils/multerConfig.js";
import hasAccessByOwning from "../middlewares/auth/hasAccessByOwning.js";
import hasAccessByAdminOrOwner from "../middlewares/auth/hasAccessByAdminOrOwner.js";
const router = express.Router();

router.param("articleId", getArticle);

router.get("", asyncMiddleware(articleController.getAllArticles));
router.get(
  "/my-articles",
  checkSessionValidity,
  asyncMiddleware(articleController.getAllUserArticles)
);
router.get(
  "/:articleId",
  countArticleView,
  asyncMiddleware(articleController.getArticleById)
);
router.post(
  "/",
  [checkSessionValidity, uploadThumbnail.single("thumbnail")],
  asyncMiddleware(articleController.createArticle)
);

router.put(
  "/:articleId",
  [checkSessionValidity, hasAccessByOwning],
  asyncMiddleware(articleController.updateArticle)
);

router.delete(
  "/:articleId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
  asyncMiddleware(articleController.deleteArticle)
);
router.patch(
  "/update-thumbnail/:articleId",
  [
    checkSessionValidity,
    hasAccessByOwning,
    uploadThumbnail.single("thumbnail"),
  ],
  asyncMiddleware(articleController.updateArticleThumbnail)
);

router.post(
  "/uploadImage",
  [checkSessionValidity, uploadImage.single("image")],
  asyncMiddleware(articleController.uploadArticleImage)
);
export default router;
