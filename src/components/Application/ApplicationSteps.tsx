import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface StepProps {
  currentStep: number;
  steps: {
    title: string;
    description?: string;
    path: string; // Add path for each step
  }[];
  plan: string;
}

export function ApplicationSteps({ currentStep, steps, plan }: StepProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Update URL when step changes
  useEffect(() => {
    const stepPath = steps[currentStep]?.path;
    if (stepPath && location.pathname !== `/apply-${plan}/${stepPath}`) {
      // navigate(`/apply-${plan}/${stepPath}`); // Removed automatic navigation
    }
  }, [currentStep, navigate, plan, steps, location.pathname]);

  return (
    <div className="relative">

      {/* Step Count Display */}
      <div className="relative flex justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center">

            <motion.div
              initial={false}
              animate={{
                backgroundColor: currentStep >= index ? "var(--primary)" : "var(--muted)",
                scale: currentStep === index ? 1.2 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "border-4 border-background", // Removed cursor-pointer
                currentStep >= index ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {index + 1}
            </motion.div>
            <div className="mb-2 text-center">
              <p className="text-sm font-medium">{step.title}</p>
              {step.description && (
                <p className="text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>


          </div>
        ))}
      </div>


      {/* This is the progress bar */}

      <div className="w-full relative">
        <div className="absolute left-0 w-full h-1 bg-muted rounded-full" />
        {/* Animated Progress */}
        <motion.div
          className="absolute left-0 h-1 bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
