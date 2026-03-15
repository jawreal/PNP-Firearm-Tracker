import AssignRole from "@/controllers/assignRole";
import ProcessAdminStatus from "@/controllers/processAdminStatus";
import RegisterAdmin from "@/controllers/registerAdmin";
import RetrieveAdminRecord from "@/controllers/retrieveAdmins";
import {
  validateBeforeRegister,
  validateBeforeRetrieve,
  validateBeforeDeactivate,
} from "@/middleware/adminMiddleware";
import getDeviceInfo from "@/middleware/getDeviceInfo";
import { Router } from "express";
import { body } from "express-validator";
const router = Router();

router.put(
  "/update/role",
  body("admin_id")
    .isMongoId()
    .withMessage("Invalid type of admin id")
    .notEmpty()
    .withMessage("admin id is required"),
  AssignRole,
);
router.post("/register", validateBeforeRegister, RegisterAdmin);
router.post(
  "/process/status",
  validateBeforeDeactivate,
  getDeviceInfo,
  ProcessAdminStatus,
);
router.get("/retrieve/registry", validateBeforeRetrieve, RetrieveAdminRecord);

export default router;
