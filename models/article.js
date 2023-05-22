import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    sketch: {
      type: String,
      minlength: 3,
      maxlength: 150,
    },
    thumbnailFileName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 3,
    },
    imageFileNames: {
      type: [String],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    views: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model("Article", articleSchema);
