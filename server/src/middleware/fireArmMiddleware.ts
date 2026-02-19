import { body, query } from "express-validator";

interface INormalized {
  key: string;
  isOptional: boolean;
}

const keys: string[] = [
  "fullName",
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
    isOptional: true,
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
  query("sortKey").optional().isString(),
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

const validateId = (isQuery?: boolean) => {
  const protocol = isQuery ? query("_id") : body("_id");
  return protocol.isMongoId().notEmpty().withMessage("_id field is required");
};

export {
  validateBeforeSend,
  validateBeforeUpdate,
  validateBeforeRetrieve,
  validateId,
};
