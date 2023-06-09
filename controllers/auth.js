import { User } from "../models/user.js";
import validators from "../validators/auth.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";

class AuthController {
  async signupUser(req, res, next) {
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
      avatarFileName: `${gender !== "not-set" ? gender : "male"}-anonymous.png`,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const filteredUser = { ...user.toObject() };
    delete filteredUser.password;
    delete filteredUser.__v;

    res.status(201).send(filteredUser);
  }

  async loginUser(req, res, next) {
    const { error, value } = validators.validateUserForLogin(req.body);

    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    const { username, password } = value;

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      const ex = AppError.unAuthorized("Invalid username or password");
      return next(ex);
    }

    if (!(await user.validatePassword(password))) {
      const ex = AppError.unAuthorized("Invalid username or password");
      return next(ex);
    }
    req.session.user = { _id: user._id, role: user.role };

    res.status(202).end();
  }
  async resetPassword(req, res, next) {
    const { error } = validators.validateResetPassword(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user._id);
    if (!user) {
      const ex = AppError.unAuthorized("Unauthorized");
      return next(ex);
    }
    if (!(await user.validatePassword(currentPassword))) {
      const ex = AppError.unAuthorized("Unauthorized");
      return next(ex);
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    req.session.destroy();
    res.status(200).end();
  }

  logoutUser(req, res, next) {
    req.session.destroy();
    res.status(200).end();
  }
}

const authController = new AuthController();
export default authController;
