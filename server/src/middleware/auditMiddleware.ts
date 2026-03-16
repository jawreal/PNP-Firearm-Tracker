import { query } from "express-validator";

const STATUS: string[] = ["register", "update", "delete", "login", "logout"];

const validateBeforeRetrieve = [
  query("search").optional().isString(),
  query("sortKey").optional().isString(),
  query("filter").optional().isIn(STATUS),
  query("page").optional().isNumeric(),
];

export { validateBeforeRetrieve };
