import AddFireArm from "@/controllers/addFireArm";
import RetrieveFireArm from "@/controllers/retrieveFireArm";
import UpdateFireArm from "@/controllers/updateFireArm";
import {
  validateBeforeRetrieve,
  validateBeforeSend,
  validateBeforeUpdate,
} from "@/middleware/fireArmMiddleware";
import { Router } from "express";
const router = Router();

router.post("/insert/registry", validateBeforeSend, AddFireArm);
router.put("/update/registry", validateBeforeUpdate, UpdateFireArm);
router.get("/retrieve", validateBeforeRetrieve, RetrieveFireArm);

export default router;
