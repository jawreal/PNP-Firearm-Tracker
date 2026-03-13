import UserLogin from "@/controllers/authLogin";
import ForgotPassword from "@/controllers/forgotPassword";
import UpdatePassword from "@/controllers/updatePassword";
import VerfiyCode from "@/controllers/verfiyCode";
import {
  validateBeforeUpdatePass,
  validateBeforeVerify,
  validateLoginFields,
} from "@/middleware/authMiddleware";
import { Router } from "express";
const router = Router();

const validateEmail = validateLoginFields[0];

router.post("/login", validateLoginFields, UserLogin);
router.post("/reset/password", validateEmail, ForgotPassword);
router.put("/update/new-password", validateBeforeUpdatePass, UpdatePassword);
router.get("/verify/email-token", validateBeforeVerify, VerfiyCode);

export default router;
