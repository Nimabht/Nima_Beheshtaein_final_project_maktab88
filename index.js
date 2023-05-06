import db from "./db/connection.js";
import express from "express";
// import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import apiRouter from "./routes/api.js";
// import index from "./routes/index.js";
import session from "express-session";

const app = express();

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(
  session({
    secret: "test-secret",
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
  })
);

app.get("/isConnect", (req, res, next) => {
  res.send("OK");
});

app.use("/api", apiRouter);
app.use(globalErrorHandler);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`[🔥] App is listening on port ${port}...`);
});
