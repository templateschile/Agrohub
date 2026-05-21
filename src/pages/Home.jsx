import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import Problems from '../components/Problems'
import Transformation from '../components/Transformation'
import EcosystemSection from '../components/EcosystemSection'
import ClosingCTA from '../components/ClosingCTA'
import ModulesPreview from '../components/ModulesPreview'

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Problems />
      <Transformation />
      <ModulesPreview />
      <EcosystemSection />
      <ClosingCTA />
    </>
  )
}
