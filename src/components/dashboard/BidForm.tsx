"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bidSchema = z.object({
  price: z.string().transform(Number).pipe(z.number().positive("Price must be positive")),
  estimated_days: z.string().transform(Number).pipe(z.number().positive("Days must be positive")),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type BidFormData = z.infer<typeof bidSchema>;

export function BidForm({
  onSubmitBid,
  isSubmitting,
}: {
  onSubmitBid: (data: BidFormData) => void;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmitBid)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-900">Quote Price ($)</label>
        <input
          {...register("price")}
          type="text"
          placeholder="99.99"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-900">Estimated Days</label>
        <input
          {...register("estimated_days")}
          type="text"
          placeholder="3"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.estimated_days && (
          <p className="mt-1 text-sm text-red-500">{errors.estimated_days.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-900">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Explain your approach..."
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Bid"}
      </button>
    </form>
  );
}
