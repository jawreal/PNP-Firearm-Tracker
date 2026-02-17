import RegisterAdmin from "@/controllers/registerAdmin";
import RetrieveAdminRecord from "@/controllers/retrieveAdmins";
import {
  validateBeforeRegister,
  validateBeforeRetrieve,
} from "@/middleware/adminMiddleware";
import { Router } from "express";
const router = Router();

router.post("/register", validateBeforeRegister, RegisterAdmin);
router.get("/retrieve/registry", validateBeforeRetrieve, RetrieveAdminRecord);

export default router;
