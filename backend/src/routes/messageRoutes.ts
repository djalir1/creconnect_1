import { Router } from "express";
import { sendMessage, getConversation, getMyConversations } from "../controllers/messageController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.post("/", sendMessage);
router.get("/conversations", getMyConversations);
router.get("/:otherUserId", getConversation);

export default router;
