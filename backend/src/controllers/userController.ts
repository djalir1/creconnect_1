import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../utils/prisma.js";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CLIENT", "STUDIO_OWNER", "ADMIN"]).optional(),
});

// Admin: Create Manual Client/User
export const createClientManual = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ideally verify admin role here
    
    const { name, email, password, role } = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CLIENT",
      },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: (error as any).issues[0]?.message || "Validation error" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
