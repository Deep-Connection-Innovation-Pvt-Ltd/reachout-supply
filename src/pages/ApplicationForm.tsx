import { useState, useEffect, useMemo} from "react";
import API from '../config/api';
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
    const [isStepValid, setIsStepValid] = useState(false);

    const paymentDetails = useMemo(() => {
        const basePrice = parseInt(planDetails[plan].price.replace(/,/g, ''), 10);
        const discountAmount = basePrice * 0.30;
        console.log('discount amount is', discountAmount);
        const total = basePrice - discountAmount;
        return { total, basePrice, formattedTotal: `₹${total.toLocaleString('en-IN')}` };
    }, [plan, planDetails]);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        // Step 1: Create an order on your backend
         const orderResponse = await fetch(API.CREATE_ORDER, {
          //const orderResponse = await fetch('/professional/backend/create_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: paymentDetails.total,
                programType: planDetails[plan].title,
                programPrice: paymentDetails.basePrice,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
            }),
        });
        const orderData = await orderResponse.json();
        console.log('orderData is ',orderData);

        if (!orderData.id) {
            alert("Error creating order. Please try again.");
            return;
        }

        // Step 2: Open Razorpay Checkout
        const options = {
            key: orderData.key_id, // Use the key from the backend
            amount: orderData.amount,
            currency: "INR",
            name: "Deep Connection Innovation Pvt. Ltd.",
            description: planDetails[plan].title,
            // Removed image to avoid CORS issues in development
            order_id: orderData.id,
            handler: async function (response: any) {
                // Step 3: Verify payment on your backend
                const postData = new FormData();
                const finalFormData = { ...formData };

                // If 'Others' is selected for expertise, use the specified value
                if (finalFormData.area_of_expertise === 'Others (please specify)') {
                    finalFormData.area_of_expertise = finalFormData.other_expertise;
                }

                // Append all form data fields
                for (const key in finalFormData) {
                    if (key === 'resume' && finalFormData.resume) {
                        postData.append('resume', finalFormData.resume, finalFormData.resumeFileName);
                    } else {
                        postData.append(key, (finalFormData as any)[key]);
                    }
                }
                postData.append('order_id', response.razorpay_order_id);
                postData.append('payment_id', response.razorpay_payment_id);
                postData.append('signature', response.razorpay_signature);
                postData.append('programType', planDetails[plan].title);
                postData.append('amount', String(paymentDetails.total));

                try {
                    // Use relative URL to avoid CORS issues
                 const verifyResponse = await fetch(API.VERIFY_PAYMENT, {
              //  const verifyResponse = await fetch('/professional/backend/verify_payment.php', {
                        method: 'POST',
                        body: postData, // The browser will set the Content-Type to multipart/form-data
                        credentials: 'include' // Important for cookies, authorization headers with HTTPS
                    });

                    if (!verifyResponse.ok) {
                        throw new Error(`HTTP error! status: ${verifyResponse.status}`);
                    }

                    const verifyResult = await verifyResponse.json();

                    if (verifyResult.success) {
                        // Step 4: Navigate to success page on successful verification
                        navigate(`/payment_success?order_id=${response.razorpay_order_id}`);
                    } else {
                        throw new Error(verifyResult.error || 'Payment verification failed');
                    }
                } catch (error: unknown) {
                    console.error('Payment verification error:', error);
                    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                    alert(`Payment verification failed: ${errorMessage}. Please contact support.`);
                }
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

    // Validate form data whenever it changes
    useEffect(() => {
        const validateStep = () => {
            switch (step) {
                case "personal-details": {
                    const { fullName, email, phone, rciLicense, graduationCollege, graduationYear, postGraduationCollege, postGraduationYear } = formData;
                    // Regex for validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const phoneRegex = /^\d{10,15}$/; // 10 to 15 digits
                    const yearRegex = /^\d{4}$/; // 4-digit year

                    return fullName.trim() !== '' &&
                           emailRegex.test(email) &&
                           phoneRegex.test(phone.trim()) &&
                           rciLicense.trim() !== '' &&
                           graduationCollege.trim() !== '' &&
                           yearRegex.test(graduationYear.trim()) &&
                           postGraduationCollege.trim() !== '' &&
                           yearRegex.test(postGraduationYear.trim());
                }
                case "academic-details": {
                    const { masters_program, area_of_expertise, other_expertise, resume } = formData;
                    if (area_of_expertise === 'Others (please specify)') {
                        return masters_program.trim() !== '' &&
                               area_of_expertise.trim() !== '' &&
                               other_expertise.trim() !== '' &&
                               resume !== null;
                    }
                    return masters_program.trim() !== '' &&
                           area_of_expertise.trim() !== '' &&
                           resume !== null;
                }
                default:
                    return true; // No validation for other steps
            }
        };
        setIsStepValid(validateStep());
    }, [formData, step]);

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
                            disabled={!isStepValid}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
