import PricingCard from "./pricing_card";

export default function Plans() {
    return (
        <>
            <section id="programs" className="py-16 sm:py-20 lg:py-24 bg-gradient-hero">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Choose Your Founding Cohort Path
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Two pathways designed for psychology graduates ready to gain real clinical experience.
                            Limited to first 100 members with 30% early bird pricing.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <PricingCard
                        title="Foundational Impact Program"
                        originalPrice={10000}
                        discountedPrice={7000}
                        targetDate="2025-10-24T17:30:00"
                        plan="foundational"
                        earlyBirdSpotPercentage={15}
                        features={["100+ hours of online counseling sessions with real clients.", "Start earning up to ₹1,000 per session after completing 100 hours", "Individual mentor support for difficult cases", "Weekly group supervision sessions with fellow graduates.", "Certificate of completion after completing 100 hours.", "Unlimited Free Access to our Latest EHR platform for maintaining digital notes of clients.", "Lifetime access to the alumni network and resources."]}
                    />
                    <PricingCard
                        title="Elite Mentorship Program"
                        originalPrice={20000}
                        discountedPrice={14000}
                        targetDate="2025-10-24T17:30:00"
                        plan="elite"
                        earlyBirdSpotPercentage={30}
                        isPopular
                        features={["100+ hours of online counseling sessions with real clients.", "Start earning up to ₹1,000 per session after completing 100 hours", "Individual mentor support for difficult cases", "Exclusive access to premium psychology practice resources.", "Certificate of completion after completing 100 hours.", "Unlimited Free Access to our Latest EHR platform for maintaining digital notes of clients.", "Lifetime access to the alumni network and resources.", "Founding member leadership role in expanding the program.", "10+ counseling sessions supervised by senior psychologists.", "Waiver available if you have proof of 100 hours of sessions with clients."]}
                    />
                </div>
            </section>
        </>
    )
}