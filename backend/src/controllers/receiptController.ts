import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No receipt file provided" });
      return;
    }

    // The file is already saved to src/receipts by multer diskStorage
    res.json({ 
      message: "Receipt stored successfully",
      filename: req.file.filename 
    });
  } catch (error: any) {
    console.error("Receipt upload error:", error);
    res.status(500).json({ message: "Failed to store receipt" });
  }
};
