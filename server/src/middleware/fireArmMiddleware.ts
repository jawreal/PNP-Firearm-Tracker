import { body } from "express-validator";

interface INormalized {
  key: string;
  isOptional: boolean;
}

const keys: string[] = [
  "firstName",
  "lastName",
  "serialNumber",
  "fireArmType",
  "department",
  "station",
];

const normalized = ({ key, isOptional }: INormalized) => {
  if (isOptional) {
    return body(key).optional().isString();
  }
  return body(key).notEmpty().isString();
};

const registerFields = keys.map((key: string) => {
  return normalized({
    key,
    isOptional: false,
  });
});

const updateFields = keys.map((key: string) => {
  return normalized({
    key,
    isOptional: false,
  });
});

const validateBeforeSend = [
  body("status").notEmpty().isIn(["issued", "stocked", "loss", "disposition"]),
  ...registerFields,
];

const validateBeforeUpdate = [
  body("firearm_id").notEmpty().isMongoId(),
  body("status").optional().isIn(["issued", "stocked", "loss", "disposition"]),
  ...updateFields,
];
export { validateBeforeSend, validateBeforeUpdate };
