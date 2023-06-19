import express from "express";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import { User } from "../models/user.js";
import { Article } from "../models/article.js";
import AppError from "../utils/AppError.js";
import { access } from "node:fs/promises";
import hasAccessByRole from "../middlewares/auth/hasAccessByRole.js";
import { join } from "node:path";
import asyncMiddleware from "../middlewares/async.js";
const router = express.Router();

router.get(
  "/signup",
  asyncMiddleware((req, res, next) => {
    if (req.session && req.session.user) {
      // if the user is logged in, redirect to the dashboard
      return res.redirect("/dashboard");
    }
    res.render("signup");
  })
);

router.get(
  "/login",
  asyncMiddleware((req, res, next) => {
    if (req.session && req.session.user) {
      // if the user is logged in, redirect to the dashboard
      return res.redirect("/dashboard");
    }
    res.render("login");
  })
);

router.get(
  "/dashboard",
  checkSessionValidity,
  asyncMiddleware(async (req, res, next) => {
    const { firstname, lastname, username, phoneNumber, role, avatarFileName } =
      await User.findById(req.session.user._id);
    const userAvatarPath = join("public", "avatars", avatarFileName);
    await access(userAvatarPath);
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
  })
);

router.get(
  "/editInformations",
  checkSessionValidity,
  asyncMiddleware(async (req, res, next) => {
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
  })
);
router.get(
  "/new-story",
  checkSessionValidity,
  asyncMiddleware(async (req, res, next) => {
    res.render("new-story");
  })
);

router.get(
  "/article/:articleId",
  asyncMiddleware(async (req, res, next) => {
    const articleId = req.params.articleId;
    let isOwner = false;
    if (!!req.session.user) {
      let article = await Article.findById(articleId);
      if (article.author.toString() === req.session.user._id) isOwner = true;
    }
    res.render("article", { isOwner, user: req.session.user });
  })
);

router.get(
  "/edit-article/:articleId",
  checkSessionValidity,
  asyncMiddleware(async (req, res, next) => {
    const articleId = req.params.articleId;
    let article = await Article.findById(articleId);
    const userIdInArticle = article.author.toString();
    if (userIdInArticle === req.session.user._id) {
      return res.render("edit-article");
    } else {
      const ex = new AppError("Forbidden", "fail", 403);
      return next(ex);
    }
  })
);

router.get(
  "/my-articles",
  checkSessionValidity,
  asyncMiddleware(async (req, res, next) => {
    const userId = req.session.user._id;
    res.render("my-articles", {
      userId,
    });
  })
);

router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    res.redirect("/explore");
  })
);

router.get(
  "/explore",
  asyncMiddleware(async (req, res, next) => {
    let isLoggedIn = false;
    if (!!req.session.user) {
      isLoggedIn = true;
    }
    res.render("explore", { isLoggedIn });
  })
);

router.get(
  "/admin-panel",
  [checkSessionValidity, hasAccessByRole(["admin"])],
  asyncMiddleware(async (req, res, next) => {
    res.render("admin-panel");
  })
);

// router.get("/resetpassword", checkSessionId, async (req, res, next) => {
//   const { _id } = await User.findById(req.session.user._id);
//   res.render("resetPassword", {
//     _id,
//   });
// });

export default router;
