import { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { z } from "zod";

// Helper to parse SQLite strings back into Arrays for the Frontend
const parseStudioData = (studio: any) => {
  if (!studio) return null;
  return {
    ...studio,
    images: typeof studio.images === 'string' ? JSON.parse(studio.images) : studio.images,
    features: typeof studio.features === 'string' ? JSON.parse(studio.features) : studio.features,
  };
};

// Validation Schemas
const createStudioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.enum(["Kicukiro", "Gasabo", "Nyarugenge"] as const, {
    message: "Location must be Kicukiro, Gasabo, or Nyarugenge"
  }),
  pricePerHour: z.number().positive("Price must be positive"),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  availability: z.enum(["available", "away", "out"]).optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

const updateStudioSchema = createStudioSchema.partial();

// --- Create Studio ---
export const createStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = createStudioSchema.parse(req.body);

    const studio = await prisma.studio.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        pricePerHour: data.pricePerHour,
        ownerId: userId,
        images: JSON.stringify(data.images || []),
        features: JSON.stringify(data.features || []),
        availability: data.availability || "available",
        approvalStatus: data.approvalStatus || "PENDING",
      },
    });

    res.status(201).json(parseStudioData(studio));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0]?.message || "Validation error" });
      return;
    }
    console.error("Studio Creation Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Get All Studios ---
export const getAllStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, minPrice, maxPrice, name } = req.query;
    const where: any = { approvalStatus: "APPROVED" };

    if (location) where.location = { contains: location as string };
    if (name) where.name = { contains: name as string };

    if (minPrice || maxPrice) {
      where.pricePerHour = {};
      if (minPrice) where.pricePerHour.gte = parseFloat(minPrice as string);
      if (maxPrice) where.pricePerHour.lte = parseFloat(maxPrice as string);
    }

    const studios = await prisma.studio.findMany({
      where,
      include: {
        owner: { select: { name: true, email: true, avatar: true } },
      },
    });

    // Parse images/features for each studio
    res.json(studios.map(parseStudioData));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Get Studio By ID ---
export const getStudioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const studio = await prisma.studio.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, email: true, avatar: true } },
        reviews: true,
      },
    });

    if (!studio) {
      res.status(404).json({ message: "Studio not found" });
      return;
    }
    res.json(parseStudioData(studio));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Get My Studios ---
export const getMyStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const studios = await prisma.studio.findMany({
      where: { ownerId: userId },
    });

    res.json(studios.map(parseStudioData));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Update Studio ---
export const updateStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;

    const studio = await prisma.studio.findUnique({ where: { id } });
    if (!studio) {
      res.status(404).json({ message: "Studio not found" });
      return;
    }

    if (studio.ownerId !== userId) {
      res.status(403).json({ message: "Not authorized to update this studio" });
      return;
    }

    const data = updateStudioSchema.parse(req.body);

    const updatedStudio = await prisma.studio.update({
      where: { id },
      data: {
        ...data,
        images: data.images ? JSON.stringify(data.images) : undefined,
        features: data.features ? JSON.stringify(data.features) : undefined
      },
    });

    res.json(parseStudioData(updatedStudio));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0]?.message || "Validation error" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Delete Studio ---
export const deleteStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;
    const studio = await prisma.studio.findUnique({ where: { id } });

    if (!studio || studio.ownerId !== userId) {
      res.status(studio ? 403 : 404).json({ message: studio ? "Unauthorized" : "Not found" });
      return;
    }

    await prisma.studio.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Admin Controllers ---
export const getPendingStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const studios = await prisma.studio.findMany({
      where: { approvalStatus: "PENDING" },
      include: { owner: { select: { name: true, email: true } } },
    });
    res.json(studios.map(parseStudioData));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const studio = await prisma.studio.update({
      where: { id: req.params.id },
      data: { approvalStatus: "APPROVED" },
    });
    res.json(parseStudioData(studio));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const studio = await prisma.studio.update({
      where: { id: req.params.id },
      data: { approvalStatus: "REJECTED" },
    });
    res.json(parseStudioData(studio));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Admin: Create Studio Manual ---
export const createStudioManual = async (req: Request, res: Response): Promise<void> => {
  try {
    const manualSchema = createStudioSchema.extend({
      ownerId: z.string().optional(),
      approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
    });

    const data = manualSchema.parse(req.body);
    const adminId = req.user?.userId || req.user?.id;

    const studio = await prisma.studio.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        pricePerHour: data.pricePerHour,
        images: JSON.stringify(data.images || []),
        features: JSON.stringify(data.features || []),
        availability: data.availability || "available",
        approvalStatus: data.approvalStatus || "APPROVED",
        ownerId: data.ownerId || adminId!,
      }
    });

    res.status(201).json(parseStudioData(studio));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0]?.message || "Validation error" });
      return;
    }
    console.error("Manual Studio Create Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};