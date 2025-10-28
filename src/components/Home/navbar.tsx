import { Button } from '../ui/button';
import reachout from '@/assets/ReachOut.png';

export default function Navbar() {
    return (
        <>
            {/* Changed px-[80px] to px-4 for mobile (default) 
              and then used sm:px-[80px] to apply the larger padding 
              only on small screens and up.
            */}
            <div className="flex justify-between w-full items-center bg-background px-4 sm:px-[80px] py-[16px] sticky top-0 z-99">
                <img
                    src={reachout}
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
                    // Removed extra padding/sizing classes from button for simplicity
                    // or you could adjust them like `px-3 sm:px-6` if needed.
                    className="px-4 py-3 cursor-pointer text-sm min-h-[44px]">
                    Join Founding Cohort
                </Button>
            </div>
        </>
    )
};