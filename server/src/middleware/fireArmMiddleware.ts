import { body, query } from "express-validator";

interface INormalized {
  key: string;
  isOptional: boolean;
}

const FIREARM_TYPE: ["long", "short"] = ["long", "short"]

const keys: string[] = [
  "fullName",
  "serialNumber",
  "fireArmMake",  // e.g., Glock, Desert Eagle
  "department",
  "station",
];

const STATUS: string[] = [
  "issued",
  "stocked",
  "loss",
  "disposition",
  "turn in",
  "Filter", // default
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
  query("recordType").optional().isIn(["active", "archive"]),
  query("gunType").optional().isIn(["long", "short"]),
  query("filter").optional().isIn(STATUS),
  query("from").optional().isISO8601().toDate(),
  query("to").optional().isISO8601().toDate(),
  query("page").optional().isNumeric(),
];

const validateBeforeSend = [
  body("status").notEmpty().isIn(STATUS),
  body("fireArmType").notEmpty().withMessage("Firearm type is required").isIn(FIREARM_TYPE).withMessage("Invalid firearm type"),
  ...registerFields,
];

const validateBeforeUpdate = [
  body("firearm_id").notEmpty().isMongoId(),
  body("status").optional().isIn(STATUS),
  body("fireArmType").optional().isIn(FIREARM_TYPE).withMessage("Invalid firearm type"),
  ...updateFields,
];

const validateId = (isQuery?: boolean, key?: string) => {
  const protocol = isQuery ? query(key ?? "_id") : body(key ?? "_id");
  return protocol.isMongoId().notEmpty().withMessage("_id field is required");
};

const validateBeforeDelete = [
  validateId(false, "record_id"),
  body("password")
    .isString()
    .withMessage("Invalid password type")
    .notEmpty()
    .withMessage("Password field is required"),
];

export {
  validateBeforeSend,
  validateBeforeUpdate,
  validateBeforeRetrieve,
  validateBeforeDelete,
  validateId,
};
