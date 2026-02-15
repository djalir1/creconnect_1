import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createClientManual } from "../controllers/userController.js";

const router = Router();

// Protected Routes (Admin only ideally)
router.use(authenticate);

router.post("/manual", createClientManual);

export default router;
