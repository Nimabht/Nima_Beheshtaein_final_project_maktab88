import { User } from "../models/user.js";
import validators from "../validators/user.js";
import AppError from "../utils/AppError.js";
import { join, basename } from "node:path";
import fs from "node:fs/promises";
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
  updateUserAvatar: async (req, res, next) => {
    const avatarPath = req.file.path;
    const user = res.locals.user;
    // delete the previous avatar
    if (
      user.avatarFileName !== "male-anonymous.png" &&
      user.avatarFileName !== "female-anonymous.png"
    ) {
      const path = join("public", "avatars", user.avatarFileName);
      console.log(path);
      await fs.unlink(path);
    }
    const filename = basename(req.file.filename);
    user.avatarFileName = filename;
    await user.save();
    res.status(200).end();
  },
  deleteUser: async (req, res, next) => {
    await res.locals.user.deleteOne();
    res.status(204).end();
  },
};
