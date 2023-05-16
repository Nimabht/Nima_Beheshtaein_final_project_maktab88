import express from "express";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import articleRouter from "./article.js";
const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/article", articleRouter);
export default apiRouter;
