"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "primary" | "warning" | "success" | "accent" | "default";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-600 border-blue-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
    success: "bg-green-50 text-green-600 border-green-200",
    accent: "bg-purple-50 text-purple-600 border-purple-200",
    default: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const iconBgStyles = {
    primary: "bg-blue-100",
    warning: "bg-amber-100",
    success: "bg-green-100",
    accent: "bg-purple-100",
    default: "bg-gray-100",
  };

  return (
    <div className={`p-6 rounded-xl border bg-card ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconBgStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
