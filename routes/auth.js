import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import authController from "../controllers/auth.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
// import hasAccess from "../middlewares/auth/hasAccessById.js";
import getUser from "../middlewares/user/getUser.js";
// import hasAccessByOwning from "../middlewares/auth/hasAccessByOwning.js";
import hasAccessByAdminOrOwner from "../middlewares/auth/hasAccessByAdminOrOwner.js";
const router = express.Router();

router.param("userId", getUser);

router.post("/signup", asyncMiddleware(authController.signupUser));
router.post("/login", asyncMiddleware(authController.loginUser));
router.get(
  "/logout",
  checkSessionValidity,
  asyncMiddleware(authController.logoutUser)
);
router.patch(
  "/resetpassword/:userId",
  [checkSessionValidity, hasAccessByAdminOrOwner],
  asyncMiddleware(authController.resetPassword)
);
export default router;
