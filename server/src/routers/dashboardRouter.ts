import DashboardStats from "@/controllers/dahsboardStats";
import RecentAdminAction from "@/controllers/recentAdminAction.";
import RetrieveChartData from "@/controllers/retreieveChartData";
import { Router } from "express";
const router = Router();

router.get("/retrieve/stats", DashboardStats);
router.get("/retrieve/chart/stats", RetrieveChartData);
router.get("/retrieve/recent-action", RecentAdminAction);

export default router;
