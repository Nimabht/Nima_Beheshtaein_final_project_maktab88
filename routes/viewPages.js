import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import checkSessionValidity from "../middlewares/auth/checkSessionValidity.js";
import { User } from "../models/user.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.get("/signup", (req, res, next) => {
  if (req.session && req.session.user) {
    // if the user is logged in, redirect to the dashboard
    return res.redirect("/dashboard");
  }
  const filePath = join(__dirname, "../views", "signup.html");
  res.sendFile(filePath);
});

router.get("/login", (req, res, next) => {
  if (req.session && req.session.user) {
    // if the user is logged in, redirect to the dashboard
    return res.redirect("/dashboard");
  }
  const filePath = join(__dirname, "../views", "login.html");
  res.sendFile(filePath);
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
  });
});

// router.get("/resetpassword", checkSessionId, async (req, res, next) => {
//   const { _id } = await User.findById(req.session.user._id);
//   res.render("resetPassword", {
//     _id,
//   });
// });

export default router;
