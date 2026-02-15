import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { 
  getAdminStats, 
  getAdminStudios, 
  getAdminBookings, 
  getAdminUsers 
} from "../controllers/adminController.js";
import { 
  approveStudio, 
  rejectStudio, 
  getPendingStudios 
} from "../controllers/studioController.js";

const router = Router();

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get("/stats", getAdminStats);
router.get("/studios", getAdminStudios);
router.get("/studios/pending", getPendingStudios);
router.patch("/studios/:id/approve", approveStudio);
router.patch("/studios/:id/reject", rejectStudio);
router.get("/bookings", getAdminBookings);
router.get("/users", getAdminUsers);

export default router;
