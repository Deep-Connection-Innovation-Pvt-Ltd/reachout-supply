import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationSteps } from "@/components/Application/ApplicationSteps";
import PersonalDetails from "@/components/Application/PersonalDetails";
import AcademicDetails from "@/components/Application/AcademicDetails";
import ReviewDetails from "@/components/Application/ReviewDetails";
import { Button } from "@/components/ui/button";

interface ApplicationFormProps {
    plan: "elite" | "foundational";
}

export type FormData = {
    // Personal Details
    fullName: string;
    email: string;
    phone: string;
    rciLicense: string;
    graduationCollege: string;
    graduationYear: string;
    postGraduationCollege: string;
    postGraduationYear: string;
    // Academic Details
    masters_program: string;
    area_of_expertise: string;
    other_expertise: string;
    resume: File | null;
    resumeFileName: string;
}


export default function ApplicationForm({ plan }: ApplicationFormProps) {
    const navigate = useNavigate();
    const { step } = useParams<{ step: string }>(); // Get step from URL

    const planDetails = useMemo(() => ({
        elite: { title: "Elite Mentorship Program", price: "20,000" },
        foundational: { title: "Foundational Impact Program", price: "10,000" },
    }), []);

    const { title } = planDetails[plan];

    const [termsAccepted, setTermsAccepted] = useState(false);

    const paymentDetails = useMemo(() => {
        const basePrice = parseInt(planDetails[plan].price.replace(/,/g, ''), 10);
        const discountAmount = basePrice * 0.30;
        const total = basePrice - discountAmount;
        return { total, formattedTotal: `₹${total.toLocaleString('en-IN')}` };
    }, [plan, planDetails]);

    {/* This is where the Razorpay Payment Gateway will take information from */ }


    const planName = plan === 'elite' ? 'Elite Mentorship Program' : 'Foundational Impact Program';

    const handlePayment = () => {
        const amountInPaise = paymentDetails.total * 100;

        const options = {
            key: "rzp_test_rZe0zUGpvux0SS",
            amount: amountInPaise,
            currency: "INR",
            name: "Deep Connection Innovation Pvt. Ltd.",
            description: planName,
            image: "./logo.png",
            handler: function (response: any) {

                // When payment is successful
                navigate("/payment_success", {
                    state: {
                        payment_id: response.razorpay_payment_id,
                        amount: paymentDetails.total,
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.phone,
                        program: planName,
                    },
                });
            },
            prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone,
            },
            notes: {
                address: "1109, Ocus Quantum, Sector 51, Gurugram, Haryana, 122003",
            },
            theme: {
                color: "#0d6efd",
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };



    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        rciLicense: '',
        graduationCollege: '',
        graduationYear: '',
        postGraduationCollege: '',
        postGraduationYear: '',
        masters_program: '',
        area_of_expertise: '',
        other_expertise: '',
        resume: null,
        resumeFileName: '',
    });

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

    const handleDataChange = (newData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const renderStepContent = () => {
        switch (step) {
            case "personal-details":
                return <PersonalDetails data={formData} onDataChange={handleDataChange} />;
            case "academic-details":
                return <AcademicDetails data={formData} onDataChange={handleDataChange} />;
            case "review-details":
                return <ReviewDetails
                    data={formData}
                    planDetails={planDetails[plan]}
                    onTermsChange={setTermsAccepted}
                />;
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
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStepIndex === 0}
                    >
                        Previous
                    </Button>

                    {currentStepIndex === steps.length - 1 ? (
                        <Button
                            onClick={handlePayment}
                            disabled={!termsAccepted}
                            className="h-12 md:w-auto md:flex-grow max-w-xs text-lg shadow-glow cursor-pointer"
                        >
                            Pay Now - {paymentDetails.formattedTotal}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
