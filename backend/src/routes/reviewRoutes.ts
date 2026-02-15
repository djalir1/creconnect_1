import { Router } from "express";
import { createReview, getReviewsByTarget } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getReviewsByTarget);

router.use(authenticate);
router.post("/", createReview);

export default router;
