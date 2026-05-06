import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Problems from './components/Problems'
import Transformation from './components/Transformation'
import Platform from './components/Platform'
import EcosystemSection from './components/EcosystemSection'
import WaterResilience from './components/WaterResilience'
import Implementation from './components/Implementation'
import ClosingCTA from './components/ClosingCTA'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <Problems />
      <Transformation />
      <Platform />
      <EcosystemSection />
      <WaterResilience />
      <Implementation />
      <ClosingCTA />
      <Footer />
      <FloatingCTA />
    </div>
  )
}
