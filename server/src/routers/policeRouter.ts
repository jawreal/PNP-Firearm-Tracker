import AddFireArm from "@/controllers/addFireArm";
import DeleteFireArm from "@/controllers/deleteFireArm";
import RetrieveFireArm from "@/controllers/retrieveFireArm";
import RetrieveSelectedFirearm from "@/controllers/retrieveSelectedFirearm";
import UpdateFireArm from "@/controllers/updateFireArm";
import {
  validateBeforeRetrieve,
  validateBeforeSend,
  validateId,
  validateBeforeUpdate,
} from "@/middleware/fireArmMiddleware";
import { Router } from "express";
const router = Router();

router.delete("/delete/registry", validateId(false), DeleteFireArm);
router.post("/insert/registry", validateBeforeSend, AddFireArm);
router.put("/update/registry", validateBeforeUpdate, UpdateFireArm);
router.get("/retrieve", validateBeforeRetrieve, RetrieveFireArm);
router.get("/selected/data", validateId(true), RetrieveSelectedFirearm);

export default router;
