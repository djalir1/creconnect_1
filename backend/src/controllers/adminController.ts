import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

// Get Platform Overview Stats
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalStudios = await prisma.studio.count();
    const pendingStudios = await prisma.studio.count({ where: { approvalStatus: "PENDING" } });
    const liveStudios = await prisma.studio.count({ where: { approvalStatus: "APPROVED" } });
    
    const totalUsers = await prisma.user.count();
    const totalOwners = await prisma.user.count({ where: { role: "STUDIO_OWNER" } });
    const totalClients = await prisma.user.count({ where: { role: "CLIENT" } });

    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { totalPrice: true }
    });

    // Recent Activity (last 5 bookings)
    const recentActivity = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        studio: { select: { name: true } }
      }
    });

    res.json({
      stats: {
        studios: { total: totalStudios, pending: pendingStudios, live: liveStudios },
        users: { total: totalUsers, owners: totalOwners, clients: totalClients },
        bookings: { total: totalBookings },
        revenue: totalRevenue._sum.totalPrice || 0
      },
      recentActivity
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Studios with full details
export const getAdminStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const studios = await prisma.studio.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { bookings: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(studios);
  } catch (error) {
    console.error("Admin Studios Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Bookings
export const getAdminBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        studio: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(bookings);
  } catch (error) {
    console.error("Admin Bookings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Users by Role
export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role) {
      where.role = role as any;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            studios: true,
            bookings: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  } catch (error) {
    console.error("Admin Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
