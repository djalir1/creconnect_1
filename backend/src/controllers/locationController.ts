import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

export const getUniqueLocations = async (req: Request, res: Response) => {
  try {
    const studioLocations = await prisma.studio.findMany({
      select: { location: true },
      distinct: ['location']
    });



    const allLocations = new Set([
      ...studioLocations.map((s: { location: string }) => s.location),
    ]);

    res.json(Array.from(allLocations));
  } catch (error) {
    console.error("Error fetching unique locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
