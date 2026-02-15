"use client";

import { Bell, CheckCircle, Clock, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: 1,
    title: "New Studio Submission",
    message: "Indabo Cafe has submitted a new studio for approval.",
    time: "2 hours ago",
    type: "pending",
    icon: Clock,
    color: "text-warning bg-warning/10",
  },
  {
    id: 2,
    title: "Payment Received",
    message: "A payment of 50,000 RWF has been confirmed for Booking #BK-9021.",
    time: "5 hours ago",
    type: "success",
    icon: CheckCircle,
    color: "text-success bg-success/10",
  },
  {
    id: 3,
    title: "System Update",
    message: "platform will undergo maintenance tonight at 2:00 AM.",
    time: "1 day ago",
    type: "info",
    icon: Info,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: 4,
    title: "Dispute Opened",
    message: "A client has opened a dispute regarding a booking at PMP Studio.",
    time: "2 days ago",
    type: "warning",
    icon: AlertTriangle,
    color: "text-destructive bg-destructive/10",
  },
];

export default function AdminNotifications() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated with platform activity and alerts</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="font-semibold">Recent Alerts</h2>
          <button className="text-xs text-primary font-bold hover:underline">Mark all as read</button>
        </div>
        
        <div className="divide-y divide-border">
          {mockNotifications.map((notification, idx) => (
            <div 
              key={notification.id} 
              className="p-4 hover:bg-muted/20 transition-colors flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={cn("p-2 rounded-lg shrink-0", notification.color)}>
                <notification.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-foreground">{notification.title}</h3>
                  <span className="text-[10px] text-muted-foreground font-medium">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {mockNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted/30 mx-auto mb-3" />
            <p className="text-muted-foreground italic font-medium">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
