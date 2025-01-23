import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface DashboardCard {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  description: string;
  icon: React.ElementType;
}

export default function StatCard({ card }: { card: DashboardCard }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <card.icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            {card.title}
          </p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold">{card.value}</h3>
            {card.change && (
              <span
                className={cn(
                  "flex items-center text-sm",
                  card.change.trend === "up"
                    ? "text-emerald-500"
                    : "text-destructive"
                )}
              >
                {card.change.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {card.change.value}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{card.description}</p>
        </div>
      </div>
    </Card>
  );
}
