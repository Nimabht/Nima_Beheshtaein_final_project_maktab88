import express from "express";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import { User } from "../models/user.js";
import { Article } from "../models/article.js";
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
  // const { firstname, lastname, username, phoneNumber, role, avatarFileName } =
  //   await User.findById(req.session.user._id);

  res.render("new-story");
});
// router.get("/resetpassword", checkSessionId, async (req, res, next) => {
//   const { _id } = await User.findById(req.session.user._id);
//   res.render("resetPassword", {
//     _id,
//   });
// });

export default router;
