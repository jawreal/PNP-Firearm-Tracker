import AuthSender from "@/controllers/authChecker";
import UserLogin from "@/controllers/authLogin";
import Logout from "@/controllers/authLogout";
import ForgotPassword from "@/controllers/forgotPassword";
import UpdatePassword from "@/controllers/updatePassword";
import VerfiyCode from "@/controllers/verfiyCode";
import {
  validateBeforeUpdatePass,
  validateBeforeVerify,
  validateLoginFields,
} from "@/middleware/authMiddleware";
import getDeviceInfo from "@/middleware/getDeviceInfo";
import { Router } from "express";
const router = Router();

const validateEmail = validateLoginFields[0];

router.post("/login", validateLoginFields, getDeviceInfo, UserLogin);
router.post("/reset/password", validateEmail, ForgotPassword);
router.put("/update/new-password", validateBeforeUpdatePass, UpdatePassword);
router.get("/check/session", AuthSender);
router.get("/session/logout", getDeviceInfo, Logout);
router.get("/verify/email-token", validateBeforeVerify, VerfiyCode);

export default router;
