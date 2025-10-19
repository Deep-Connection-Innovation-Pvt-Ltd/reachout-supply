import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: string;
    title?: string;
    className?: string;
}

const calculateTimeLeft = (targetDate: string) => {
    const difference = +new Date(targetDate) - +new Date();

    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    return timeLeft;
};

export default function CountdownTimer({
    targetDate,
    title = "Early Bird Deadline",
    className = ""
}: CountdownTimerProps) {

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const initialTimeLeft = calculateTimeLeft(targetDate);
        if (initialTimeLeft.days === 0 && initialTimeLeft.hours === 0 && initialTimeLeft.minutes === 0 && initialTimeLeft.seconds === 0) {
            setIsExpired(true);
            return;
        }

        // Set up the interval
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(targetDate);

            if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
                // Time is up!
                setTimeLeft(newTimeLeft);
                setIsExpired(true);
                clearInterval(timer); // Stop the interval
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timerComponents = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
    ];

    return (
        <section className="py-16 bg-primary/30">
            <div className="container mx-auto px-6">

                <div className={`bg-primary text-primary-foreground p-6 rounded-lg shadow-glow ${className}`}>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <h3 className="text-lg font-bold">{title}</h3>
                        </div>

                        {isExpired ? (
                            <div className="text-2xl font-bold p-8 bg-white/10 rounded-lg">
                                Deadline Passed!
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-4 text-center">
                                {timerComponents.map(({ label, value }) => (
                                    <div key={label} className="bg-white/10 rounded-lg p-3">
                                        <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
                                        <div className="text-xs opacity-90">{label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 text-sm opacity-90 flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4" />
                            {isExpired ? (
                                <span>This exclusive opportunity has ended.</span>
                            ) : (
                                <span>Hurry! Don't miss this exclusive opportunity</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}