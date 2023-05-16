import controllers from "../controllers/user.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getUser from "../middlewares/user/getUser.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccessById from "../middlewares/auth/hasAccessById.js";
import hasAccessByRole from "../middlewares/auth/hasAccessByRole.js";
import { uploadAvatar } from "../utils/multerConfig.js";

const router = express.Router();

router.param("userId", getUser);

router.get(
  "",
  [checkSessionValidity, hasAccessByRole(["admin"])],
  asyncMiddleware(controllers.getAllUsers)
);
router.get(
  "/:userId",
  [checkSessionValidity, hasAccessById],
  asyncMiddleware(controllers.getUserById)
);
// router.post("/", asyncMiddleware(controllers.createUser));
router.put(
  "/:userId",
  [checkSessionValidity, hasAccessById],
  asyncMiddleware(controllers.updateUser)
);
router.delete(
  "/:userId",
  [checkSessionValidity, hasAccessById],
  asyncMiddleware(controllers.deleteUser)
);
router.patch(
  "/update-avatar/:userId",
  [checkSessionValidity, hasAccessById, uploadAvatar.single("avatar")],
  asyncMiddleware(controllers.updateUserAvatar)
);

export default router;
