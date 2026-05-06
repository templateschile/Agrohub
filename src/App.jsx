import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problems from './components/Problems'
import Transformation from './components/Transformation'
import HowItHelps from './components/HowItHelps'
import Platform from './components/Platform'
import EcosystemSection from './components/EcosystemSection'
import WaterResilience from './components/WaterResilience'
import KnowledgeHub from './components/KnowledgeHub'
import Marketplace from './components/Marketplace'
import Implementation from './components/Implementation'
import ClosingCTA from './components/ClosingCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problems />
      <Transformation />
      <HowItHelps />
      <Platform />
      <EcosystemSection />
      <WaterResilience />
      <KnowledgeHub />
      <Marketplace />
      <Implementation />
      <ClosingCTA />
      <Footer />
    </div>
  )
}
