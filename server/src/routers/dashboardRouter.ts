import DashboardStats from "@/controllers/dahsboardStats";
import { Router } from "express";
const router = Router();

router.get("/retrieve/stats", DashboardStats);

export default router;
