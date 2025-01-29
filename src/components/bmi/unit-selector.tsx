import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UnitSelectorProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  units: Record<string, string>;
  label: string;
}

export function UnitSelector<T extends string>({
  value,
  onValueChange,
  units,
  label,
}: UnitSelectorProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="inline-flex rounded-lg border p-1 bg-muted/20 w-full">
        {Object.entries(units).map(([unitValue, unitLabel]) => (
          <Button
            key={unitValue}
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 rounded-md px-3 py-1 transition-all text-sm font-normal",
              value === unitValue
                ? "bg-background shadow-sm font-medium"
                : "hover:bg-muted text-muted-foreground"
            )}
            onClick={() => onValueChange(unitValue as T)}
          >
            {unitLabel}
          </Button>
        ))}
      </div>
    </div>
  );
}
