import { User } from "../models/user.js";
import validators from "../validators/user.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
// import session from "express-session";
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
};
