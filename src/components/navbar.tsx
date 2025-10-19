import { Button } from './ui/button';

export default function Navbar() {
    return (
        <>
            <div className="flex justify-between w-full items-center bg-background px-[80px] py-[16px] sticky top-0 z-99">
                <img
                    src="./ReachOut.png"
                    alt="ReachOut Logo"
                    className="h-6 w-auto object-contain"
                />
                <Button variant="default"
                    onClick={() => {
                        const pricingSection = document.getElementById('programs');
                        if (pricingSection) {
                            pricingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    size="default"
                    className="px-4 sm:px-6 py-3 cursor-pointer text-sm sm:text-base min-h-[44px]">
                    Join Founding Cohort
                </Button>
            </div>
        </>
    )
};