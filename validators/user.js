import Joi from "joi";

export default {
  validateUserForUpdate: (user) => {
    const schema = Joi.object({
      firstname: Joi.string().min(3).max(30).required().messages({
        "string.base": "First name must be a string",
        "string.empty": "First name cannot be empty",
        "string.min": "First name must be at least {#limit} characters long",
        "string.max": "First name must be at most {#limit} characters long",
        "any.required": "First name is required",
      }),
      lastname: Joi.string().min(3).max(30).required().messages({
        "string.base": "Last name must be a string",
        "string.empty": "Last name cannot be empty",
        "string.min": "Last name must be at least {#limit} characters long",
        "string.max": "Last name must be at most {#limit} characters long",
        "any.required": "Last name is required",
      }),
      username: Joi.string().min(3).max(30).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username cannot be empty",
        "string.min": "Username must be at least {#limit} characters long",
        "string.max": "Username must be at most {#limit} characters long",
        "any.required": "Username is required",
      }),
      gender: Joi.string()
        .valid("male", "female", "not-set")
        .default("not-set")
        .messages({
          "string.base": "Gender must be a string",
          "any.only": "Gender should be either male, female",
        }),
      role: Joi.string().valid("blogger").default("blogger").messages({
        "any.only": 'Role can only be "blogger"',
      }),
    });
    return schema.validate(user, { abortEarly: false });
  },
  validateResetPassword: (info) => {
    const schema = Joi.object({
      currentPassword: Joi.string().required().messages({
        "any.required": "Current password is required",
      }),
      newPassword: Joi.string()
        .min(8)
        .max(255)
        .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
        .required()
        .messages({
          "string.base": "Password should be a string",
          "string.empty": "Password is required",
          "string.min": "Password should have a minimum length of {#limit}",
          "any.required": "Password is required",
          "string.pattern.base":
            "Password should have at least one letter and one number",
        }),
      repeatPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
          "any.only": "password confirmation and password doesn't match ",
        }),
    });
    return schema.validate(info, { abortEarly: false });
  },
};
