import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import controllers from "../controllers/auth.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import hasAccess from "../middlewares/auth/hasAccessById.js";
import getUser from "../middlewares/user/getUser.js";
const router = express.Router();

router.param("userId", getUser);

router.post("/signup", asyncMiddleware(controllers.signupUser));
router.post("/login", asyncMiddleware(controllers.loginUser));
router.get(
  "/logout",
  checkSessionValidity,
  asyncMiddleware(controllers.logoutUser)
);
router.patch(
  "/resetpassword/:userId",
  [checkSessionValidity, hasAccess],
  asyncMiddleware(controllers.resetPassword)
);
export default router;
