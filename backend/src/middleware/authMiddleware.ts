import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

// Extend Express Request to include user payload properly
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // 1. Check if the header exists and uses the Bearer scheme
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("[AUTH] Fail: No Bearer token found in request headers");
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token using your utility
    const payload = verifyToken(token);

    // 3. Validate that the payload actually contains the userId
    if (!payload || !payload.userId) {
      console.error("[AUTH] Fail: Token verified but userId is missing from payload", payload);
      res.status(401).json({ message: "Invalid token structure" });
      return;
    }

    // 4. Attach the payload to the request object
    // This ensures req.user.userId is available in your studio controller
    req.user = {
      userId: payload.userId,
      role: payload.role || "USER"
    };

    console.log(`[AUTH] Success: User ${payload.userId} authenticated`);
    next();
  } catch (error: any) {
    // 5. Catch specific JWT errors for better debugging
    console.error("[AUTH] JWT Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch (error) {
      // Proceed silently as guest if token is invalid
      console.log("[AUTH] Optional auth failed, proceeding as guest");
    }
  }
  
  next();
};