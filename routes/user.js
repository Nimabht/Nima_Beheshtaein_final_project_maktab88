import controllers from "../controllers/user.js";
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
  asyncMiddleware(controllers.getAllUsers)
);
router.get(
  "/:userId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
  asyncMiddleware(controllers.getUserById)
);

router.put(
  "/:userId",
  [checkSessionValidity, hasAccessByOwning],
  asyncMiddleware(controllers.updateUser)
);
router.delete(
  "/:userId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
  asyncMiddleware(controllers.deleteUser)
);
router.patch(
  "/update-avatar/:userId",
  [checkSessionValidity, hasAccessByOwning, uploadAvatar.single("avatar")],
  asyncMiddleware(controllers.updateUserAvatar)
);

export default router;
