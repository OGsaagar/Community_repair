"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileCompletionPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"client" | "repairer" | "both">("client");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRoleSelect = (newRole: "client" | "repairer" | "both") => {
    setRole(newRole);
    setStep(2);
  };

  const handleSpecialty = (specialty: string) => {
    setSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleNext = async () => {
    if (step === 2) {
      if (!fullName.trim()) {
        setError("Full name is required");
        return;
      }
      setStep(3);
    } else if (step === 3 && (role === "repairer" || role === "both")) {
      if (specialties.length === 0) {
        setError("Select at least one specialty");
        return;
      }
      await handleComplete();
    } else if (step === 3) {
      await handleComplete();
    }
    setError("");
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const profileData: any = {
        id: user.data.user.id,
        full_name: fullName,
        role,
      };

      if (role === "repairer" || role === "both") {
        profileData.specialties = specialties;
      }

      await supabase.from("profiles").update(profileData).eq("id", user.data.user.id);

      router.push(role === "client" ? "/dashboard/client" : "/dashboard/repairer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const specialtyOptions = [
    "Phones",
    "Laptops",
    "Tablets",
    "Computers",
    "Smart Home",
    "Appliances",
    "Furniture",
    "Jewelry",
    "Clothing",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-cream-3 rounded-xl p-8 shadow-md">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <>
              <h1 className="text-3xl font-display font-bold text-ink mb-2">
                Welcome to RepairHub
              </h1>
              <p className="text-ink-60 mb-8">What brings you here?</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect("client")}
                  className="w-full p-4 border-2 border-cream-3 rounded-lg hover:border-green hover:bg-green-light transition text-left"
                >
                  <p className="font-semibold text-ink">Client</p>
                  <p className="text-sm text-ink-60">Post repair requests</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("repairer")}
                  className="w-full p-4 border-2 border-cream-3 rounded-lg hover:border-green hover:bg-green-light transition text-left"
                >
                  <p className="font-semibold text-ink">Repairer</p>
                  <p className="text-sm text-ink-60">Offer repair services</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("both")}
                  className="w-full p-4 border-2 border-cream-3 rounded-lg hover:border-green hover:bg-green-light transition text-left"
                >
                  <p className="font-semibold text-ink">Both</p>
                  <p className="text-sm text-ink-60">Be a client and repairer</p>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Name & Bio */}
          {step === 2 && (
            <>
              <h1 className="text-3xl font-display font-bold text-ink mb-2">
                Tell us about yourself
              </h1>
              <p className="text-ink-60 mb-8">Step 1 of 2</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none"
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2 border border-cream-3 rounded-lg hover:bg-cream-2 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green text-white rounded-lg hover:bg-green-mid transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Specialties (for repairers) or Confirmation */}
          {step === 3 && (
            <>
              <h1 className="text-3xl font-display font-bold text-ink mb-2">
                {role === "client" ? "You're all set!" : "Choose your specialties"}
              </h1>
              <p className="text-ink-60 mb-8">
                {role === "client"
                  ? "Ready to post your first repair request?"
                  : "Step 2 of 2"}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {(role === "repairer" || role === "both") && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {specialtyOptions.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => handleSpecialty(specialty)}
                        className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
                          specialties.includes(specialty)
                            ? "border-green bg-green-light text-green"
                            : "border-cream-3 hover:border-cream-2"
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-2 border border-cream-3 rounded-lg hover:bg-cream-2 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green text-white rounded-lg hover:bg-green-mid transition disabled:opacity-50"
                >
                  {loading ? "Setting up..." : "Get Started"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
