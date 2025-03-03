"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";

/**
 * DatePicker component for selecting dates
 * @param date - The selected date
 * @param onDateChange - Callback function when date changes
 * @param disabled - Whether the date picker is disabled
 */
export function DatePicker({
  date,
  onDateChange,
  disabled = false,
}: {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  // For debugging
  React.useEffect(() => {
    console.log("DatePicker rendered with date:", date);
  }, [date]);

  // Function to handle date selection
  const handleDateSelect = React.useCallback(
    (newDate: Date | undefined) => {
      console.log("Calendar onSelect called with date:", newDate);
      // Force the date to be set to noon to avoid timezone issues
      if (newDate) {
        const adjustedDate = new Date(newDate);
        adjustedDate.setHours(12, 0, 0, 0);
        console.log("Adjusted date:", adjustedDate);
        onDateChange(adjustedDate);
      } else {
        onDateChange(undefined);
      }

      // Close the popover after selection with a slight delay
      setTimeout(() => {
        setOpen(false);
      }, 300);
    },
    [onDateChange]
  );

  // Ensure we have a valid date object
  React.useEffect(() => {
    if (date && (!(date instanceof Date) || isNaN(date.getTime()))) {
      console.warn("Invalid date provided to DatePicker:", date);
      onDateChange(new Date());
    }
  }, [date, onDateChange]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
              type="button"
            >
              {date && date instanceof Date && !isNaN(date.getTime()) ? (
                format(date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="p-2">
            <Calendar
              mode="single"
              selected={
                date instanceof Date && !isNaN(date.getTime())
                  ? date
                  : undefined
              }
              onSelect={handleDateSelect}
              defaultMonth={
                date instanceof Date && !isNaN(date.getTime())
                  ? date
                  : new Date()
              }
              captionLayout="dropdown-buttons"
              initialFocus
              className="border-0"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
