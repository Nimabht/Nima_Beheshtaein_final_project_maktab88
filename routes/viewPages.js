import express from "express";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import { User } from "../models/user.js";
import { Article } from "../models/article.js";
import AppError from "../utils/AppError.js";
const router = express.Router();

router.get("/signup", (req, res, next) => {
  if (req.session && req.session.user) {
    // if the user is logged in, redirect to the dashboard
    return res.redirect("/dashboard");
  }
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  if (req.session && req.session.user) {
    // if the user is logged in, redirect to the dashboard
    return res.redirect("/dashboard");
  }
  res.render("login");
});

router.get("/dashboard", checkSessionValidity, async (req, res, next) => {
  const { firstname, lastname, username, phoneNumber, role, avatarFileName } =
    await User.findById(req.session.user._id);

  const articleCount = await Article.countDocuments({
    author: req.session.user._id,
  });
  res.render("userProfile", {
    firstname,
    lastname,
    username,
    phoneNumber,
    role,
    avatarFileName,
    articleCount,
  });
});

router.get(
  "/editInformations",
  checkSessionValidity,
  async (req, res, next) => {
    const { firstname, lastname, username, gender, _id } = await User.findById(
      req.session.user._id
    );
    res.render("editInformation", {
      firstname,
      lastname,
      username,
      gender,
      _id,
    });
  }
);
router.get("/new-story", checkSessionValidity, async (req, res, next) => {
  res.render("new-story");
});

router.get("/article/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId;
  let isOwner = false;
  if (!!req.session.user) {
    let article = await Article.findById(articleId);
    if (article.author.toString() === req.session.user._id) isOwner = true;
  }
  res.render("article", { isOwner, user: req.session.user });
});

router.get(
  "/edit-article/:articleId",
  checkSessionValidity,
  async (req, res, next) => {
    const articleId = req.params.articleId;
    let article = await Article.findById(articleId);
    const userIdInArticle = article.author.toString();
    if (userIdInArticle === req.session.user._id) {
      return res.render("edit-article");
    } else {
      const ex = new AppError("Unauthorized request", "fail", 401);
      return next(ex);
    }
  }
);

router.get("/my-articles", checkSessionValidity, async (req, res, next) => {
  const userId = req.session.user._id;
  res.render("my-articles", {
    userId,
  });
});

router.get("/explore", async (req, res, next) => {
  let isLoggedIn = false;
  if (!!req.session.user) {
    isLoggedIn = true;
  }
  res.render("explore", { isLoggedIn });
});

// router.get("/resetpassword", checkSessionId, async (req, res, next) => {
//   const { _id } = await User.findById(req.session.user._id);
//   res.render("resetPassword", {
//     _id,
//   });
// });

export default router;
