import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/api.js";
import index from "./routes/viewPages.js";
import session from "express-session";
import notFound from "./middlewares/notFound.js";

const app = express();

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import connectToDatabase from "./db/connection.js";
connectToDatabase();

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
  })
);

app.get("/isConnect", (req, res, next) => {
  res.send("OK");
});

app.use("/api", apiRouter);
app.use("/", index);
//FIXME: app unauthorized page
app.use(notFound);
app.use(globalErrorHandler);

export default app;
