import { body } from "express-validator";

const validateLoginFields = [
  body("emailAddress")
    .isEmail()
    .withMessage("Invalid email field")
    .notEmpty()
    .withMessage("Email adress field is required"),
  body("password")
    .isString()
    .withMessage("Invalid password field")
    .notEmpty()
    .withMessage("Password field is required"),
  body("token")
    .isString()
    .withMessage("Invalid token field")
    .notEmpty()
    .withMessage("Token field is required"),
];

export { validateLoginFields };
