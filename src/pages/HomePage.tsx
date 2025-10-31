import Navbar from '../components/Home/navbar';
import Hero from '../components/Home/hero';
// import CountdownTimer from '../components/Home/countdown';
import Plans from '../components/Home/plans';
import ProcessSteps from '../components/Home/processsteps';
import Reviews from '../components/Home/reviews';
import EmotionalImpact from '../components/Home/emotionalimpact';
import JoinCTA from '../components/Home/joincta';
import Footer from '../components/Home/footer';

export default function Home() {

    // const targetDeadline = "2025-11-2T06:30:00Z";

    // const targetDeadline = "2025-10-29T06:30:00Z";
    return (
        <>
            <Navbar />
            <Hero />
            {/* <CountdownTimer targetDate={targetDeadline} title="⚡ Founding Cohort Closing Soon - Only 100 Spots!"
                className="max-w-md mx-auto animate-pulse-glow" /> */}
            <Plans />
            <ProcessSteps />
            <Reviews />
            <EmotionalImpact />
            <JoinCTA />
            <Footer />
        </>
    )
}