import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Zap,
    Trophy,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Helper: Countdown Calculation ----------
const calculateTimeLeft = (targetDate: string) => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return null;

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
};

// ---------- Animated Border ----------
const AnimatedBorder = ({
    isVisible = true,
    thickness = 8,
    radius = "1rem",
    speed = 3,
}: {
    isVisible?: boolean;
    thickness?: number;
    radius?: string;
    speed?: number;
}) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                className="absolute rounded-xl pointer-events-none z-0"
                style={{
                    top: `-${thickness}px`,
                    left: `-${thickness}px`,
                    right: `-${thickness}px`,
                    bottom: `-${thickness}px`,
                    borderRadius: radius,
                    background:
                        "linear-gradient(90deg, #f59e0b, #ef4444, #ec4899, #f97316, #dc2626, #f59e0b)",
                    backgroundSize: "400% 400%",
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                exit={{ opacity: 0 }}
                transition={{
                    backgroundPosition: {
                        duration: speed,
                        repeat: Infinity,
                        ease: "linear",
                    },
                    opacity: { duration: 0.4 },
                }}
            >
                {/* Inner mask to reveal gradient outline */}
                <div
                    className="absolute inset-[3px] dark:bg-neutral/90 rounded-xl"
                    style={{ borderRadius: radius }}
                />
            </motion.div>
        )}
    </AnimatePresence>
);

// ---------- Main Card ----------
interface PricingCardProps {
    title: string;
    originalPrice: number;
    discountedPrice?: number;
    earlyBirdSpotPercentage?: number;
    isPopular?: boolean;
    features: string[];
    targetDate?: string;
}

export default function PricingCard({
    title,
    originalPrice,
    discountedPrice,
    targetDate,
    earlyBirdSpotPercentage = 100,
    isPopular = false,
    features = [],
}: PricingCardProps) {
    const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft> | null>(
        targetDate ? calculateTimeLeft(targetDate) : null
    );

    useEffect(() => {
        if (!targetDate) return;
        const timer = setInterval(() => {
            const newTime = calculateTimeLeft(targetDate);
            setTimeLeft(newTime);
            if (!newTime) clearInterval(timer);
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const getDiscountPercentage = () => {
        if (!discountedPrice) return 0;
        return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    };

    const formatCountdown = () => {
        if (!timeLeft)
            return <span className="text-primary font-semibold">Offer expired</span>;
        return (
            <span className="font-semibold text-primary">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
        );
    };

    return (
        <div
            className={`h-full flex flex-col ${isPopular ? "relative" : ""}`}
        >
            <div className="relative h-full">
                <motion.div
                    className="h-full relative z-10"
                    whileHover={isPopular ? { scale: 1.03 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    {isPopular && <AnimatedBorder isVisible={true} thickness={6} />}

                    <Card
                        className={`h-full flex flex-col relative ${isPopular
                            ? "bg-white dark:bg-neutral-90 backdrop-blur border-none shadow-2xl"
                            : "border border-destructive/60 shadow-md"
                            } rounded-xl`}
                    >
                        {isPopular && (
                            <div className="absolute -top-2 right-4 bg-gradient-to-r from-amber-400 via-red-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-b-md shadow-md z-20">
                                🔥 MOST POPULAR
                            </div>
                        )}

                        <CardHeader className="pb-4 pt-6">
                            <CardTitle className="text-2xl font-bold text-foreground">
                                {title}
                            </CardTitle>

                            <div className="flex items-baseline gap-2">
                                {discountedPrice ? (
                                    <>
                                        <span className="text-3xl font-bold text-primary">
                                            ₹{discountedPrice.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-muted-foreground line-through">
                                            ₹{originalPrice.toLocaleString()}
                                        </span>
                                        <Badge variant="destructive">
                                            {getDiscountPercentage()}% OFF
                                        </Badge>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold text-foreground">
                                        ₹{originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-primary">
                                Early Bird Special Discount Applied !
                            </span>
                        </CardHeader>

                        <CardContent className="px-6 py-0">

                            <div className="p-3 rounded-lg bg-white border border-primary/60">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-semibold text-primary">
                                        Early Bird: few spots left
                                    </span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2 mt-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500 bg-primary"
                                        style={{
                                            width: `${earlyBirdSpotPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            {discountedPrice && (
                                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                    <div className="flex items-center gap-2 text-sm text-primary">
                                        <Clock className="w-4 h-4" />
                                        Limited Time: {formatCountdown()}
                                    </div>
                                </div>
                            )}

                            <Button
                                className={`w-full mt-4 h-12 ${isPopular
                                    ? "bg-primary hover:bg-primary/90 cursor-pointer"
                                    : "bg-primary hover:opacity-90 cursor-pointer"
                                    }`}
                                size="lg"
                            >
                                <Trophy className="w-4 h-4 mr-2" />
                                Join Founding Cohort
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>

                        <CardFooter className="pt-6 px-6 pb-6">
                            <ul className="space-y-3.5 w-full">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
