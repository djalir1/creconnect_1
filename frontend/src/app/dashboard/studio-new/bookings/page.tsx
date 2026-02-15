'use client';

import Bookings from "../pages/Bookings";

export default function BookingsPage() {
  // Removed <Layout> to prevent the double sidebar issue.
  // Next.js automatically wraps this in the layout.tsx found in the parent folder.
  return <Bookings />;
}