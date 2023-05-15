import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    gender: {
      type: String,
      enum: ["male", "female", "not-set"],
      default: "not-set",
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(\+98|0)?9\d{9}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid Iranian phone number!`,
      },
      set: function (v) {
        return `+98${v.replace(/^0/, "")}`;
      },
    },
    role: {
      type: String,
      enum: ["blogger", "admin"],
      default: "blogger",
    },
    avatarFileName: {
      type: String,
      required: true,
      default: function () {
        if (this.gender === "male") {
          return "male-anonymous.png";
        } else {
          return "female-anonymous.png";
        }
      },
    },
  },
  {
    timestamps: {
      createdAt: "registrationDate",
      updatedAt: "updatedAt",
    },
  }
);

userSchema.virtual("articles", {
  ref: "Article",
  localField: "_id",
  foreignField: "author",
});

userSchema.methods.validatePassword = async function validatePassword(
  password
) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
