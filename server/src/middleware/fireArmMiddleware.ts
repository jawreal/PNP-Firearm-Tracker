import { body } from "express-validator";

const validateBeforeSend = [
  body("firstName").notEmpty().isString(),
  body("lastName").notEmpty().isString(),
  body("serialNumber").notEmpty().isString(),
  body("fireArmType").notEmpty().isString(),
  body("station").notEmpty().isString(),
  body("department").notEmpty().isString(),
  body("status").notEmpty().isIn(["issued", "stocked", "loss", "disposition"]),
];

export { validateBeforeSend };
