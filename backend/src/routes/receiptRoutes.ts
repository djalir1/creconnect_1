import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadReceipt } from "../controllers/receiptController.js";
import { optionalAuthenticate } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure multer for disk storage in src/receipts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Relative to backend root, it's src/receipts
    cb(null, "src/receipts");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", optionalAuthenticate, upload.single("receipt"), uploadReceipt);

export default router;
