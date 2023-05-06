import { User } from "../models/user.js";
import validators from "../validators/auth.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import session from "express-session";
export default {
  signupUser: async (req, res, next) => {
    const { error, value } = validators.validateUserForSignup(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }

    let user = await User.findOne({ username: value.username });

    if (!!user) {
      const ex = AppError.badRequest("Use another username");
      return next(ex);
    }

    user = await User.findOne({ phoneNumber: value.phoneNumber });
    if (!!user) {
      const ex = AppError.badRequest("Use another phone number");
      return next(ex);
    }

    const {
      firstname,
      lastname,
      username,
      password,
      gender,
      phoneNumber,
      role,
    } = value;

    user = new User({
      firstname,
      lastname,
      username,
      password,
      gender,
      phoneNumber,
      role,
      avatarFileName: `${gender}-anonymous.webp`,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const filteredUser = { ...user.toObject() };
    delete filteredUser.password;
    delete filteredUser.__v;

    res.status(201).send(filteredUser);
  },
  loginUser: async (req, res, next) => {
    const { error, value } = validators.validateUserForLogin(req.body);

    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    const { username, password } = value;

    const user = await User.findOne({ username });

    if (!user) {
      const ex = new AppError("Invalid username or password", "fail", 401);
      return next(ex);
    }

    if (!(await user.validatePassword(password))) {
      const ex = new AppError("Invalid username or password", "fail", 401);
      return next(ex);
    }
    req.session.user = { _id: user._id, role: user.role };

    res.status(202).end();
  },
  logoutUser: (req, res, next) => {
    req.session.destroy();
    res.status(200).end();
  },
};
