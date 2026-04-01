"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const deviceSchema = z.object({
  device_type: z.string().min(1, "Select a device type"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  issue_description: z.string().min(10, "Describe the issue in detail"),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

export function Step1DeviceInfo({ onNext }: { onNext: (data: DeviceFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
  });

  const deviceTypes = ["Phone", "Laptop", "Tablet", "Watch", "Headphones", "Other"];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink-900">Device Type</label>
        <select
          {...register("device_type")}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select device type</option>
          {deviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.device_type && (
          <p className="mt-1 text-sm text-red-500">{errors.device_type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-900">Brand</label>
          <input
            {...register("brand")}
            type="text"
            placeholder="e.g., Apple"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
          />
          {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-900">Model</label>
          <input
            {...register("model")}
            type="text"
            placeholder="e.g., iPhone 13"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
          />
          {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-900">Issue Description</label>
        <textarea
          {...register("issue_description")}
          rows={4}
          placeholder="Describe what's wrong with your device..."
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
        />
        {errors.issue_description && (
          <p className="mt-1 text-sm text-red-500">{errors.issue_description.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        Next: Upload Photos
      </button>
    </form>
  );
}
