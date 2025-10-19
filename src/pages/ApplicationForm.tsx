import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationSteps } from "@/components/Application/ApplicationSteps";
import PersonalDetails from "@/components/Application/PersonalDetails";
import AcademicDetails from "@/components/Application/AcademicDetails";
import ReviewDetails from "@/components/Application/ReviewDetails";

interface ApplicationFormProps {
    plan: "elite" | "foundational";
}

export default function ApplicationForm({ plan }: ApplicationFormProps) {
    const navigate = useNavigate();
    const { step } = useParams<{ step: string }>(); // Get step from URL

    const planDetails = {
        elite: { title: "Elite Mentorship Program", price: "20,000" },
        foundational: { title: "Foundational Impact Program", price: "10,000" },
    };

    const { title } = planDetails[plan];

    const steps = useMemo(() => [
        {
            title: "Personal Info",
            description: "Basic details",
            path: "personal-details"
        },
        {
            title: "Experience",
            description: "Your background",
            path: "academic-details"
        },
        {
            title: "Review",
            description: "Confirm details",
            path: "review-details"
        }
    ], []);

    const currentStepIndex = steps.findIndex(s => s.path === step);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Redirect to the first step if no step is provided or an invalid step is in the URL
    useEffect(() => {
        if (currentStepIndex === -1) {
            navigate(`/apply-${plan}/${steps[0].path}`);
        }
    }, [step, plan, navigate, currentStepIndex, steps]);

    // Enforce sequential flow
    useEffect(() => {
        if (currentStepIndex > 0 && !completedSteps.includes(currentStepIndex - 1)) {
            navigate(`/apply-${plan}/${steps[0].path}`);
        }
    }, [currentStepIndex, completedSteps, navigate, plan, steps]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCompletedSteps(prev => [...new Set([...prev, currentStepIndex])]);
            navigate(`/apply-${plan}/${steps[currentStepIndex + 1].path}`);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            navigate(`/apply-${plan}/${steps[currentStepIndex - 1].path}`);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case "personal-details":
                return <PersonalDetails />;
            case "academic-details":
                return <AcademicDetails />;
            case "review-details":
                return <ReviewDetails />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 mt-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Application For {title}</h2>
                <p className="text-muted-foreground mb-6">
                    Complete the following steps to apply for the program
                </p>
                
                <ApplicationSteps 
                    currentStep={currentStepIndex} 
                    steps={steps}
                    plan={plan}
                />
            </div>

            <div className="mt-8">
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStepIndex === 0}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentStepIndex === steps.length - 1}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {currentStepIndex === steps.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}
