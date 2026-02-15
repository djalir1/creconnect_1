import { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { z } from "zod";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  studioId: z.string().uuid(),
});

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { rating, comment, studioId } = createReviewSchema.parse(req.body);

    // Check if user has already reviewed? (Optional rule, skipping for now)

    const review = await prisma.review.create({
      data: {
        userId,
        rating,
        comment,
        studioId,
      },
    });

    // Update Average Rating
    // We'll calculate the new average and update the parent entity
    const aggregations = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { studioId }
    });
    await prisma.studio.update({
      where: { id: studioId },
      data: { rating: aggregations._avg.rating || 0 }
    });

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: (error as any).issues[0]?.message || "Validation error" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReviewsByTarget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studioId } = req.query;

    const where: any = {};
    if (studioId) where.studioId = studioId as string;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
