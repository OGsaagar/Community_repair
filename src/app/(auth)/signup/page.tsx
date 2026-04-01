"use client";

import Link from "next/link";
import { useState } from "react";

type UserRole = "client" | "repairer" | "both";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client" as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase signup
    console.log("Signup:", formData);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card border border-cream-3 rounded-xl p-8 shadow-md">
          <h1 className="text-3xl font-display font-bold text-ink mb-2 text-center">
            Create Account
          </h1>
          <p className="text-ink-60 text-center mb-8">
            Join RepairHub today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                I am a...
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserRole,
                  })
                }
                className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none transition"
              >
                <option value="client">Customer (need repairs)</option>
                <option value="repairer">Repair Professional</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green text-white py-2 rounded-lg font-semibold hover:bg-green-mid transition"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ink-60 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green font-semibold hover:text-green-mid"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
