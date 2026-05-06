import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problems from './components/Problems'
import Transformation from './components/Transformation'
import HowItHelps from './components/HowItHelps'
import Marketplace from './components/Marketplace'
import UserJourney from './components/UserJourney'
import Platform from './components/Platform'
import WaterResilience from './components/WaterResilience'
import KnowledgeHub from './components/KnowledgeHub'
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
      <Marketplace />
      <UserJourney />
      <Platform />
      <WaterResilience />
      <KnowledgeHub />
      <Implementation />
      <ClosingCTA />
      <Footer />
    </div>
  )
}
