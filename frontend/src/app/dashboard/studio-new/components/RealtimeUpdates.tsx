'use client';

import { useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function RealtimeUpdates() {
  const queryClient = useQueryClient();
  // ... rest of your code stays the same

  useEffect(() => {
    // Subscribe to bookings changes
    const bookingsChannel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Booking change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          queryClient.invalidateQueries({ queryKey: ["calendar-bookings"] });
        }
      )
      .subscribe();

    // Subscribe to clients changes
    const clientsChannel = supabase
      .channel("clients-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clients",
        },
        (payload) => {
          console.log("Client change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ["clients"] });
        }
      )
      .subscribe();

    // Subscribe to payments changes
    const paymentsChannel = supabase
      .channel("payments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
        },
        (payload) => {
          console.log("Payment change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ["payments"] });
        }
      )
      .subscribe();

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log("New notification:", payload);
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
          
          // Show toast notification
          const notification = payload.new as any;
          toast.info(notification.title, {
            description: notification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [queryClient]);

  return null;
}
