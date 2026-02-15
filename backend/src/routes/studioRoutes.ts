import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createStudio,
  getAllStudios,
  getMyStudios,
  getStudioById,
  updateStudio,
  deleteStudio,
  getPendingStudios,
  approveStudio,
  rejectStudio,
  createStudioManual,
} from "../controllers/studioController.js";

const router = Router();

// Public routes
router.get("/", getAllStudios);
router.get("/:id", getStudioById);

// Protected routes
router.use(authenticate);
router.post("/", createStudio);
router.get("/user/me", getMyStudios);
router.put("/:id", updateStudio);
router.delete("/:id", deleteStudio);

// Admin Routes (Should be protected by role check middleware ideally, using authenticate for now)
router.get("/admin/pending", getPendingStudios);
router.put("/admin/:id/approve", approveStudio);
router.put("/admin/:id/reject", rejectStudio);
router.post("/admin/manual", createStudioManual);

export default router;
