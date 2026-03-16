import RetrieveAuditLog from "@/controllers/retrieveAuditLog";
import { validateBeforeRetrieve } from "@/middleware/auditMiddleware";
import { Router } from "express";
const router = Router();

router.get("/retrieve/log", validateBeforeRetrieve, RetrieveAuditLog);

export default router;