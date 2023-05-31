import Joi from "joi";
import JoiObjectId from "joi-objectid";
Joi.objectId = JoiObjectId(Joi);

export default {
  validateCommentForCreate: (comment) => {
    const schema = Joi.object({
      content: Joi.string().min(3).max(500).required().messages({
        "string.base": "Content must be a string",
        "string.empty": "Content is required",
        "string.min": "Content must have at least {#limit} characters",
        "string.max": "Content can have at most {#limit} characters",
        "any.required": "Content is required",
      }),
      articleId: Joi.objectId().required().messages({
        "string.pattern.base": "Article id must be a valid ObjectId",
        "string.base": "Article id must be a valid ObjectId",
        "any.required": "Article id is required",
      }),
    });
    return schema.validate(comment, { abortEarly: false });
  },
  validateCommentForUpdate: (comment) => {
    const schema = Joi.object({
      content: Joi.string().min(3).max(500).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title is required",
        "string.min": "Title must have at least {#limit} characters",
        "string.max": "Title can have at most {#limit} characters",
        "any.required": "Title is required",
      }),
    });
    return schema.validate(comment, { abortEarly: false });
  },
};
