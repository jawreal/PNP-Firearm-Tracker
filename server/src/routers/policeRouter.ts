import addFireArm from "@/controllers/addFireArm";
import { validateBeforeSend } from "@/middleware/fireArmMiddleware";
import { Router } from "express";
const router = Router();

router.post("/insert/firearm", validateBeforeSend, addFireArm);

export default router;
