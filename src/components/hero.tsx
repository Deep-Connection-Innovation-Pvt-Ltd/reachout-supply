import { Trophy, ArrowRight, Users, Zap, TrendingUp, Target, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function Hero() {
    const benefits = [
        {
            icon: Users,
            title: "Complete Your 100 Hours",
            desc: "Gain hands-on experience through real counseling sessions with clients, backed by dedicated senior psychologist supervision and support",
            tag: "Fulfill the 100-hour requirements in few months.",
        },
        {
            icon: TrendingUp,
            title: "Start Earning While You Learn",
            desc: "Build your practice with a guaranteed client flow—connect with individuals seeking emotional support and guidance.",
            tag: "Earn up to ₹1000 per session after completing your 100 hours",
        },
        {
            icon: Target,
            title: "Learn from Real Cases",
            desc: "Tackle challenging cultural and contextual cases with peer collaboration and dedicated mentor support",
            tag: "You're never alone in your practice",
        },
        {
            icon: Globe,
            title: "Grow Your Practice",
            desc: "Get a ready client base and marketing support  on the platform post-completion of 100 + hours.",
            tag: "No investment in clinic space or advertising",
        },
    ];

    return (
        <>
            <section className="bg-gradient-hero pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">


                        {/* Main Headings */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                            Join ReachOut's Pioneering Founding Cohort for Psychologists.
                        </h1>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary mb-6 leading-tight">
                            India's biggest planned mental health revolution.
                        </h2>

                        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            Be among the first 100 psychologists to gain{" "}
                            <span className="text-primary font-semibold"> 100+ hours of real counseling sessions </span>with clients. Upon completion, earn up to ₹1,000 per session.
                        </p>


                        <div className="flex justify-center mb-16">
                            <div className="relative flex flex-col items-center">


                                <Button
                                    size="lg"
                                    className="bg-primary hover:shadow-glow transition-all duration-300 px-8 sm:px-12 py-6 text-base sm:text-lg min-h-[56px] rounded-full z-10 relative mx-auto"
                                >
                                    <Trophy className="w-6 h-6 mr-3 ml-3" />
                                    <span className="font-semibold">Join Founding Cohort</span>
                                    <ArrowRight className="w-6 h-6 ml-3 mr-3" />
                                </Button>

                                {/* Limited Time Pointer */}

                                <div className="mt-2 sm:mt-0 inline-flex items-center relative 
            bg-yellow-50 dark:bg-yellow-80 border-2 border-yellow-300 dark:border-yellow-300 
            text-yellow-900 dark:text-yellow-900 text-sm font-bold px-4 py-2.5 rounded-xl 
            shadow-lg animate-pulse whitespace-nowrap

            sm:absolute sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:ml-4"
                                >
                                    {/* Small pointer (only for desktop layout) */}
                                    <div className="hidden sm:block absolute -left-2 top-1/2 w-4 h-4 -mt-2 transform -rotate-45 
                bg-yellow-50 dark:bg-yellow-80 border-l-2 border-b-2 border-yellow-600 dark:border-yellow-600">
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <Zap className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-600" />
                                        <span className="font-bold">LIMITED TIME:</span>
                                        <span className="ml-1 font-semibold">Only 100 Spots Left!</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Benefits Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            From a Graduate to an Earning Psychologist in Months
                        </h1>
                        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Skip the struggle, Get supervised hours, and clients - all in one place.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {benefits.map(({ icon: Icon, title, desc, tag }, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-soft hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                                >
                                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto flex-shrink-0">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-foreground mb-2 text-lg">{title}</h3>
                                        {desc && <p className="text-muted-foreground text-sm leading-relaxed mb-3">{desc}</p>}
                                    </div>
                                    {tag && (
                                        <span className="inline-block text-xs font-medium text-primary/80 mt-2">
                                            {tag}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}