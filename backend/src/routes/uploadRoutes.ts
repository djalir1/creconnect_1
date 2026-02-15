import { Router, Request, Response } from "express";
import { upload, uploadToCloudinary } from "../utils/cloudinary.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const result = await uploadToCloudinary(req.file);
    res.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(error.http_code || 500).json({ 
        message: error.message || "Upload failed",
        error: error
    });
  }
});

router.post("/multiple", authenticate, upload.array("images", 5), async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }
  
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.secure_url);
  
      res.json({ urls });
    } catch (error: any) {
      console.error("Multiple upload error:", error);
      res.status(error.http_code || 500).json({ 
          message: error.message || "Upload failed",
          error: error
      });
    }
  });

export default router;
