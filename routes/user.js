import controllers from "../controllers/user.js";
import express from "express";
import asyncMiddleware from "../middlewares/async.js";
import getUser from "../middlewares/user/getUser.js";

const router = express.Router();

router.param("userId", getUser);

router.get("/:userId", asyncMiddleware(controllers.getUserById));
// router.post("/", asyncMiddleware(controllers.createUser));
router.put("/:userId", asyncMiddleware(controllers.updateUser));
// router.delete("/:userId", asyncMiddleware(controllers.deleteUser));
export default router;
