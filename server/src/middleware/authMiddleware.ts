import { body, query } from "express-validator";

const validateLoginFields = [
  body("emailAddress")
    .isEmail()
    .withMessage("Invalid email field")
    .notEmpty()
    .withMessage("Email adress field is required"),
  body("password")
    .isString()
    .withMessage("x`Invalid password field")
    .notEmpty()
    .withMessage("Password field is required"),
  body("token")
    .isString()
    .withMessage("Invalid token field")
    .notEmpty()
    .withMessage("Token field is required"),
];

const validateBeforeUpdatePass = [
  body("code")
    .isString()
    .withMessage("Invalid code field")
    .notEmpty()
    .withMessage("Code field is required"),
  body("newPassword")
    .isString()
    .withMessage("Invalid new password field")
    .notEmpty()
    .withMessage("New password field is required"),
  body("confirmPassword")
    .isString()
    .withMessage("Invalid new password field")
    .notEmpty()
    .withMessage("New password field is required"),
];

const validateBeforeVerify = query("code")
  .isString()
  .withMessage("Invalid code field")
  .notEmpty()
  .withMessage("Code field is required");

export { validateLoginFields, validateBeforeUpdatePass, validateBeforeVerify };
