import RegisterAdmin from "@/controllers/registerAdmin";
import { validateBeforeRegister } from "@/middleware/adminMiddleware";
import { Router } from "express";
const router = Router();

router.post("/insert/registry", validateBeforeRegister, RegisterAdmin);

export default router;
