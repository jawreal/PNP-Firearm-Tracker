import UserLogin from "@/controllers/authLogin";
import ForgotPassword from "@/controllers/forgotPassword";
import { validateLoginFields } from "@/middleware/authMiddleware";
import { Router } from "express";
const router = Router();

const validateEmail = validateLoginFields[0]

router.post("/login", validateLoginFields, UserLogin);
router.post("/reset/password", validateEmail, ForgotPassword);

export default router;
