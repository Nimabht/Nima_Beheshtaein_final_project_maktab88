import userController from "../controllers/user.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getUser from "../middlewares/user/getUser.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccessByRole from "../middlewares/auth/hasAccessByRole.js";
import { uploadAvatar } from "../utils/multerConfig.js";
import hasAccessByOwning from "../middlewares/auth/hasAccessByOwning.js";
import hasAccessByAdminOrOwner from "../middlewares/auth/hasAccessByAdminOrOwner.js";
const router = express.Router();

router.param("userId", getUser);

router.get(
  "",
  [checkSessionValidity, hasAccessByRole(["admin"])],
  asyncMiddleware(userController.getAllUsers)
);
router.get(
  "/:userId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
  asyncMiddleware(userController.getUserById)
);

router.put(
  "/:userId",
  [checkSessionValidity, hasAccessByOwning],
  asyncMiddleware(userController.updateUser)
);
router.delete(
  "/:userId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
  asyncMiddleware(userController.deleteUser)
);
router.patch(
  "/update-avatar/:userId",
  [checkSessionValidity, hasAccessByOwning, uploadAvatar.single("avatar")],
  asyncMiddleware(userController.updateUserAvatar)
);

export default router;
