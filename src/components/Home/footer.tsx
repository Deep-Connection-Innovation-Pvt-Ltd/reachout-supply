import ReachOut from '../../assets/ReachOut.png';
import DeepConnection from '../../assets/dc_logo.png';

export default function Footer() {
    return (
        <footer className="bg-white from-background to-muted/30 border-t border-border/20 py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left Logo - ReachOut */}
                    <div className="flex-shrink-0">
                        <img
                            src={ReachOut}
                            alt="ReachOut Logo"
                            className="h-6 w-auto object-contain"
                            loading="lazy"
                        />
                    </div>

                    {/* Center Text */}
                    <div className="text-center">
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">
                            ReachOut — an initiative by Deep Connection <span className="text-pink-500">❤️</span>
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Empowering connections, one conversation at a time
                        </p>
                    </div>

                    {/* Right Logo - Deep Connection */}
                    <div className="flex-shrink-0">
                        <img
                            src={DeepConnection}
                            alt="Deep Connection Logo"
                            className="h-12 w-auto object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
                    <a href="https://www.deepconnection.life/T&C" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</a>
                    <a href="https://www.deepconnection.life/contact" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
                    <a href="https://www.deepconnection.life/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                </div>

                {/* Copyright */}
                <div className="pt-6 border-t border-border/10 text-center">
                    <p className="text-xs text-muted-foreground/60">
                        © {new Date().getFullYear()} Deep Connection Innovation Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}