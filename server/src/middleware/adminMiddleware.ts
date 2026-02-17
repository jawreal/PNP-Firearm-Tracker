import { body } from "express-validator";

const NAME_REGEX: RegExp = /^[A-Za-z]+(?: [A-Za-z]+)?$/; // regex for checking non alphabets for name
const PASSWORD_REGEX: RegExp =
  /^(?=.*\d)(?=[^!@#$%^&*]*[!@#$%^&*][^!@#$%^&*]*$)[A-Za-z\d!@#$%^&*]{5,15}$/; // requires especial character, and number

const validateBeforeRegister = [
  body("firstName")
    .notEmpty()
    .withMessage("First name must not be empty")
    .matches(NAME_REGEX)
    .withMessage("First name must be alphabets only"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name must not be empty")
    .matches(NAME_REGEX)
    .withMessage("Last name must be alphabets only"),
  body("userName")
    .notEmpty()
    .withMessage("Username must not be empty")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters long"),
  body("password")
    .notEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(PASSWORD_REGEX)
    .withMessage("Password requires letters, numbers, and special character"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters long")
    .matches(PASSWORD_REGEX)
    .withMessage("Password requires letters, numbers, and special character"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
];

export { validateBeforeRegister };
