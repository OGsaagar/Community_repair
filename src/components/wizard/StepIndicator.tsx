import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full font-semibold transition",
                  isCompleted && "bg-green text-white",
                  isActive && "bg-green text-white ring-4 ring-green-light",
                  !isCompleted && !isActive && "bg-cream-2 text-ink-60 border-2 border-cream-3"
                )}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition",
                    stepNumber < currentStep ? "bg-green" : "bg-cream-3"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "text-xs font-semibold uppercase transition",
              index + 1 <= currentStep ? "text-green" : "text-ink-60"
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
