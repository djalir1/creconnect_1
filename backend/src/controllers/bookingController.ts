import { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { z } from "zod";

const createBookingSchema = z.object({
  studioId: z.string().uuid(), 
  startDate: z.string().datetime(), // ISO 8601 string
  endDate: z.string().datetime(),
  guestName: z.string().min(1, "Guest name is required"),
  message: z.string().optional(),
  totalPrice: z.number().optional(),
  paymentMethod: z.string().optional(),
  payerPhone: z.string().optional(),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  console.log("createBooking request received:", req.body);
  try {
    const userId = req.user?.userId;

    const { studioId, startDate, endDate, guestName, message, totalPrice: inputPrice, paymentMethod, payerPhone } =
      createBookingSchema.parse(req.body);

    if (!studioId) {
       res.status(400).json({ message: "studioId is required" });
       return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      res.status(400).json({ message: "End date must be after start date" });
      return;
    }

    let totalPrice = inputPrice || 0;

    if (!totalPrice) {
        const studio = await prisma.studio.findUnique({
          where: { id: studioId },
        });
        if (!studio) {
          res.status(404).json({ message: "Studio not found" });
          return;
        }
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        totalPrice = hours * studio.pricePerHour;
    }

    console.log("Creating booking with data:", req.body);

    const booking = await prisma.booking.create({
      data: {
        userId,
        studioId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "PENDING",
        guestName,
        message,
        paymentMethod,
        payerPhone: payerPhone || null,
      },
    });

    console.log("Booking created:", booking.id);

    // Also create a Message record if there's a guest message
    if (message) {
      console.log("Creating message for booking:", booking.id);
      let ownerId = "";
      
      if (studioId) {
          const studio = await prisma.studio.findUnique({
            where: { id: studioId },
            select: { ownerId: true },
          });
          ownerId = studio?.ownerId || "";
      } 

      console.log("Owner found:", ownerId);

      if (ownerId) {
        const contentParts = [];
        if (message) contentParts.push(message);
        if (payerPhone) contentParts.push(`Phone: ${payerPhone}`);

        await prisma.message.create({
          data: {
            senderId: userId || null,
            receiverId: ownerId,
            content: contentParts.join(" \n") || "New booking message",
            guestName: userId ? null : guestName,
          },
        });
        console.log("Message record created.");
      }
    }

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Validation error:", error.issues);
      res
        .status(400)
        .json({
          message: (error as any).issues[0]?.message || "Validation error",
        });
      return;
    }
    console.error("Internal Error in createBooking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Get bookings made BY the user
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        studio: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingsForOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find all bookings for studios owned by this user
    const bookings = await prisma.booking.findMany({
      where: {
        studio: { ownerId: userId },
      },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        studio: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { status } = updateBookingStatusSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        studio: true,
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // Check if the user is the owner of the studio
    const isOwner = booking.studio && booking.studio.ownerId === userId;

    if (!isOwner) {
      res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
      return;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: status as "CONFIRMED" | "CANCELLED" | "COMPLETED" },
    });

    res.json(updatedBooking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({
          message: (error as any).issues[0]?.message || "Validation error",
        });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        studio: { select: { name: true, location: true, ownerId: true } },
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // Authorization check
    // 1. If user is logged in, they must be the booker or the studio owner
    if (userId) {
      const isBooker = booking.userId === userId;
      const isOwner = booking.studio && booking.studio.ownerId === userId;
      
      // If a user is logged in, but isn't the booker or owner, 
      // we only allow it if the booking was a guest booking (userId is null)
      // This allows the success page to work if someone logs in AFTER guest booking.
      if (!isBooker && !isOwner && booking.userId !== null) {
        res.status(403).json({ message: "Not authorized to view this booking" });
        return;
      }
    }
    // 2. If no user is logged in, we allow it (for the success page/guest receipt)
    // In a production app, we might want to verify a "guest token" but for now this fixes the reported issue.

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
