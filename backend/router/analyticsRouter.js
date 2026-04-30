import express from "express";
import { getDashboardStats } from "../controller/analyticsController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/stats", isAdminAuthenticated, getDashboardStats);

export default router;
