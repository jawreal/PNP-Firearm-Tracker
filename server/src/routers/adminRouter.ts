import RegisterAdmin from "@/controllers/registerAdmin";
import { validateBeforeRegister } from "@/middleware/adminMiddleware";
import { Router } from "express";
const router = Router();

router.post("/register", validateBeforeRegister, RegisterAdmin);

export default router;
