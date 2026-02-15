import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    default: "from-primary/20 to-primary/10",
    success: "from-success/20 to-success/10",
    warning: "from-warning/20 to-warning/10",
    destructive: "from-destructive/20 to-destructive/10",
  };

  return (
    <Card className="overflow-hidden relative group hover:shadow-glow hover:scale-[1.02] transition-all duration-300">
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
        variantStyles[variant]
      )} />
      <CardContent className="pt-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {trend.value}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "rounded-full p-3 bg-gradient-primary shadow-accent",
              variantStyles[variant]
            )}
          >
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
