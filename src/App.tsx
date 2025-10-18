import './App.css'
import Navbar from './components/navbar';
import Hero from './components/hero';
import CountdownTimer from './components/countdown';
import Plans from './components/plans';
function App() {
  const targetDeadline = "2025-10-19T21:13:00Z";
  return (
    <>
      <Navbar />
      <Hero />
      <CountdownTimer targetDate={targetDeadline} title="⚡ Founding Cohort Closing Soon - Only 100 Spots!"
        className="max-w-md mx-auto animate-pulse-glow" />
      <Plans/>
    </>
  )
}

export default App
