import AddFireArm from "@/controllers/addFireArm";
import UpdateFireArm from "@/controllers/updateFireArm";
import {
  validateBeforeSend,
  validateBeforeUpdate,
} from "@/middleware/fireArmMiddleware";
import { Router } from "express";
const router = Router();

router.post("/insert/registry", validateBeforeSend, AddFireArm);
router.post("/update/registry", validateBeforeUpdate, UpdateFireArm);

export default router;
