import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import controllers from "../controllers/auth.js";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
const router = express.Router();

router.post("/signup", asyncMiddleware(controllers.signupUser));
router.post("/login", asyncMiddleware(controllers.loginUser));
router.get(
  "/logout",
  checkSessionValidity,
  asyncMiddleware(controllers.logoutUser)
);
export default router;
