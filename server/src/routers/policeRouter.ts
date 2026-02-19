import AddFireArm from "@/controllers/addFireArm";
import RetrieveFireArm from "@/controllers/retrieveFireArm";
import RetrieveSelectedFirearm from "@/controllers/retrieveSelectedFirearm";
import UpdateFireArm from "@/controllers/updateFireArm";
import {
  validateBeforeRetrieve,
  validateBeforeSend,
  validateBeforeUpdate,
} from "@/middleware/fireArmMiddleware";
import { Router } from "express";
import { query } from "express-validator";
const router = Router();

router.post("/insert/registry", validateBeforeSend, AddFireArm);
router.put("/update/registry", validateBeforeUpdate, UpdateFireArm);
router.get("/retrieve", validateBeforeRetrieve, RetrieveFireArm);
router.get(
  "/selected/data",
  query("_id").isMongoId().notEmpty().withMessage("_id field is required"),
  RetrieveSelectedFirearm,
);

export default router;
