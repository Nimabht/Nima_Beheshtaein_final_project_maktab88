import controllers from "../controllers/comment.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import getComment from "../middlewares/comment/getComment.js";
import hasAccessByOwning from "../middlewares/auth/hasAccessByOwning.js";
import hasAccessByAdminOrOwner from "../middlewares/auth/hasAccessByAdminOrOwner.js";
import hasAccessByRole from "../middlewares/auth/hasAccessByRole.js";

const router = express.Router();

router.param("commentId", getComment);

router.get(
  "",
  [checkSessionValidity, hasAccessByRole(["admin"])],
  asyncMiddleware(controllers.getAllComments)
);
router.get(
  "/my-comments",
  checkSessionValidity,
  asyncMiddleware(controllers.getAllUserComments)
);
router.get("/:commentId", asyncMiddleware(controllers.getCommentById));
router.post(
  "/",
  checkSessionValidity,
  asyncMiddleware(controllers.createComment)
);

router.put(
  "/:commentId",
  [checkSessionValidity, hasAccessByOwning],
  asyncMiddleware(controllers.updateComment)
);

router.delete(
  "/:commentId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
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
