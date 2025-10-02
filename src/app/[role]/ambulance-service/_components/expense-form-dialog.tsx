"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Plus, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { type DriverExpense } from "@/types/expense";
import {
  COMMON_EXPENSE_TYPES,
  driverExpenseSchema,
  type DriverExpenseFormData,
} from "./types-and-constants";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: ExpenseFormDialogProps) {
  const [isSubmittingExpense, setIsSubmittingExpense] = React.useState(false);
  const { toast } = useToast();

  // Driver expense form
  const expenseForm = useForm<DriverExpenseFormData>({
    resolver: zodResolver(driverExpenseSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      notes: "",
      otherExpenses: [],
    },
  });

  // Reset form when expense dialog opens
  React.useEffect(() => {
    if (open) {
      console.log("Expense form dialog opened, resetting form");
      expenseForm.reset({
        date: new Date().toISOString().split("T")[0],
        notes: "",
        otherExpenses: [],
      });
    }
  }, [open, expenseForm]);

  const { fields, append, remove } = useFieldArray({
    control: expenseForm.control,
    name: "otherExpenses",
  });

  const handleExpenseSubmit = async (data: DriverExpenseFormData) => {
    console.log("=== Expense Form Submission Started ===");
    console.log("Received form data:", data);
    setIsSubmittingExpense(true);
    try {
      // Calculate totals from other expenses
      const otherExpensesTotal =
        data.otherExpenses?.reduce((sum, expense) => sum + expense.amount, 0) ||
        0;
      const totalExpenses = otherExpensesTotal;
      const netAmount = -totalExpenses; // Negative since it's an expense

      // Create expense data
      const expenseData: Omit<DriverExpense, "id"> = {
        date: data.date,
        expenses: {
          otherExpenses: data.otherExpenses?.map((expense) => ({
            type:
              expense.type === "other" && expense.customType
                ? expense.customType
                : COMMON_EXPENSE_TYPES.find((t) => t.value === expense.type)
                    ?.label || expense.type,
            amount: expense.amount,
          })),
        },
        collections: [], // No collections for expenses
        totalExpenses,
        totalCollections: 0,
        netAmount,
        notes: data.notes,
        createdBy: "current-user", // In real app, get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        driverName: "",
        vehicleNumber: "",
      };

      // Save to database
      const result = await mutateData({
        path: "driver-expenses",
        data: expenseData,
        action: "createWithId",
      });

      // Also save each expense to the main expenses collection so it appears in the expense tab
      if (expenseData.expenses.otherExpenses && expenseData.expenses.otherExpenses.length > 0) {
        for (const expenseItem of expenseData.expenses.otherExpenses) {
          const mainExpenseData = {
            date: expenseData.date,
            type: expenseItem.type,
            amount: expenseItem.amount,
            description: `Ambulance service expense for ${expenseItem.type} - ${expenseData.notes || ''}`.trim(),
            createdAt: expenseData.createdAt,
            updatedAt: expenseData.updatedAt,
          };

          const expenseResult = await mutateData({
            path: "expenses",
            data: mainExpenseData,
            action: "createWithId",
          });
          
          if (!expenseResult.success) {
            console.error("Failed to save individual expense to main expenses collection:", expenseResult.error);
            toast({
              title: "Partial Success",
              description: `Some expenses were saved, but failed to save to main expense tab: ${expenseResult.error}`,
              variant: "destructive",
            });
          } else {
            console.log("Successfully saved individual expense to main expenses collection:", expenseResult.id);
          }
        }
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to save expense data");
      }

      toast({
        title: "Expenses Saved Successfully",
        description: `Daily expenses have been recorded. Total amount: ₹${totalExpenses.toLocaleString()}`,
      });

      // Reset form and close dialog
      expenseForm.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving expense data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to save expenses: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Add Daily Expenses
          </DialogTitle>
          <DialogDescription>
            Record your daily expenses like petrol, meals, and travel costs
          </DialogDescription>
        </DialogHeader>

        <Form {...expenseForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("=== Form Submission Debug ===");
              console.log("Form values:", expenseForm.getValues());
              console.log(
                "Form errors before submit:",
                expenseForm.formState.errors
              );
              console.log("Is form valid?", expenseForm.formState.isValid);

              // Trigger validation manually to see what's failing
              expenseForm.trigger().then((isValid) => {
                console.log("Manual validation result:", isValid);
                console.log(
                  "Form errors after validation:",
                  expenseForm.formState.errors
                );

                if (isValid) {
                  console.log("Proceeding with form submission...");
                  expenseForm.handleSubmit(handleExpenseSubmit)(e);
                } else {
                  console.log("Form validation failed, not submitting");
                  toast({
                    title: "Form Validation Failed",
                    description:
                      "Please check the form for errors and try again.",
                    variant: "destructive",
                  });
                }
              });
            }}
            className="space-y-6"
          >
            {/* Date Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={expenseForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        onChange={(e) => {
                          console.log("Date changed:", e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Other Expenses */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Other Expenses
              </h4>
              {fields.map((item, index) => {
                const selectedType = expenseForm.watch(
                  `otherExpenses.${index}.type`
                );
                return (
                  <div
                    key={item.id}
                    className="space-y-4 p-4 border rounded-lg mb-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={expenseForm.control}
                        name={`otherExpenses.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expense Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select expense type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60 overflow-y-auto">
                                {COMMON_EXPENSE_TYPES.map(
                                  (expenseType, typeIndex) => (
                                    <SelectItem
                                      key={expenseType.value}
                                      value={expenseType.value}
                                      className="cursor-pointer hover:bg-accent focus:bg-accent"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                          {expenseType.label}
                                        </span>
                                        {typeIndex <
                                          COMMON_EXPENSE_TYPES.length - 1 && (
                                          <span className="text-xs text-muted-foreground">
                                            #{typeIndex + 1}
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name={`otherExpenses.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Custom type input - shown only when "other" is selected */}
                    {selectedType === "other" && (
                      <FormField
                        control={expenseForm.control}
                        name={`otherExpenses.${index}.customType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please specify expense type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter custom expense type"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          console.log("Removing expense at index:", index);
                          console.log("Current fields before removal:", fields);
                          remove(index);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Adding new expense field");
                  console.log("Current fields before addition:", fields);
                  append({ type: "", customType: "", amount: 0 });
                }}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Other Expense
              </Button>
            </div>

            {/* Additional Notes */}
            <FormField
              control={expenseForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about today's expenses or trips..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log("Cancel button clicked, closing expense form");
                  onOpenChange(false);
                }}
                disabled={isSubmittingExpense}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gap-2"
                disabled={isSubmittingExpense}
              >
                <Receipt className="h-4 w-4" />
                {isSubmittingExpense ? "Saving..." : "Save Expenses"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
