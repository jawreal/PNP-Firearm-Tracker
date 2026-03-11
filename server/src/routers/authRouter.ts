import UserLogin from "@/controllers/authLogin";
import { validateLoginFields } from "@/middleware/authMiddleware";
import { Router } from "express";
const router = Router();

router.post("/login", validateLoginFields, UserLogin);
export default router;
