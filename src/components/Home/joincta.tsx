import { Button } from '../ui/button';
import { Trophy, ArrowRight } from 'lucide-react';

export default function JoinCTA() {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-primary text-primary-foreground">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                    Ready to Join the Founding Cohort?
                </h2>
                <p className="text-base sm:text-lg mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                    Be among the first 100 psychology graduates to transform theory into practice
                    through supervised online sessions. Your professional journey starts now.
                </p>

                <div className="flex justify-center mb-8">
                    <Button
                        size="lg"
                        variant="secondary"
                        className="px-12 sm:px-16 py-4 text-base sm:text-lg min-h-[56px] cursor-pointer foundational-cohort"
                        onClick={() => {
                            const pricingSection = document.getElementById('programs');
                            if (pricingSection) {
                                pricingSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        <Trophy className="w-5 h-5 mr-3" />
                        <span className="font-semibold">Join Founding Cohort</span>
                        <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                </div>

                <div className="text-sm opacity-75 space-y-2">
                    <p>✓ Exclusive early member benefits  ✓ 30% early bird discount</p>
                    <p>✓ Only 100 spots available  ✓ Work from anywhere online</p>
                </div>
            </div>
        </section>
    )
}