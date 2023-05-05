import { User } from "../models/user.js";
import validators from "../validators/user.js";
import AppError from "../utils/AppError.js";
// import bcrypt from "bcrypt";
// import session from "express-session";
export default {
  // FIXME: should i have createUser service or signup service??
  getUserById: (req, res, next) => {
    res.send(res.locals.user);
  },
  updateUser: async (req, res, next) => {
    const { error, value } = validators.validateUserForUpdate(req.body);
    if (!!error) {
      const ex = AppError.badRequest(error.details[0].message);
      return next(ex);
    }
    // Check if username already exists in database
    let existingUser = await User.findOne({
      username: value.username,
      _id: { $ne: res.locals.user._id }, // exclude user with specified id
    });
    if (!!existingUser) {
      const ex = AppError.badRequest("Use another username.");
      return next(ex);
    }
    const { firstname, lastname, username, gender, phoneNumber, role } = value;
    const user = res.locals.user;
    user.set({
      firstname,
      lastname,
      username,
      gender,
      phoneNumber,
      role,
    });
    await user.save();
    const filteredUser = { ...user.toObject() };
    delete filteredUser.password;
    delete filteredUser.__v;
    res.status(200).send(filteredUser);
  },
  //   deleteUser: async (req, res, next) => {
  //     await req.user.deleteOne();
  //     res.status(204).end();
  //   },
};
