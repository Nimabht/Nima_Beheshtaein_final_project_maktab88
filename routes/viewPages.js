import express from "express";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/signup", (req, res, next) => {
  if (req.session && req.session.user) {
    // if the user is logged in, redirect to the dashboard
    return res.redirect("/dashboard");
  }
  res.render("signup", { userLoggedIn: req.session.user });
});

router.get("/login", (req, res, next) => {
  if (req.session && req.session.user) {
    // if the user is logged in, redirect to the dashboard
    return res.redirect("/dashboard");
  }
  res.render("login", { userLoggedIn: req.session.user });
});

router.get("/dashboard", checkSessionValidity, async (req, res, next) => {
  const { firstname, lastname, username, phoneNumber, role, avatarFileName } =
    await User.findById(req.session.user._id);
  res.render("userProfile", {
    firstname,
    lastname,
    username,
    phoneNumber,
    role,
    avatarFileName,
    userLoggedIn: req.session.user,
    inDashboard: true,
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
  res.render("new-story", {
    userLoggedIn: req.session.user,
    inDashboard: false,
  });
});
// router.get("/resetpassword", checkSessionId, async (req, res, next) => {
//   const { _id } = await User.findById(req.session.user._id);
//   res.render("resetPassword", {
//     _id,
//   });
// });

export default router;
