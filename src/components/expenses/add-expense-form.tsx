"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import mutate from "@/lib/firebase/mutate-data";
import { useEffect } from "react";

const expenseFormSchema = z.object({
  date: z.string(),
  type: z.string().min(1, "Type is required"),
  otherType: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseFormProps {
  onSubmit: () => void;
  initialValues?: ExpenseFormValues & { id?: string };
}

export function AddExpenseForm({
  onSubmit,
  initialValues,
}: AddExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialValues || {
      date: new Date().toISOString().split("T")[0],
      type: "",
      otherType: "",
      amount: 0,
      description: "",
    },
  });

  const selectedType = form.watch("type");

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    try {
      const expenseData = {
        date: data.date,
        type: data.type === "other" ? data.otherType || "Other" : data.type,
        amount: data.amount,
        description: data.description,
      };

      if (initialValues?.id) {
        await mutate({
          path: `expenses/${initialValues.id}`,
          data: expenseData,
          action: "update",
        });
      } else {
        await mutate({
          path: "expenses",
          data: expenseData,
          action: "createWithId",
        });
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      onSubmit();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "other" && (
          <FormField
            control={form.control}
            name="otherType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Other Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter expense type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">Save Expense</Button>
        </div>
      </form>
    </Form>
  );
}
