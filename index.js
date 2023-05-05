import db from "./db/connection.js";
import express from "express";
// import cookieParser from "cookie-parser";
// import { default as connectMongoDBSession } from "connect-mongodb-session";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import apiRouter from "./routes/api.js";
// import user from "./routes/user.js";
// import index from "./routes/index.js";
// import session from "express-session";
// import auth from "./routes/auth.js";
// const MongoDBStore = connectMongoDBSession(session);

const app = express();

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());

app.get("/isConnect", (req, res, next) => {
  res.send("OK");
});

app.use("/api", apiRouter);
app.use(globalErrorHandler);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`[🔥] App is listening on port ${port}...`);
});
