import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  actionLabel?: string;
  onAction?: () => void; // This is optional (?)
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  actionLabel = "View Details",
  onAction,
  className,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "flex flex-col justify-between", // This ensures layout is balanced
        "rounded-2xl border-gray-100 dark:border-border",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        "bg-white dark:bg-card",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-base font-semibold text-gray-700 dark:text-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl bg-gray-50 dark:bg-muted/50", iconColor?.replace("text-", "bg-").replace("500", "100/50"))}>
           <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-foreground">
          {value}
        </div>
        <p className="text-sm text-muted-foreground mt-1 font-medium">
          {subtitle}
        </p>
        
        {/* Helper function for appearing the view detail button */}
        {onAction && (
          <div className="mt-6">
            <Button 
                variant="ghost" 
                className="w-full rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 dark:bg-muted/50 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground" 
                onClick={onAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}