"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const locationSchema = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
  address: z.string().min(5, "Address is required"),
  postal_code: z.string().min(3, "Postal code required"),
});

type LocationFormData = z.infer<typeof locationSchema>;

export function Step3Location({ onNext }: { onNext: (data: LocationFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink-900">Address</label>
        <input
          {...register("address")}
          type="text"
          placeholder="123 Main St, Your City"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-900">Postal Code</label>
          <input
            {...register("postal_code")}
            type="text"
            placeholder="12345"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
          />
          {errors.postal_code && (
            <p className="mt-1 text-sm text-red-500">{errors.postal_code.message}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Note: For this demo, enter 0 for coordinates. In production, integrate with a geocoding API.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-900">Latitude</label>
          <input
            {...register("latitude")}
            type="text"
            placeholder="40.7128"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-900">Longitude</label>
          <input
            {...register("longitude")}
            type="text"
            placeholder="-74.0060"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        Next: Review & Submit
      </button>
    </form>
  );
}
