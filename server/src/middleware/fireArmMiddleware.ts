import { body, query } from "express-validator";

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

const normalizedBody = ({ key, isOptional }: INormalized) => {
  if (isOptional) {
    return body(key).optional().isString();
  }
  return body(key).notEmpty().isString();
};

const updateFields = keys.map((key: string) => {
  return normalizedBody({
    key,
    isOptional: false,
  });
});

const registerFields = keys.map((key: string) => {
  return normalizedBody({
    key,
    isOptional: false,
  });
});

const validateBeforeRetrieve = [
  query("search").optional().isString(),
  query("filter").optional().isIn(["issued", "stocked", "loss", "disposition"]),
  query("page").optional().isNumeric(),
];

const validateBeforeSend = [
  body("status").notEmpty().isIn(["issued", "stocked", "loss", "disposition"]),
  ...registerFields,
];

const validateBeforeUpdate = [
  body("firearm_id").notEmpty().isMongoId(),
  body("status").optional().isIn(["issued", "stocked", "loss", "disposition"]),
  ...updateFields,
];

export { validateBeforeSend, validateBeforeUpdate, validateBeforeRetrieve };
