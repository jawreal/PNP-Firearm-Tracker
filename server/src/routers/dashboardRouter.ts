import DashboardStats from "@/controllers/dahsboardStats";
import RecentAdminAction from "@/controllers/recentAdminAction.";
import { Router } from "express";
const router = Router();

router.get("/retrieve/stats", DashboardStats);
router.get("/retrieve/recent-action", RecentAdminAction);

export default router;
