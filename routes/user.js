import controllers from "../controllers/user.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getUser from "../middlewares/user/getUser.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccess from "../middlewares/auth/hasAccess.js";
import { upload } from "../utils/multerConfig.js";

const router = express.Router();

router.param("userId", getUser);

router.use([checkSessionValidity, hasAccess]);

router.get("/:userId", asyncMiddleware(controllers.getUserById));
// router.post("/", asyncMiddleware(controllers.createUser));
router.put("/:userId", asyncMiddleware(controllers.updateUser));
router.delete("/:userId", asyncMiddleware(controllers.deleteUser));
router.patch(
  "/update-avatar/:userId",
  upload.single("avatar"),
  asyncMiddleware(controllers.updateUserAvatar)
);

export default router;
