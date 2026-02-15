import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingsForOwner,
  updateBookingStatus,
  getBookingById,
} from "../controllers/bookingController.js";
import { authenticate, optionalAuthenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", optionalAuthenticate, createBooking);
router.get("/:id", optionalAuthenticate, getBookingById);

router.use(authenticate);

router.get("/my-bookings", getMyBookings); // As a client
router.get("/owner-bookings", getBookingsForOwner); // As an owner
router.patch("/:id/status", updateBookingStatus);

export default router;
