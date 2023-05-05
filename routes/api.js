import express from "express";
import userRouter from "./user";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);

export default apiRouter;
