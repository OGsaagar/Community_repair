"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Step1DeviceInfo } from "@/components/wizard/Step1DeviceInfo";
import { Step2PhotoUpload } from "@/components/wizard/Step2PhotoUpload";
import { Step3Location } from "@/components/wizard/Step3Location";
import { Step4Confirm } from "@/components/wizard/Step4Confirm";
import { useAuth } from "@/hooks/useAuth";
import { useSubmitRepair } from "@/hooks/useRepairs";
import { StepIndicator } from "@/components/wizard/StepIndicator";

export default function RequestRepairPage() {
  const { user } = useAuth();
  const submitRepair = useSubmitRepair();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const handleStep1 = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (photoUrls: string[]) => {
    setFormData((prev: any) => ({ ...prev, photoUrls }));
    setStep(3);
  };

  const handleStep3 = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(4);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      await submitRepair.mutateAsync({
        client_id: user.id,
        device_type: formData.device_type,
        brand: formData.brand,
        model: formData.model,
        issue_description: formData.issue_description,
        location_latitude: formData.latitude,
        location_longitude: formData.longitude,
        location_address: formData.address,
        status: "pending",
      });
      alert("Repair request submitted successfully!");
      setStep(1);
      setFormData({});
    } catch (error) {
      alert("Failed to submit request");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
<h1 className="text-4xl font-display font-bold text-ink mb-8 text-center">
            Request a Repair
          </h1>
          <StepIndicator
            currentStep={step}
            steps={["Device Info", "Add Photos", "Your Location", "Confirm"]}
          />

            {step === 1 && <Step1DeviceInfo onNext={handleStep1} />}
            {step === 2 && <Step2PhotoUpload onNext={handleStep2} />}
            {step === 3 && <Step3Location onNext={handleStep3} />}
            {step === 4 && (
              <Step4Confirm
                data={formData}
                onSubmit={handleSubmit}
                onBack={() => setStep(3)}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
