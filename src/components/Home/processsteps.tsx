import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Glory from '../../assets/glory.png';

export default function ProcessSteps() {
    const [applicationsCount, setApplicationsCount] = useState(0);
useEffect(() => {
    // Generate a random number between 10 and 20
    const randomNum = Math.floor(Math.random() * 11) + 10;
    setApplicationsCount(randomNum);
}, []);

    const steps = [
        {
            number: 1,
            title: "Submit Application",
            description: "Share your resume and basic information online."
        },
        {
            number: 2,
            title: "Quick Assessment",
            description: "Get interviewed by a senior psychologist within 72 hours of applying."
        },
        {
            number: 3,
            title: "Begin Counseling",
            description: "Start your practice with real clients right away."
        }
    ];

    
    return (
        <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
                Simple 3-Step Online Onboarding Process
            </h3>

            {/* Mobile-First Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {steps.map((step) => (
                    <div key={step.number} className="bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-soft">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                                {step.number}
                            </div>
                            <h4 className="font-semibold text-foreground text-lg">{step.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-glow animate-pulse-glow">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <span className="text-sm font-semibold">
                  {applicationsCount} applications received in the last hour
                 </span>
                    {/* <span className="text-sm font-semibold">12 applications received in the last hour</span> */}
                </div>
            </div>

            {/* Mobile-Friendly Guarantee */}
            <div className="mt-8 p-4 border border-accent/30 rounded-lg text-center">
                <p className="text-sm text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 inline mr-2 text-primary" />
                    Money Back Guarantee: Full refund if not selected for the program
                </p>
            </div>

            {/* Achievement Section */}
            <div className="mt-6 mb-0 flex items-center justify-center gap-5">
                <img
                    src={Glory}
                    alt="Glory"
                    className="h-20 w-auto opacity-90"
                />
                <div className="text-center">
                    <p className="text-4xl md:text-5xl font-extrabold text-red-500">100+ Hours</p>
                    <p className="text-base font-medium text-red-500/90 mt-1 tracking-wide">OF SUCCESSFUL ONLINE SESSIONS TAKEN</p>
                </div>
                <img
                    src={Glory}
                    alt="Glory"
                    className="h-20 w-auto opacity-90 transform scale-x-[-1]"
                />
            </div>
        </div>

    )
}