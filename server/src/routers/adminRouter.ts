import ProcessAdminStatus from "@/controllers/processAdminStatus";
import RegisterAdmin from "@/controllers/registerAdmin";
import RetrieveAdminRecord from "@/controllers/retrieveAdmins";
import {
  validateBeforeRegister,
  validateBeforeRetrieve,
  validateBeforeDeactivate,
} from "@/middleware/adminMiddleware";
import { Router } from "express";
const router = Router();

router.post("/register", validateBeforeRegister, RegisterAdmin);
router.post("/process/status", validateBeforeDeactivate, ProcessAdminStatus);
router.get("/retrieve/registry", validateBeforeRetrieve, RetrieveAdminRecord);

export default router;
