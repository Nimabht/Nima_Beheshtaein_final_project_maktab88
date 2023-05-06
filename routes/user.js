import controllers from "../controllers/user.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getUser from "../middlewares/user/getUser.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccess from "../middlewares/auth/hasAccess.js";

const router = express.Router();

router.param("userId", getUser);

router.get(
  "/:userId",
  [checkSessionValidity, hasAccess],
  asyncMiddleware(controllers.getUserById)
);
// router.post("/", asyncMiddleware(controllers.createUser));
router.put(
  "/:userId",
  [checkSessionValidity, hasAccess],
  asyncMiddleware(controllers.updateUser)
);
router.delete(
  "/:userId",
  [checkSessionValidity, hasAccess],
  asyncMiddleware(controllers.deleteUser)
);
export default router;
