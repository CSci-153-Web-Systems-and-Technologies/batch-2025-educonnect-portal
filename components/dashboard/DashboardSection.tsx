import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  subtitle,
  actionLabel = "View All",
  onAction,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <Card 
      className={cn(
        "rounded-2xl border-gray-100 dark:border-border",
        "shadow-sm",
        "bg-white dark:bg-card",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-6 border-b border-gray-50 dark:border-border/50 mb-4">
        <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-foreground">
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="text-gray-500 font-medium">
                {subtitle}
              </CardDescription>
            )}
        </div>
        {onAction && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full px-4 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:border-border dark:text-muted-foreground" 
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

